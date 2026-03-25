export const SCREENS = {
  DASHBOARD: 'dashboard',
  USERS: 'users',
  DEPARTMENTS: 'departments',
  POSITIONS: 'positions',
  SEEU_SERVICE: 'seeu_service',
  PEOPLE: 'people',
  SCREENS: 'screens',
  PERMISSIONS: 'permissions',
  ACCESSES: 'accesses',
} as const;

export const ACTIONS = {
  VIEW: 'view',
  CREATE: 'create',
  EDIT: 'edit',
  DELETE: 'delete',
  PRINT: 'print',
} as const;

export type Screen = (typeof SCREENS)[keyof typeof SCREENS];
export type Action = (typeof ACTIONS)[keyof typeof ACTIONS];
export type Scope = 'all' | 'department' | 'own';
