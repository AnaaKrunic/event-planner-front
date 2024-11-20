import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  selectedRole: string = '';

  constructor(private router: Router) {}

  navigateToRole() {
    if (this.selectedRole == 'event-organizer') {
      this.router.navigate(['/eo-registration']);
    } else if (this.selectedRole == 'service-provider') {
      this.router.navigate(['/spp-registration']);
    } else {
      alert('Please select a role!');
    }
  }
}
