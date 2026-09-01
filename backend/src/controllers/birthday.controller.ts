import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { Friendship } from '../models/Friendship';
import { FamilyMember } from '../models/FamilyMember';
import { sendSuccess } from '../utils/response';

export class BirthdayController {
  /**
   * Helper to retrieve eligible contact IDs (Friends & Family)
   */
  private static async getConnectedUserIds(userId: string): Promise<mongoose.Types.ObjectId[]> {
    const userObjId = new mongoose.Types.ObjectId(userId);

    const [friendships, familyMembers] = await Promise.all([
      Friendship.find({
        status: 'accepted',
        $or: [{ requesterId: userObjId }, { recipientId: userObjId }],
      }),
      FamilyMember.find({
        status: 'confirmed',
        $or: [{ userId: userObjId }, { memberId: userObjId }],
      }),
    ]);

    const ids = new Set<string>();
    friendships.forEach((f) => {
      ids.add(f.requesterId.equals(userObjId) ? f.recipientId.toString() : f.requesterId.toString());
    });
    familyMembers.forEach((fm) => {
      ids.add(fm.userId.equals(userObjId) ? fm.memberId.toString() : fm.userId.toString());
    });

    return Array.from(ids).map((id) => new mongoose.Types.ObjectId(id));
  }

  /**
   * GET /api/v1/birthdays/today
   */
  public static async getTodayBirthdays(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const userId = req.user?.userId!;
      const connectedIds = await BirthdayController.getConnectedUserIds(userId);

      const today = new Date();
      const currentMonth = today.getMonth() + 1; // 1-indexed for MongoDB $month
      const currentDay = today.getDate();

      const users = await User.aggregate([
        {
          $match: {
            _id: { $in: connectedIds },
            isActive: true,
            isBlocked: false,
            'privacySettings.birthdayVisibility': { $ne: 'nobody' },
          },
        },
        {
          $project: {
            name: 1,
            profilePhoto: 1,
            age: 1,
            location: 1,
            language: 1,
            dateOfBirth: 1,
            birthMonth: { $month: '$dateOfBirth' },
            birthDay: { $dayOfMonth: '$dateOfBirth' },
          },
        },
        {
          $match: {
            birthMonth: currentMonth,
            birthDay: currentDay,
          },
        },
      ]);

      return sendSuccess(res, users);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/birthdays/upcoming
   */
  public static async getUpcomingBirthdays(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const userId = req.user?.userId!;
      const connectedIds = await BirthdayController.getConnectedUserIds(userId);

      const users = await User.find({
        _id: { $in: connectedIds },
        isActive: true,
        isBlocked: false,
        'privacySettings.birthdayVisibility': { $ne: 'nobody' },
      })
        .select('name profilePhoto age location dateOfBirth')
        .lean();

      const today = new Date();
      const thisYear = today.getFullYear();

      const upcoming = users
        .map((u) => {
          const dob = new Date(u.dateOfBirth);
          let nextBirthday = new Date(thisYear, dob.getMonth(), dob.getDate());

          // If birthday already passed this year, set to next year
          if (nextBirthday.getTime() < today.setHours(0, 0, 0, 0)) {
            nextBirthday = new Date(thisYear + 1, dob.getMonth(), dob.getDate());
          }

          const diffDays = Math.ceil((nextBirthday.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          return {
            ...u,
            daysUntil: diffDays,
            turningAge: (u.age || 40) + (nextBirthday.getFullYear() - thisYear),
            birthdayDate: nextBirthday,
          };
        })
        .filter((u) => u.daysUntil >= 0 && u.daysUntil <= 30)
        .sort((a, b) => a.daysUntil - b.daysUntil);

      return sendSuccess(res, upcoming);
    } catch (error) {
      next(error);
    }
  }
}
