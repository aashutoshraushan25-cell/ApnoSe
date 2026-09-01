import { User, IUser, SupportedLanguage } from '../models/User';
import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { AppError } from '../middleware/error.middleware';

export interface RegisterInput {
  name: string;
  email?: string;
  phone?: string;
  password: string;
  dateOfBirth: string | Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  location?: string;
  language?: SupportedLanguage;
  profilePhoto?: string;
  encryptionEnabled?: boolean;
}

export interface AuthResponse {
  user: Partial<IUser>;
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  /**
   * Calculates age from date of birth (Server-authoritative calculation)
   */
  public static calculateAge(dob: Date): number {
    const diffMs = Date.now() - dob.getTime();
    const ageDate = new Date(diffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  /**
   * Register a new user with 40+ age verification
   */
  public static async register(input: RegisterInput): Promise<AuthResponse> {
    const dob = new Date(input.dateOfBirth);
    if (isNaN(dob.getTime())) {
      throw new AppError('अमान्य जन्म तिथि (Invalid date of birth).', 400, 'INVALID_DOB');
    }

    // Enforce 40+ age restriction on server side
    const age = this.calculateAge(dob);
    if (age < 40) {
      throw new AppError(
        'Apno Se केवल 40 वर्ष या उससे अधिक आयु के प्रियजनों के लिए है। (Apno Se is exclusively for users aged 40 and above).',
        400,
        'AGE_RESTRICTION_FAILED'
      );
    }

    if (!input.email && !input.phone) {
      throw new AppError('कृपया मोबाइल नंबर या ईमेल दर्ज करें।', 400, 'CONTACT_REQUIRED');
    }

    // Check if email already registered
    if (input.email) {
      const existingEmail = await User.findOne({ email: input.email.toLowerCase().trim() });
      if (existingEmail) {
        throw new AppError('यह ईमेल पहले से पंजीकृत है।', 409, 'EMAIL_EXISTS');
      }
    }

    // Check if phone already registered
    if (input.phone) {
      const existingPhone = await User.findOne({ phone: input.phone.trim() });
      if (existingPhone) {
        throw new AppError('यह मोबाइल नंबर पहले से पंजीकृत है।', 409, 'PHONE_EXISTS');
      }
    }

    // Hash password
    const passwordHash = await hashPassword(input.password);

    // Create user
    const user = new User({
      name: input.name.trim(),
      email: input.email ? input.email.toLowerCase().trim() : undefined,
      phone: input.phone ? input.phone.trim() : undefined,
      passwordHash,
      dateOfBirth: dob,
      age,
      gender: input.gender || 'prefer_not_to_say',
      location: input.location?.trim() || 'नई दिल्ली, भारत',
      language: input.language || 'hi',
      profilePhoto: input.profilePhoto || undefined,
      encryptionEnabled: input.encryptionEnabled ?? true,
    });

    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      phone: user.phone,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      phone: user.phone,
      role: user.role,
    });

    // Store refresh token
    user.refreshToken = refreshToken;
    await user.save();

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken,
    };
  }

  /**
   * Login with email or phone + password
   */
  public static async login(identifier: string, password: string): Promise<AuthResponse> {
    const cleanIdentifier = identifier.trim();
    const isEmail = cleanIdentifier.includes('@');

    const query = isEmail
      ? { email: cleanIdentifier.toLowerCase() }
      : { phone: cleanIdentifier };

    const user = await User.findOne(query).select('+passwordHash +refreshToken');

    if (!user) {
      throw new AppError('खाता नहीं मिला। कृपया अपना विवरण जांचें।', 401, 'INVALID_CREDENTIALS');
    }

    if (!user.isActive) {
      throw new AppError('यह खाता निष्क्रिय है।', 403, 'ACCOUNT_DEACTIVATED');
    }

    if (user.isBlocked) {
      throw new AppError('सुरक्षा कारणों से यह खाता निलंबित किया गया है।', 403, 'ACCOUNT_BLOCKED');
    }

    // Compare password
    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('गलत पासवर्ड। कृपया पुनः प्रयास करें।', 401, 'INVALID_CREDENTIALS');
    }

    // Update last seen
    user.lastSeen = new Date();

    // Generate new tokens
    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      phone: user.phone,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      phone: user.phone,
      role: user.role,
    });

    user.refreshToken = refreshToken;
    await user.save();

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh Token Rotation
   */
  public static async refreshToken(token: string): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = verifyRefreshToken(token);
    if (!payload) {
      throw new AppError('अमान्य या समाप्त रिफ्रेश टोकन (Invalid or expired refresh token)', 401, 'INVALID_REFRESH_TOKEN');
    }

    const user = await User.findById(payload.userId).select('+refreshToken');
    if (!user || user.refreshToken !== token) {
      throw new AppError('टोकन पुनः उपयोग चेतावनी (Token reuse detected or revoked)', 401, 'TOKEN_REVOKED');
    }

    // Issue rotated tokens
    const newAccessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      phone: user.phone,
      role: user.role,
    });

    const newRefreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      phone: user.phone,
      role: user.role,
    });

    user.refreshToken = newRefreshToken;
    await user.save();

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Logout (revoke refresh token)
   */
  public static async logout(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, {
      $unset: { refreshToken: 1 },
      lastSeen: new Date(),
    });
  }
}
