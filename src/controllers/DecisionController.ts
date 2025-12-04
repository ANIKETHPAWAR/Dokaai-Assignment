import { Request, Response } from 'express';

import { decisionRequestSchema } from '../dtos/decision.dto';
import { DecisionService } from '../services/DecisionService';
import { sendSuccess } from '../utils/response';

export class DecisionController {
  constructor(private readonly decisionService: DecisionService) {}

  evaluate = (req: Request, res: Response) => {
    const payload = decisionRequestSchema.parse(req.body);
    const result = this.decisionService.evaluate(payload);

    return sendSuccess(res, {
      data: result,
    });
  };
}

