import { ServiceLoginOwner } from './service-login-owner';
import { ServiceLogin }      from './service-login';

export * from './service-login-owner';
export * from './service-login';

export const LOGIN_SERVICES = [
  ServiceLoginOwner,
  ServiceLogin
];