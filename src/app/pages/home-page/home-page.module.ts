import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { ToasterModule } from 'angular2-toaster';
import { ProcessHttpMsgService } from '../../process-httpmsg.service';
import { NbSpinnerModule } from '@nebular/theme';
import { HomePageRoutingModule, routedComponents } from './home-page-routing.module';

@NgModule({
    imports: [
        ThemeModule,
        ToasterModule,
        NbSpinnerModule,
        HomePageRoutingModule,
    ],
    declarations: [
        routedComponents,
    ],
    providers: [
        ProcessHttpMsgService,
    ],

})
export class HouseModule { }
