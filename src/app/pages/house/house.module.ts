import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { HouseRoutingModule, routedComponents } from './house-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SmartTableService } from '../../@core/data/smart-table.service';
import { HouseService } from './House.service';
import { Flat } from '../flat/flat.module';

@NgModule({
  imports: [
    ThemeModule,
    HouseRoutingModule,
    Ng2SmartTableModule, // problema v etom
  ],
  declarations: [
    ...routedComponents,

  ],
  providers: [
    SmartTableService,
    HouseService, // owibka ne v etom
  ],

})
export class HouseModule { }



export class House {
  /**
   * Creats a new house
   */
  id: number;
  street: string;
  city: string;
  country: string;
  postindex: string;
  flatamount: number;
  flats: [Flat];
}
