import { ClientLoginPage } from './client-login-page';
import { ClientPage }      from './client-page';
import { ClientOfferForm } from './client-offer-form';
import { ClientTokenForm } from './client-token-form';

export * from './client-login-page';
export * from './client-page';

export const CLIENT_PAGES = [
  ClientLoginPage,
  ClientPage,
  ClientOfferForm,
  ClientTokenForm
];