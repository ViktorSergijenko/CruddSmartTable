import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { FlatRoutingModule, routedComponents } from './flat-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SmartTableService } from '../../@core/data/smart-table.service';
import { FlatService } from './flat.service';
import { ToasterModule } from '../../../../node_modules/angular2-toaster';
import { NgxIntlTelInputModule } from '../../../../node_modules/ngx-intl-tel-input';
import { BsDropdownModule } from '../../../../node_modules/ngx-bootstrap/dropdown';
@NgModule({
  imports: [
    ThemeModule,
    FlatRoutingModule,
    Ng2SmartTableModule,
    ToasterModule,
    NgxIntlTelInputModule,
    BsDropdownModule.forRoot(),
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

