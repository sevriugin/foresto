export interface Item {
_id?: string;
_createdBy?: string;
}

export enum Role {
  OWNER = 'owner',
  PARTNER = 'partner',
  CLIENT = 'client'
}

export * from './model-count';
export * from './model-owner';
export * from './model-partner';
export * from './model-client';
export * from './model-user';
export * from './model-offer';
export * from './model-token';
export * from './model-subpool';
export * from './task';

export enum Pattern {
  EMAIL = "^[a-z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$",
  PHONE = "^[+][0-9] [(][0-9]{3}[)] [0-9]{3}-[0-9]{4}$"
}

export const Mask_PHONE = ['+', '7', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

export const OfferSize = ['Большой', 'Средний'];
