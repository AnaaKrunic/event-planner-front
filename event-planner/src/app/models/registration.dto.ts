export interface RegistrationDTO {
  email: string;
  name: string;
  lastName?: string;
  address: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  description?: string;
  role: string;
}
