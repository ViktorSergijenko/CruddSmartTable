import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlatComponent } from './flat.component';
import { FlatTableComponent } from './flat-table/flat-table.component';

const routes: Routes = [{
  path: '',
  component: FlatComponent,
  children: [
    { path: 'flat-table/:id', component: FlatTableComponent },
    { path: 'flat-table', component: FlatTableComponent },
    { path: '', component: FlatTableComponent },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlatRoutingModule {

}

export const routedComponents = [
  FlatComponent,
  FlatTableComponent,
];
