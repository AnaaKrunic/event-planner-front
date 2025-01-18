import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { EventsComponent } from './events/events.component';
import { ProductsComponent } from './products/products.component';
import { AllEventsComponent } from './all-events/all-events.component';
import { AllProductsAndServicesComponent } from './all-products-and-services/all-products-and-services.component'; // Import komponenta
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
import {AboutEventComponent} from './about-event/about-event.component';
import {EventInvitationComponent} from './event-invitation/event-invitation.component';


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
    EventInvitationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
