import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { HouseRoutingModule, routedComponents } from './house-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { HouseService } from './house.service';
import { Flat } from '../flat/flat.model';

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
    HouseService, // owibka ne v etom
  ],

})
export class HouseModule { }


