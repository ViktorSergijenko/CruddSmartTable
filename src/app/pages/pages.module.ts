import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { HouseModule } from './house/house.module';
import { FlatModule } from './flat/flat.module';
import { ResidentModule } from './resident/resident.module';
import { HomePageComponent } from './home-page/home-page.component';

const PAGES_COMPONENTS = [
  PagesComponent,
  HomePageComponent,
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    DashboardModule,
    HouseModule,
    FlatModule,
    ResidentModule,

  ],
  declarations: [
    ...PAGES_COMPONENTS,
  ],
})
export class PagesModule {
}
