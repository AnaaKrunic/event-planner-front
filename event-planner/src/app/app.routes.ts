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
import { AboutEventComponent} from './about-event/about-event.component';
import { AboutSolutionComponent} from './about-solution/about-solution.component';
import { EventInvitationComponent} from './event-invitation/event-invitation.component';
import { BookServiceComponent} from './book-service/book-service.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { EventTypeManagementComponent } from './event-type-management/event-type-management.component';
import { EventCreateComponent } from './event-create/event-create.component';
import { AllProductsComponent } from './all-products/all-products.component';
import { AboutProductComponent } from './about-product/about-product.component';
import { ProductCreateComponent } from './product-create/product-create.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ACategoryComponent } from './a-category/a-category.component';
import { FavoriteEventsComponent } from './favorite-events/favorite-events.component';
import { FavoriteSolutionsComponent } from './favorite-solutions/favorite-solutions.component';

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
  { path: 'event/:id', component: AboutEventComponent },
  { path: 'solution/:id', component: AboutSolutionComponent },
  { path: 'event-invitation', component: EventInvitationComponent },
  { path: 'book-service', component: BookServiceComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'event-types', component: EventTypeManagementComponent },
  { path: 'events/create', component: EventCreateComponent },
  { path: 'my-events', component: AllEventsComponent },
  { path: 'all-products', component: AllProductsComponent },
  { path: 'my-products', component: AllProductsComponent },
  { path: 'product/:id', component: AboutProductComponent},
  { path: 'products/create', component: ProductCreateComponent},
  { path: 'products/edit/:id', component: EditProductComponent },
  { path: 'a-category', component: ACategoryComponent },
  { path: 'edit-service/:id', component: EditServiceComponent },
  { path: 'all-services', component: ServicesComponent },
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'favorites', component: FavoriteEventsComponent },
  { path: 'favorite-solutions', component: FavoriteSolutionsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
