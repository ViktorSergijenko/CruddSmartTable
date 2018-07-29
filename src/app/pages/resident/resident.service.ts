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
   * Function sends a  request to create a new object
   * @param {Resident} res res-resident object
   * @returns post request to the server
   * @memberof ResidentService 
   */
  /**
 * FIXME💩: stringify not needed, re-check your logic + header and request options (not needed)
 */
  addResident(res: Resident) {
    const body = JSON.stringify(res); // why i cant use var and let instead of const here?
    const headerOptions = new Headers({ 'Content-Type': 'application/json' });
    const requestOptions = new RequestOptions({ method: RequestMethod.Post, headers: headerOptions });
    return this.http.post(environment.residentUlr, body, requestOptions).map(resident => resident.json());
  }

  /*
* FIXME💩: Wrong JSDocs + Description with capital letter
*/
  /**
   * Function sends a request to the server to edit a object
   * @param {*} id id-id of an object that we want to edit
   * @param {*} res res-Resident object with new values
   * @returns put request to the server
   * @memberof ResidentService 
   */
  /**
   * FIXME💩: Types + stringify not needed, re-check your logic + header and request options (not needed)
   */
  editResident(id, res) {
    const body = JSON.stringify(res);
    const headerOptions = new Headers({ 'Content-Type': 'application/json' });
    const requestOptions = new RequestOptions({ method: RequestMethod.Put, headers: headerOptions });
    return this.http.put(environment.residentUlr + id, body, requestOptions).map(resident => resident.json());
  }

  /**
   * Function sends a request to get  all Residents.
   * @memberof ResidentService
   */
  getResidentList() {
    return this.http.get(environment.residentsUlr).map(residents => residents.json());
  }

  /**
   * Function sends a request to delete a rESIDENT object.
   * @param {*} event event- Resident Object
   * @memberof ResidentService
   */
  /*
  */
  deleteResident(event) {
    return this.http.delete(environment.residentUlr + event.data.id);
  }

  /**
   * Function that gets all resident amount.
   * @returns Numeric value(Resident amount in all database)
   * @memberof ResidentService
   */
  getAllResidentAmount() {
    return this.http.get(environment.residentAmountUrl).map(residentAmount => residentAmount.json());
  }
  /**
   * Function gets amount of residents in one specific flat.
   * @param {number} id id of a flat that amount of residents we want to get
   * @returns Returns a numeric value that is our resident amount in specific flat
   * @memberof ResidentService
   */
  getResidentAmountInOneFlat(id: number) {
    return this.http.get(environment.flatUrl + id + '/ResidentAmount').map(residentAmount => residentAmount.json());
  }
}

