import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { FlatRoutingModule, routedComponents } from './flat-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SmartTableService } from '../../@core/data/smart-table.service';
import { FlatService } from './flat.service';
import { ToasterModule } from '../../../../node_modules/angular2-toaster';
@NgModule({
  imports: [
    ThemeModule,
    FlatRoutingModule,
    Ng2SmartTableModule,
    ToasterModule,

  ],
  declarations: [
    ...routedComponents,
  ],
  providers: [
    SmartTableService,
    FlatService,
  ],

})
export class FlatModule { }

