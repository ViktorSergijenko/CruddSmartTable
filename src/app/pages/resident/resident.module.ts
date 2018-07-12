import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { ResidentRoutingModule, routedComponents } from './resident-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
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
    ResidentService, // owibka ne v etom
  ],
})
export class ResidentModule { }
