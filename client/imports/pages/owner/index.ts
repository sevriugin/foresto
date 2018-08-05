import { OwnerRegisterPage }   from './owner-register-page';
import { OwnerLoginPage }      from './owner-login-page';
import { OwnerPage }           from './owner-page';
import { OwnerAddPartnerForm } from './owner-addpartner-form';

export * from './owner-register-page';
export * from './owner-login-page';
export * from './owner-page';

export const OWNER_PAGES = [
  OwnerRegisterPage,
  OwnerLoginPage,
  OwnerPage,
  OwnerAddPartnerForm
];