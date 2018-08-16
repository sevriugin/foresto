import { OwnerRegisterPage }   from './owner-register-page';
import { OwnerLoginPage }      from './owner-login-page';
import { OwnerPage }           from './owner-page';
import { OwnerPartnerForm }    from './owner-partner-form';
import { OwnerPartnerAddForm } from './owner-partneradd-form';
import { OwnerSubPoolForm }    from './owner-subpool-form';

export * from './owner-register-page';
export * from './owner-login-page';
export * from './owner-page';

export const OWNER_PAGES = [
  OwnerRegisterPage,
  OwnerLoginPage,
  OwnerPage,
  OwnerPartnerForm,
  OwnerPartnerAddForm,
  OwnerSubPoolForm
];