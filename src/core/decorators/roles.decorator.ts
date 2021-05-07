import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiForbiddenResponse } from '@nestjs/swagger';
import { Role } from '../enums/role.enum';
import { RolesGuard } from '../guards/roles.guard';
import { JwtAuth } from './jwt-auth.decorator';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) =>
  applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    JwtAuth(),
    UseGuards(RolesGuard),
    ApiForbiddenResponse({
      description: '用户没有权限访问',
    }),
  );
