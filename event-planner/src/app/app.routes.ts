import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AllEventsComponent } from './all-events/all-events.component';
import { AllProductsAndServicesComponent } from './all-products-and-services/all-products-and-services.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { ServicesComponent } from './services/services.component';
import { AddServiceComponent } from './add-service/addService.component';
import { SPPRegistrationComponent } from './spp-registration/spp-registration.component';
import { EORegistrationComponent } from './eo-registration/eo-registration.component';
import { EditServiceComponent } from './edit-service/editService.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'all-events', component: AllEventsComponent },
  { path: 'all-products-and-services', component: AllProductsAndServicesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'eo-registration', component: EORegistrationComponent },
  { path: 'spp-registration', component: SPPRegistrationComponent },
  { path: 'add-service', component: AddServiceComponent },
  { path: 'services', component: ServicesComponent},
  { path: 'edit-service', component: EditServiceComponent}
     
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
