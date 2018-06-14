import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { FlatRoutingModule, routedComponents } from './flat-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SmartTableService } from '../../@core/data/smart-table.service';
import { FlatService } from './flat.service';

@NgModule({
  imports: [
    ThemeModule,
    FlatRoutingModule,
    Ng2SmartTableModule,
  ],
  declarations: [
    ...routedComponents,
  ],
  providers: [
    SmartTableService,
    FlatService, // owibka ne v etom
  ],

})
export class FlatModule { }

export class Flat {
  /**
   * Creats a new flat
   */
    id: number;
    floor: number;
    number: number;
    totalarea: number;
    livingspace: number;
    houseid: number;
}
