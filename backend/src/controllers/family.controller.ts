import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { FamilyMember } from '../models/FamilyMember';
import { User } from '../models/User';
import { NotificationService } from '../services/notification.service';
import { sendSuccess, sendError } from '../utils/response';

export class FamilyController {
  /**
   * POST /api/v1/family
   */
  public static async addFamilyMember(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const userId = req.user?.userId!;
      const { memberId, relationship, customRelationName } = req.body;

      if (!memberId || !relationship) {
        return sendError(res, 'सदस्य और संबंध चुनना आवश्यक है।', 400, 'MEMBER_RELATION_REQUIRED');
      }

      if (memberId === userId) {
        return sendError(res, 'आप स्वयं को परिवार के सदस्य के रूप में नहीं जोड़ सकते।', 400, 'SELF_RELATION');
      }

      const userObjId = new mongoose.Types.ObjectId(userId);
      const memberObjId = new mongoose.Types.ObjectId(memberId);

      const targetUser = await User.findById(memberObjId);
      if (!targetUser) {
        return sendError(res, 'उपयोगकर्ता नहीं मिला।', 404, 'USER_NOT_FOUND');
      }

      const existing = await FamilyMember.findOne({
        userId: userObjId,
        memberId: memberObjId,
      });

      if (existing) {
        existing.relationship = relationship;
        if (customRelationName) existing.customRelationName = customRelationName;
        await existing.save();
        await existing.populate('memberId', 'name profilePhoto age location bio language');
        return sendSuccess(res, existing, 'पारिवारिक संबंध अपडेट किया गया।');
      }

      const familyMember = new FamilyMember({
        userId: userObjId,
        memberId: memberObjId,
        relationship,
        customRelationName,
        status: 'confirmed',
      });

      await familyMember.save();
      await familyMember.populate('memberId', 'name profilePhoto age location bio language');

      // Notify target user
      await NotificationService.createNotification({
        recipientId: memberObjId,
        senderId: userObjId,
        type: 'family_request',
        title: 'पारिवारिक संबंध जोड़ा गया 👨‍👩‍👧‍👦',
        body: `ने आपको परिवार में जोड़ा है।`,
        targetId: userObjId,
        targetModel: 'User',
      });

      return sendSuccess(res, familyMember, 'परिवार का सदस्य सफलतापूर्वक जोड़ा गया।', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/family
   */
  public static async getFamilyMembers(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const userId = req.user?.userId!;
      const members = await FamilyMember.find({
        userId: new mongoose.Types.ObjectId(userId),
      })
        .populate('memberId', 'name profilePhoto age location bio language lastSeen isVerified')
        .sort({ createdAt: -1 })
        .lean();

      return sendSuccess(res, members);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/family/:id
   */
  public static async updateFamilyMember(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId!;
      const { relationship, customRelationName } = req.body;

      const member = await FamilyMember.findOne({
        _id: new mongoose.Types.ObjectId(id),
        userId: new mongoose.Types.ObjectId(userId),
      });

      if (!member) {
        return sendError(res, 'पारिवारिक रिकॉर्ड नहीं मिला।', 404, 'NOT_FOUND');
      }

      if (relationship) member.relationship = relationship;
      if (customRelationName !== undefined) member.customRelationName = customRelationName;

      await member.save();
      await member.populate('memberId', 'name profilePhoto age location bio language');

      return sendSuccess(res, member, 'पारिवारिक संबंध अपडेट किया गया।');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/family/:id
   */
  public static async removeFamilyMember(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId!;

      const deleted = await FamilyMember.findOneAndDelete({
        _id: new mongoose.Types.ObjectId(id),
        userId: new mongoose.Types.ObjectId(userId),
      });

      if (!deleted) {
        return sendError(res, 'पारिवारिक रिकॉर्ड नहीं मिला।', 404, 'NOT_FOUND');
      }

      return sendSuccess(res, null, 'परिवार से हटाया गया।');
    } catch (error) {
      next(error);
    }
  }
}
