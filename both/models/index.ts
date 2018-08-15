export interface Item {
_id?: string;
_createdBy?: string;
}

export enum UserRole {
  OWNER = 'owner',
  PARTNER = 'partner',
  CLIENT = 'client'
}

export enum Pattern {
  EMAIL = "^[a-z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$",
  PHONE = "^[+][0-9] [(][0-9]{3}[)] [0-9]{3}-[0-9]{4}$"
}

export const Mask_PHONE = ['+', '7', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

export const OfferSize = ['Большой', 'Средний'];

export * from './model-user';
export * from './model-offer';
export * from './model-token';
export * from './model-subpool';
export * from './task';
