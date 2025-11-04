import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { USER_TYPES_KEY } from './user-type.decorator';
import { UserType } from './user-type.enum';
import { UsersService } from "../users.service";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredTypes = this.reflector.getAllAndOverride<UserType[]>(USER_TYPES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredTypes) {
      return true;
    }
    const { userReq } = context.switchToHttp().getRequest();
    if (!userReq) {
      return false;
    }
    const user = await this.usersService.findUserById(userReq.id);
    return requiredTypes.some((type) => user.type === type);
  }
}