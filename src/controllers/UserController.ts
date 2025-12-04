import { Request, Response } from 'express';

import { createUserSchema, updateUserSchema } from '../dtos/user.dto';
import { AppError } from '../errors/AppError';
import { UserService } from '../services/UserService';
import { sendSuccess } from '../utils/response';

export class UserController {
  constructor(private readonly userService: UserService) {}

  create = (req: Request, res: Response) => {
    const payload = createUserSchema.parse(req.body);
    const user = this.userService.createUser(payload);

    return sendSuccess(res, {
      statusCode: 201,
      message: 'User created',
      data: user,
    });
  };

  list = (_req: Request, res: Response) => {
    const users = this.userService.listUsers();

    return sendSuccess(res, {
      data: users,
    });
  };

  getById = (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      throw new AppError({
        message: 'User id is required',
        statusCode: 400,
        code: 'INVALID_USER_ID',
      });
    }

    const user = this.userService.getUserById(id);

    return sendSuccess(res, {
      data: user,
    });
  };

  update = (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      throw new AppError({
        message: 'User id is required',
        statusCode: 400,
        code: 'INVALID_USER_ID',
      });
    }

    const payload = updateUserSchema.parse(req.body);
    const user = this.userService.updateUser(id, payload);

    return sendSuccess(res, {
      message: 'User updated',
      data: user,
    });
  };

  delete = (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      throw new AppError({
        message: 'User id is required',
        statusCode: 400,
        code: 'INVALID_USER_ID',
      });
    }

    this.userService.deleteUser(id);

    return sendSuccess(res, {
      message: 'User deleted',
    });
  };
}

