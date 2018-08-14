import { PartnerLoginPage }     from './partner-login-page';
import { PartnerPage }          from './partner-page';
import { PartnerClientForm }    from './partner-client-form';
import { PartnerClientAddForm } from './partner-clientadd-form';
import { PartnerOfferForm }     from './partner-offer-form';
import { PartnerOfferAddForm }  from './partner-offeradd-form';
import { PartnerTokenForm }     from './partner-token-form';

export * from './partner-login-page';
export * from './partner-page';

export const PARTNER_PAGES = [
  PartnerLoginPage,
  PartnerPage,
  PartnerClientForm,
  PartnerClientAddForm,
  PartnerOfferForm,
  PartnerOfferAddForm,
  PartnerTokenForm
];