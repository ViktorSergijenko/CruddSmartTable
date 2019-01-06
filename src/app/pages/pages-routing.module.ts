import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { HomePageComponent } from './home-page/home-page.component';


const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [{
    path: 'home',
    component: HomePageComponent,
  },
  {
    path: 'house',
    loadChildren: './house/house.module#HouseModule',
  }, {
    path: 'flat',
    loadChildren: './flat/flat.module#FlatModule',
  }, {
    path: 'resident',
    loadChildren: './resident/resident.module#ResidentModule',
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
