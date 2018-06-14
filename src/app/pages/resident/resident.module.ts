import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { ResidentRoutingModule, routedComponents } from './resident-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SmartTableService } from '../../@core/data/smart-table.service';
import { ResidentService } from './resident.service';
@NgModule({
  imports: [
    ThemeModule,
    ResidentRoutingModule,
    Ng2SmartTableModule,
  ],
  declarations: [
    ...routedComponents,
  ],
  providers: [
    SmartTableService,
    ResidentService, // owibka ne v etom
  ],
})
export class ResidentModule { }

export class Resident {
  /**
   * Creats a new flat
   */
    id: number;
    firstname: string;
    lastname: string;
    postcode: string;
    phone: number;
    email: string;
    flatid: number;
}
