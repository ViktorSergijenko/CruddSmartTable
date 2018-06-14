import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResidentComponent } from './resident.component';
import { ResidentTableComponent } from './resident-table/resident-table.component';

const routes: Routes = [{
  path: '',
  component: ResidentComponent,
  children: [{
    path: 'resident-table',
    component: ResidentTableComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResidentRoutingModule { }

export const routedComponents = [
  ResidentComponent,
  ResidentTableComponent,
];
