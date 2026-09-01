import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Report, ReportReason, ReportTargetType } from '../models/Report';
import { SafetyService } from '../services/safety.service';
import { sendSuccess, sendError } from '../utils/response';
import { getPaginationOptions, buildPaginationMetadata } from '../utils/pagination';

export class ReportController {
  /**
   * POST /api/v1/reports
   */
  public static async createReport(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const reporterId = req.user?.userId!;
      const { targetType = 'user', targetId, reason = 'scam', description, evidence } = req.body;

      if (!description && !targetId) {
        return sendError(res, 'रिपोर्ट का विवरण या खाता नंबर आवश्यक है।', 400, 'REPORT_FIELDS_REQUIRED');
      }

      // Check risk level using SafetyService heuristic
      const scan = SafetyService.scanContent(description || '');
      const riskLevel = scan.riskLevel;

      const validTargetId = targetId && mongoose.isValidObjectId(targetId)
        ? new mongoose.Types.ObjectId(targetId)
        : new mongoose.Types.ObjectId();

      const report = new Report({
        reporterId: new mongoose.Types.ObjectId(reporterId),
        targetType: (targetType as ReportTargetType) || 'user',
        targetId: validTargetId,
        reason: (reason as ReportReason) || 'scam',
        description: (description || `Reported account: ${targetId || 'Unknown'}`).trim(),
        evidence: evidence || [],
        riskLevel,
        status: 'pending',
      });

      await report.save();

      return sendSuccess(
        res,
        report,
        'आपकी सुरक्षा रिपोर्ट दर्ज कर ली गई है। हमारी सुरक्षा टीम इसकी समीक्षा करेगी। धन्यवाद! 🛡️',
        201
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/reports (Admin / Moderator)
   */
  public static async getReports(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { status, riskLevel, page, limit } = req.query;
      const { page: p, limit: l, skip } = getPaginationOptions(page, limit);

      const filter: any = {};
      if (status) filter.status = status;
      if (riskLevel) filter.riskLevel = riskLevel;

      const total = await Report.countDocuments(filter);
      const reports = await Report.find(filter)
        .sort({ riskLevel: -1, createdAt: -1 })
        .skip(skip)
        .limit(l)
        .populate('reporterId', 'name profilePhoto age location')
        .populate('reviewedBy', 'name')
        .lean();

      return sendSuccess(res, reports, undefined, 200, buildPaginationMetadata(total, p, l));
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/reports/:id (Admin / Moderator)
   */
  public static async updateReportStatus(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { id } = req.params;
      const reviewerId = req.user?.userId!;
      const { status, resolutionNotes } = req.body;

      const report = await Report.findByIdAndUpdate(
        id,
        {
          $set: {
            status,
            resolutionNotes,
            reviewedBy: new mongoose.Types.ObjectId(reviewerId),
          },
        },
        { new: true }
      );

      if (!report) {
        return sendError(res, 'रिपोर्ट नहीं मिली।', 404, 'NOT_FOUND');
      }

      return sendSuccess(res, report, 'रिपोर्ट स्थिति अपडेट की गई।');
    } catch (error) {
      next(error);
    }
  }
}
