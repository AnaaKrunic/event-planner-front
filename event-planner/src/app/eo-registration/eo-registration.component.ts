import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RegistrationDTO } from '../models/registration.dto';

@Component({
  selector: 'app-eo-registration',
  templateUrl: './eo-registration.component.html',
  styleUrls: ['./eo-registration.component.css']
})
export class EORegistrationComponent {

  formData: RegistrationDTO = {
    email: '',
    name: '',
    lastName: '',
    address: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'EO'
  };

  selectedFile: File | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  onFileChange(event: any) {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      this.selectedFile = files[0]; // EO ima samo jednu sliku
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

    if (this.selectedFile) {
      formDataToSend.append("files", this.selectedFile);
    }

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
