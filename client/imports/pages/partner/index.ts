import { PartnerLoginPage }     from './partner-login-page';
import { PartnerPage }          from './partner-page';
import { PartnerAddClientForm } from './partner-addclient-form';

export * from './partner-login-page';
export * from './partner-page';

export const PARTNER_PAGES = [
  PartnerLoginPage,
  PartnerPage,
  PartnerAddClientForm
];