import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AllEventsComponent } from './all-events/all-events.component';
import { AllProductsAndServicesComponent } from './all-products-and-services/all-products-and-services.component';
import { ServicesComponent } from './services/services.component';

const routes: Routes = [
  { path: '', component: ServicesComponent },
  { path: 'all-events', component: AllEventsComponent },
  { path: 'all-products-and-services', component: AllProductsAndServicesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
