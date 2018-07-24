import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import 'rxjs/add/observable/throw';
import { ToasterService } from 'angular2-toaster';

@Injectable()
export class ProcessHttpMsgService {

    constructor(
        private toasterService: ToasterService,
    ) { }
    public extractData(res: Response) {
        const body = res.json();
        return body || {};
    }
    // FIXME💩: "any" === 💩
    public handleError(error: Response | any) {
        // TODO: Figure out what is going on and comment it
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        this.toasterService.popAsync('warning', 'Error handling', errMsg);
        return errMsg;
    }
}
