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
import {AboutEventComponent} from './about-event/about-event.component';
import {AboutSolutionComponent} from './about-solution/about-solution.component';
import {EventInvitationComponent} from './event-invitation/event-invitation.component';
import {BookServiceComponent} from './book-service/book-service.component';
import { ProfileComponent } from './profile/profile.component';
import { EventTypeManagementComponent } from './event-type-management/event-type-management.component';
import { EventCreateComponent } from './event-create/event-create.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'all-events', component: AllEventsComponent },
  { path: 'all-products-and-services', component: AllProductsAndServicesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'eo-registration', component: EORegistrationComponent },
  { path: 'spp-registration', component: SPPRegistrationComponent },
  { path: 'add-service', component: AddServiceComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'edit-service', component: EditServiceComponent},
  { path: 'event/:id', component: AboutEventComponent },
  { path: 'solution/:id', component: AboutSolutionComponent },
  { path: 'event-invitation', component: EventInvitationComponent },
  { path: 'book-service', component: BookServiceComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'event-types', component: EventTypeManagementComponent },
  { path: 'events/create', component: EventCreateComponent },
  { path: 'my-events', component: AllEventsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
