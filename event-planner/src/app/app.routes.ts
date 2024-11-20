import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AllEventsComponent } from './all-events/all-events.component';
import { AllProductsAndServicesComponent } from './all-products-and-services/all-products-and-services.component';
import { ServicesComponent } from './services/services.component';
import { AddServiceComponent } from './add-service/addService.component';
import { EditServiceComponent } from './edit-service/editService.component';

const routes: Routes = [
  { path: '', component: ServicesComponent },
  { path: 'all-events', component: AllEventsComponent },
  { path: 'all-products-and-services', component: AllProductsAndServicesComponent },
  { path: 'edit-service', component: EditServiceComponent},
  { path: 'add-service', component: AddServiceComponent},
  { path: 'services', component: ServicesComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
