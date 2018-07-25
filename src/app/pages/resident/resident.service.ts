import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Resident } from './resident.model';
import { Http, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { environment } from '../../../environments/environment';


/**
 * Service that will contain all crud functions.
 * @export
 * @class ResidentService
 */
@Injectable()

export class ResidentService {

  /**
   *Creates an instance of ResidentService.
   * @param {Http} http HTTP requests
   * @memberof ResidentService
   */
  constructor(
    private http: Http,
  ) { }

  /**
   * function sends a post request to the server to create a new object
   * @param {Resident} res res-resident object
   * @returns post request to the server
   * @memberof ResidentService ResidentService-Service that contains all RESTfull functions that we need
   */
  /**
 * FIXME💩: stringify not needed, re-check your logic + header and request options (not needed)
 */
  postResident(res: Resident) {
    const body = JSON.stringify(res); // why i cant use var and let instead of const here?
    const headerOptions = new Headers({ 'Content-Type': 'application/json' });
    const requestOptions = new RequestOptions({ method: RequestMethod.Post, headers: headerOptions });
    return this.http.post(environment.residentUlr, body, requestOptions).map(resident => resident.json());
  }

  /*
* FIXME💩: Wrong JSDocs + Description with capital letter
*/
  /**
   * function sends a put request to the server to edit a object
   * @param {*} id id-id of an object that we want to edit
   * @param {*} res res-Resident object with new values
   * @returns put request to the server
   * @memberof ResidentService ResidentService-Service that contains all RESTfull functions that we need
   */
  /**
   * FIXME💩: Types + stringify not needed, re-check your logic + header and request options (not needed)
   */
  putResident(id, res) {
    const body = JSON.stringify(res);
    const headerOptions = new Headers({ 'Content-Type': 'application/json' });
    const requestOptions = new RequestOptions({ method: RequestMethod.Put, headers: headerOptions });
    return this.http.put(environment.residentUlr + id, body, requestOptions).map(resident => resident.json());
  }

  /**
   * Function sends a get request to our server to get all Residens.
   * @memberof ResidentService
   */
  getResidentList() {
    return this.http.get(environment.residentsUlr).map(residents => residents.json());
  }

  /**
   * Function sends a delete request to server to delete a object.
   * @param {*} event event- Resident Object
   * @memberof ResidentService
   */
  /*
  * FIXME💩: Types
  */
  deleteResident(event) {
    return this.http.delete(environment.residentUlr + event.data.id);
  }
  /**
   * function that will send a request to backend so he could returns us all...
   * flat objects
   * @returns Flat list(all flat objects)
   * @memberof ResidentService ResidentService-Service that contains all RESTfull functions that we need
   */
  getFlatIds() {
    return this.http.get(environment.flatsUrl);
  }

  /**
   * Function that sends a get request to our backend  and returns
   * a value as a number
   * @returns number value(Resident amount in all database)
   * @memberof ResidentService ResidentService-Service that contains all RESTfull functions that we need
   */
  getAllResidentAmount() {
    return this.http.get(environment.residentAmountUrl).map(residentAmount => residentAmount.json());
  }
  /**
   * Function that sends a request to get resident amount in specific flat
   * @param {number} id Flat id number
   * @returns Returns resident amount in specific flat
   * @memberof ResidentService ResidentService-Service that contains all RESTfull functions that we need
   */
  getResidentAmountInOneFlat(id: number) {
    return this.http.get(environment.flatUrl + id + '/ResidentAmount').map(residentAmount => residentAmount.json());
  }
}

