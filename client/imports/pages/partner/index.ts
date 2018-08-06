import { PartnerLoginPage }     from './partner-login-page';
import { PartnerPage }          from './partner-page';
import { PartnerAddClientForm } from './partner-addclient-form';
import { PartnerAddOfferForm }  from './partner-addoffer-form';

export * from './partner-login-page';
export * from './partner-page';

export const PARTNER_PAGES = [
  PartnerLoginPage,
  PartnerPage,
  PartnerAddClientForm,
  PartnerAddOfferForm
];