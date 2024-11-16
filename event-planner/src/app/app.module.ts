import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { EventsComponent } from './events/events.component';
import { ProductsComponent } from './products/products.component';
import {AllEventsComponent} from './all-events/all-events.component';
import {AppRoutingModule} from './app.routes';
import { HomeComponent } from './home/home.component';
import {FormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    EventsComponent,
    ProductsComponent,
    HomeComponent,
    AllEventsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
