import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HouseComponent } from './house.component';
import { HouseTableComponent } from './house-table/house-table.component';

const routes: Routes = [{
  path: '',
  component: HouseComponent,
  children: [{
    path: 'house-table',
    component: HouseTableComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HouseRoutingModule {

}

export const routedComponents = [
  HouseComponent,
  HouseTableComponent,
];
