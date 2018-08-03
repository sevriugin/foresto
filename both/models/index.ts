export interface Item {
_id?: string;
_createdBy?: string;
}

export enum UserRole {
  OWNER = 'owner',
  PARTNER = 'partner',
}

export enum UserRoleLoc {
  owner = 'владелец',
  partner = 'партнер',
}

export enum Pattern {
  EMAIL = "^[a-z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$"
}

export * from './user';
export * from './task';