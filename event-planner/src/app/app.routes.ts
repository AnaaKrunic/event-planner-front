import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AllEventsComponent } from './all-events/all-events.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'all-events', component: AllEventsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
