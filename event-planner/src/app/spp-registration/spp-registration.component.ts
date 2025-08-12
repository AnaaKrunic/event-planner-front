import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RegistrationDTO } from '../models/registration.dto';

@Component({
  selector: 'app-spp-registration',
  templateUrl: './spp-registration.component.html',
  styleUrls: ['./spp-registration.component.css']
})
export class SPPRegistrationComponent {

  formData: RegistrationDTO = {
    email: '',
    name: '',
    description: '',
    address: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'SPP'
  };

  selectedFiles: File[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  onFileChange(event: any) {
    const files: FileList = event.target.files;
    this.selectedFiles = [];
    for (let i = 0; i < files.length; i++) {
      this.selectedFiles.push(files[i]);
    }
  }

  sendActivationEmail() {
    if (this.formData.password !== this.formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const formDataToSend = new FormData();

    formDataToSend.append("dto", new Blob(
      [JSON.stringify(this.formData)],
      { type: "application/json" }
    ));

    this.selectedFiles.forEach(file => {
      formDataToSend.append("files", file);
    });

    this.http.post('http://localhost:8080/api/auth/register', formDataToSend)
      .subscribe({
        next: (response: any) => {
          alert(response.message || "Verification email sent");
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Error:', err);
          alert("Error: " + (err.error || "An unexpected error occurred."));
        }
      });
  }
}
