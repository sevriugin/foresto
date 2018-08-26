import { Injectable } from '@angular/core';

import { Role } from 'both/models';

@Injectable()
export class ServiceLoginOwner {

  constructor() {}
 
  registerOwner(email: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const userId = Accounts.createUser({ email: email, password: '******', profile: { role: Role.OWNER } }, (e: Error) => {
        if (e) {
          return reject(e);
        }

        resolve();
      });
    });
  }

  loginOwner(email: string, pass: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      Meteor.loginWithPassword({ email: email }, pass, (e: Error) => {
        if (e) {
          return reject(e);
        }
     
        resolve();
      });
    });
  }

}