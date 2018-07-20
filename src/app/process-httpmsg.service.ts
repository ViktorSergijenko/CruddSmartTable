import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
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
    public handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.log('HANDLER MATH EGO' + errMsg);
        this.toasterService.popAsync('warning', 'Error handling', errMsg);
        return Observable.throw(errMsg);
    }
}
