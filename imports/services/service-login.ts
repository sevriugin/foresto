import { Injectable } from '@angular/core';

@Injectable()
export class ServiceLogin {

  constructor() {}
 
  loginPartner(email: string, pass: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      Meteor.loginWithPassword({ email: email }, pass, (e: Error) => {
        if (e) {
          return reject(e);
        }
     
        resolve();
      });
    });
  }
 
  loginClient(phone: string, code: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      Meteor.loginWithPassword({ username: phone }, code, (e: Error) => {
        if (e) {
          return reject(e);
        }
     
        resolve();
      });
    });
  }
 
  logout(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      Meteor.logout((e: Error) => {
        if (e) {
          return reject(e);
        }
 
        resolve();
      });
    });
  }

}