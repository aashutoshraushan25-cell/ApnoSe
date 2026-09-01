import { RiskLevel } from '../models/Report';

export interface SafetyScanResult {
  riskLevel: RiskLevel;
  warnings: string[];
  isFlagged: boolean;
  category?: 'otp_phishing' | 'financial_fraud' | 'suspicious_link' | 'harassment' | 'none';
}

export class SafetyService {
  private static OTP_KEYWORDS = [
    'otp',
    'one time password',
    'ओटीपी',
    'पासवर्ड',
    'password',
    'pin',
    'verification code',
    'सत्यापन कोड',
  ];

  private static MONEY_KEYWORDS = [
    'send money',
    'transfer money',
    'gpay',
    'phonepe',
    'paytm',
    'google pay',
    'bank account',
    'पैसे भेजो',
    'रुपये भेजो',
    'खाता संख्या',
    'urgently need money',
    'इनाम मिला',
    'लॉटरी',
    'lottery',
    'prize money',
    'kyc update',
    'केवाईसी',
  ];

  private static SUSPICIOUS_DOMAINS = [
    'bit.ly',
    'tinyurl.com',
    '.xyz',
    '.top',
    '.click',
    '.loan',
    '.free',
    'free-gift',
    'win-prize',
  ];

  /**
   * Evaluates text content for potential scams and fraud targeting senior citizens
   */
  public static scanContent(text: string): SafetyScanResult {
    if (!text || typeof text !== 'string') {
      return { riskLevel: 'low', warnings: [], isFlagged: false, category: 'none' };
    }

    const lower = text.toLowerCase();
    const warnings: string[] = [];
    let riskLevel: RiskLevel = 'low';
    let category: SafetyScanResult['category'] = 'none';

    // 1. Check for OTP / Password Phishing (High Risk)
    const matchesOtp = this.OTP_KEYWORDS.some((kw) => lower.includes(kw));
    if (matchesOtp && (lower.includes('share') || lower.includes('बताओ') || lower.includes('दीजिये') || lower.includes('send'))) {
      riskLevel = 'high';
      category = 'otp_phishing';
      warnings.push('चेतावनी: किसी के साथ भी अपना OTP या पासवर्ड साझा न करें। Apno Se कभी भी आपसे OTP नहीं मांगता।');
    }

    // 2. Check for Financial / Lottery Scams (Medium to High Risk)
    const matchesMoney = this.MONEY_KEYWORDS.filter((kw) => lower.includes(kw));
    if (matchesMoney.length >= 2) {
      riskLevel = riskLevel === 'high' ? 'high' : 'medium';
      if (category === 'none') category = 'financial_fraud';
      warnings.push('सावधानी: अपरिचित व्यक्तियों को पैसे भेजने या लॉटरी संदेशों पर विश्वास करने से बचें।');
    }

    // 3. Check for Suspicious Links
    const matchesLink = this.SUSPICIOUS_DOMAINS.some((domain) => lower.includes(domain));
    if (matchesLink) {
      riskLevel = riskLevel === 'high' ? 'high' : 'medium';
      if (category === 'none') category = 'suspicious_link';
      warnings.push('सावधानी: इस संदेश में एक अनजान लिंक शामिल है। इस पर क्लिक न करें।');
    }

    return {
      riskLevel,
      warnings,
      isFlagged: riskLevel !== 'low',
      category,
    };
  }
}
