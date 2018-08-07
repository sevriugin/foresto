import { Component } from '@angular/core';
import { Router }    from '@angular/router';

import { LoginService } from 'imports/services';
import { Pattern }      from 'both/models';

@Component({
  templateUrl: './owner-register-page.html'
})
export class OwnerRegisterPage {
  
  email: string;
  readonly emailPattern = Pattern.EMAIL;

  constructor(
    readonly router: Router,
    readonly loginService: LoginService
  ) {}

  onInputKeypress({keyCode}: KeyboardEvent): void {
    if (keyCode === 13) {
      this.register();
    }
  }
 
  register(): void {
    if (!this.valid()) {
      return;
    }

    this.loginService.registerOwner(this.email)
    .then(() => {
      this.router.navigate(['/owner']);
    })
    .catch((e) => {
      this.handleError(e);
    });
  }
 
  valid(): boolean {
    var result: boolean = 
      !!this.email && 
      !!this.email.match(this.emailPattern);

    return result;
  }

  handleError(e: Error): void {
    console.error(e);
    alert('Ошибка: ' + e.message);
  }

}