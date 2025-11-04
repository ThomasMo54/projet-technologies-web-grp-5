import { SetMetadata } from '@nestjs/common';
import { UserType } from './user-type.enum';

export const USER_TYPES_KEY = 'types';

export const UserTypes = (...types: UserType[]) => SetMetadata(USER_TYPES_KEY, types);