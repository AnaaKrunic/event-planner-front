import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-spp-registration',
  templateUrl: './spp-registration.component.html',
  styleUrls: ['./spp-registration.component.css']
})
export class SPPRegistrationComponent {

  constructor(private router: Router) {}

    sendActivationEmail() {
      alert("Activation email has been sent.");
    }
}