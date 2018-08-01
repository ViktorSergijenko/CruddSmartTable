import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { ResidentRoutingModule, routedComponents } from './resident-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ResidentService } from './resident.service';
import { ToasterModule } from 'angular2-toaster';
import { InternationalPhoneModule } from 'ng4-intl-phone';
@NgModule({
  imports: [
    ThemeModule,
    ResidentRoutingModule,
    Ng2SmartTableModule,
    ToasterModule,
    InternationalPhoneModule,
  ],
  declarations: [
    ...routedComponents,
  ],
  providers: [
    ResidentService,
  ],
})
export class ResidentModule { }
