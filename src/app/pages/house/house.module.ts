import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { HouseRoutingModule, routedComponents } from './house-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { HouseService } from './house.service';
import { ToasterModule } from '../../../../node_modules/angular2-toaster';
import { ProcessHttpMsgService } from '../../process-httpmsg.service';

@NgModule({
  imports: [
    ThemeModule,
    HouseRoutingModule,
    Ng2SmartTableModule,
    ToasterModule,
  ],
  declarations: [
    ...routedComponents,

  ],
  providers: [
    HouseService,
    ProcessHttpMsgService,
  ],

})
export class HouseModule { }


