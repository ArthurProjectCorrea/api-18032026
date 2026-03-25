import { SetMetadata } from '@nestjs/common';
import { Screen, Action } from '@/common/constants/permissions';

export const PERMISSIONS_KEY = 'permissions';

export interface RequiredPermission {
  screen: Screen;
  action: Action;
}

export const CheckPermissions = (screen: Screen, action: Action) =>
  SetMetadata(PERMISSIONS_KEY, { screen, action });
