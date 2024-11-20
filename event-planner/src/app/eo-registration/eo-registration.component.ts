import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-eo-registration',
  templateUrl: './eo-registration.component.html',
  styleUrls: ['./eo-registration.component.css']
})
export class EORegistrationComponent {

  constructor(private router: Router) {}

    sendActivationEmail() {
      alert("Activation email has been sent.");
    }
}