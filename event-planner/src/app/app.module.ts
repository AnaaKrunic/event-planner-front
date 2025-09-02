import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { EventsComponent } from './events/events.component';
import { ProductsComponent } from './products/products.component';
import { AllEventsComponent } from './all-events/all-events.component';
import { AllProductsAndServicesComponent } from './all-products-and-services/all-products-and-services.component';
import { AppRoutingModule } from './app.routes';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ServicesComponent } from './services/services.component';
import { AddServiceComponent } from './add-service/addService.component';
import { EditServiceComponent } from './edit-service/editService.component';
import { RegistrationComponent } from './registration/registration.component';
import { HttpClientModule } from '@angular/common/http';
import { NotificationsComponent } from './notifications/notifications.component';
import { AboutEventComponent} from './about-event/about-event.component';
import { EventInvitationComponent} from './event-invitation/event-invitation.component';
import { BookServiceComponent} from './book-service/book-service.component';
import { AuthInterceptor } from './auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ProfileComponent } from './profile/profile.component';
import { SPPRegistrationComponent } from './spp-registration/spp-registration.component';
import { EORegistrationComponent } from './eo-registration/eo-registration.component';
import { LoginComponent } from './login/login.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { EventTypeManagementComponent } from './event-type-management/event-type-management.component';
import { EventCreateComponent } from './event-create/event-create.component';
import { AllProductsComponent } from './all-products/all-products.component';
import { AboutProductComponent } from './about-product/about-product.component';
import { ProductCreateComponent } from './product-create/product-create.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ACategoryComponent } from './a-category/a-category.component'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { ReactiveFormsModule } from '@angular/forms';
import { FavoriteEventsComponent } from './favorite-events/favorite-events.component';
import { FullCalendarModule } from '@fullcalendar/angular';

@NgModule({
  declarations: [
    AppComponent,
    EventsComponent,
    ProductsComponent,
    HomeComponent,
    AllEventsComponent,
    AllProductsAndServicesComponent,
    ServicesComponent,
    AddServiceComponent,
    EditServiceComponent,
    NavBarComponent,
    RegistrationComponent,
    NotificationsComponent,
    AboutEventComponent,
    EventInvitationComponent,
    BookServiceComponent,
    ProfileComponent,
    SPPRegistrationComponent,
    EORegistrationComponent,
    LoginComponent,
    ChangePasswordComponent,
    EventTypeManagementComponent,
    EventCreateComponent,
    AllProductsComponent,
    AboutProductComponent,
    ProductCreateComponent,
    EditProductComponent,
    ACategoryComponent,
    FavoriteEventsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSliderModule,
    ReactiveFormsModule,
    FullCalendarModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
