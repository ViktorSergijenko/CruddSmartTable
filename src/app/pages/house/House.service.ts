import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Http, Headers, RequestOptions, RequestMethod } from '@angular/http'; // For http(crud) requests
import { Flat } from '../flat/flat.model';
import { House } from './house.model';
import { environment } from '../../../environments/environment';


/**
 * This class has all needed properties(variables) and functions to provide crud requests.
 * @export
 * @class HouseService
 */
@Injectable()
export class HouseService {

  constructor(private http: Http) {
  }

  /**
   * Function sends a post request to the server to create a new object.
   * @param {House} hos hos-house object
   * @returns post request to the server
   * @memberof HouseService  HouseService- Service that contains all RESTfull functions that we need
   */
  postHouse(hos: House) {
    const body = JSON.stringify(hos); // why i cant use var and let instead of const here?
    const headerOptions = new Headers({ 'Content-Type': 'application/json' });
    const requestOptions = new RequestOptions({ method: RequestMethod.Post, headers: headerOptions });
    return this.http.post(environment.housesUrl, body, requestOptions).map(newHouse => newHouse.json());
  }

  /**
   * Function sends a put request to the server to edit a object.
   * @param {*} id id-id of an object that we want to edit
   * @param {*} hos hos-House object with new values
   * @returns put request to the server
   * @memberof HouseService
   */
  putHouse(id: number, hos) {
    const body = JSON.stringify(hos);
    const headerOptions = new Headers({ 'Content-Type': 'application/json' });
    const requestOptions = new RequestOptions({ method: RequestMethod.Put, headers: headerOptions });
    return this.http.put(environment.houseUrl + id, body, requestOptions).map(editedHouse => editedHouse.json());
  }
  /**
   * Function sends a get request to our backend,and returns all data.(in our case it is Flat array)
   * @memberof HouseService
   */
  getHouseList() {
    return this.http.get(environment.housesUrl).map(houses => houses.json());
  }
  /**
   * Function sends a delete request on our (backend) to delete a object that user wants to delete
   * @param {*} event event-Object, consist of:
   * data: Object - original row data
   * newData: Object - edited data
   * source: DataSource - table data source
   * confirm: Deferred - Deferred object with resolve(newData: Object) and reject() methods
   * @memberof HouseService
   */
  deleteHouse(event) {

    return this.http.delete(environment.houseUrl + event.data.id);
  }
  /**
   * Function sends a get request to our backend to get all all flats,
   * that are located in additional house.
   * @param {number} id id- id of house that has flats that we need.
   * @returns returns array of flat objects of additional house.
   * @memberof HouseService
   */
  getHouseFlats(id: number) {
    return this.http.get(environment.houseUrl + id + '/flats').map(flats => flats.json());
  }
  /**
   * Function sends a get request to get one additional house that we need.
   * @param {number} id id- id of house that we want to get.
   * @returns Returns a house as a object.
   * @memberof HouseService
   */
  getOneHouse(id: number) {
    return this.http.get(environment.houseUrl + id).map(house => house.json());
  }

}
