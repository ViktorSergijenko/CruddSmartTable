import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Resident } from './resident.model'; // our resident model is located here
import { Flat } from '../../pages/flat/flat.model'; // our flat model is located here
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http'; // for http(crud) requests
/**
 * FIXME💩: Unused imports
 */

@Injectable()
/**
 * FIXME💩: Comments with capital letter (Better to use JSDocs instead of comments here)
 */
export class ResidentService { // service that will contain all crud fucntions and values for them for resident model
  /**
   * Value that will contain an additional resident object(just one)
   *
   * @type {Resident}
   * @memberof ResidentService
   */
  selectedResident: Resident;
  residentList: Resident[]; // array that will contain all returned house objects
  residentFlatIdList: any[] = []; // array that will hold all flat idies that exist in database
  flatList: Flat[]; // array that will contain all returned flat objects
  TotalResidentsInAllFlats: number; // value that will contain all amount of residents that we have in database
  TotalResidentsInAdditionalFlat: number; // value that will contain  amount of residents that are living in additional flat
  sourtedResidents: Resident[] = []; // array that will contain array of residents that lives in additional flat
  ResidentRegForm: number; // variable that responds for visibility of our Resident Registration Form
  ResidentEditForm: number; // variable that responds for visibility of our Resident edit form
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
    return this.http.post('http://localhost:52414/api/Resident', body, requestOptions).map(resident => resident.json());
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
    return this.http.put('http://localhost:52414/api/Resident/' + id, body, requestOptions).map(resident => resident.json());
  }

  /*
  * FIXME💩: Wrong JSDocs (no returns) + Description with capital letter
  */
  /**
   * Function sends a get request to our backend,and returns all data.(in our case it is Resident array)
   * @memberof ResidentService ResidentService-Service that contains all RESTfull functions that we need
   */
  getResidentList() {
    return this.http.get('http://localhost:52414/api/Resident');
  }

  /*
* FIXME💩: Wrong JSDocs (no returns) + Description with capital letter
*/
  /**
   * function sends a delete request on our (backend) to delete a object that user wants to delete
   *
   * @param {*} event event-Object, consist of: FIXME💩: Specific object model
   * data: Object - original row data
   * newData: Object - edited data
   * source: DataSource - table data source
   * confirm: Deferred - Deferred object with resolve(newData: Object) and reject() methods
   * @memberof ResidentService ResidentService-Service that contains all RESTfull functions that we need
   */
  /*
  * FIXME💩: Types
  */
  deleteResident(event) {
    /*
    * FIXME💩: API Url - environment variable
    */
    return this.http.delete('http://localhost:52414/api/Resident/' + event.data.id);
  }
  /**
   * function that will send a request to backend so he could returns us all...
   * flat objects
   * @returns Flat list(all flat objects)
   * @memberof ResidentService ResidentService-Service that contains all RESTfull functions that we need
   */
  getFlatIds() {
    /*
    * FIXME💩: API Url - environment variable
    */
    return this.http.get('http://localhost:52414/api/Flat');
  }

  /**
   * Function that sends a get request to our backend  and returns
   * a value as a number
   * @returns number value(Resident amount in all database)
   * @memberof ResidentService ResidentService-Service that contains all RESTfull functions that we need
   */
  getAllResidentAmount() {
    /*
     * FIXME💩: API Url - environment variable
     */
    return this.http.get('http://localhost:52414/api/resident/ResidentsAmount');
  }
  /**
   * Function that sends a request to get resident amount in specific flat
   * @param {number} id Flat id number
   * @returns Returns resident amount in specific flat
   * @memberof ResidentService ResidentService-Service that contains all RESTfull functions that we need
   */
  /**
   * FIXME💩: camelCase
   */
  GetResidentAmountInOneFlat(id: number) {
    /*
    * FIXME💩: API Url - environment variable
    */
    return this.http.get('http://localhost:52414/api/flat/' + id + '/ResidentAmount');
  }
}

