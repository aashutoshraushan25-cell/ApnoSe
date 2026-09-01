import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { sendError } from '../utils/response';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      // Replace req with parsed values (for coercion/defaults)
      req.body = parsed.body || req.body;
      req.query = parsed.query || req.query;
      req.params = parsed.params || req.params;
      return next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        const errorList = error.errors.map((err: any) => ({
          field: err.path.join('.').replace(/^(body|query|params)\./, ''),
          message: err.message,
        }));
        return sendError(res, 'Validation error: please check required fields.', 400, 'VALIDATION_ERROR', errorList);
      }
      return next(error);
    }
  };
};
