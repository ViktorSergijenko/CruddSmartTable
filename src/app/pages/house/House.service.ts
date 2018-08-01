import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Http, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { House } from './house.model';
import { environment } from '../../../environments/environment';


/**
 * This class has all needed functions to provide crud requests.
 * @export
 * @class HouseService
 */
@Injectable()
export class HouseService {

  /**
   * Creates an instance of HouseService.
   * @param {Http} http HTTP requests.
   * @memberof HouseService
   */
  constructor(private http: Http) {
  }

  /**
   * Function sends a request to the server to create a new House object.
   * @param {House} hos hos-house object
   * @returns post request to the server
   * @memberof HouseService  HouseService- Service that contains all RESTfull functions that we need
   */
  addHouse(hos: House) {
    const body = JSON.stringify(hos);
    const headerOptions = new Headers({ 'Content-Type': 'application/json' });
    const requestOptions = new RequestOptions({ method: RequestMethod.Post, headers: headerOptions });
    return this.http.post(environment.housesUrl, body, requestOptions).map(newHouse => newHouse.json());
  }

  /**
   * Function sends a request to the server to edit a House object
   * @param {*} id id of an object that we want to edit
   * @param {*} hos hos-House object with new values
   * @returns put request to the server
   * @memberof HouseService
   */
  editHouse(id: number, hos: House) {
    const body = JSON.stringify(hos);
    const headerOptions = new Headers({ 'Content-Type': 'application/json' });
    const requestOptions = new RequestOptions({ method: RequestMethod.Put, headers: headerOptions });
    return this.http.put(environment.houseUrl + id, body, requestOptions).map(editedHouse => editedHouse.json());
  }
  /**
   * Function sends  request to get a list of houses
   * @memberof HouseService
   */
  getHouseList() {
    return this.http.get(environment.housesUrl).map(houses => houses.json());
  }
  /**
   * Function sends a  request  to delete a House object that user wants to delete
   * @param {*} event event- Ng2 Smart table event object which contains row data
   * @memberof HouseService
   */
  deleteHouse(event) {

    return this.http.delete(environment.houseUrl + event.data.id);
  }
  /**
   * Function sends a  request to  get all flats,  
   * that are located in specific house
   * @param {number} id id of house with  flats that we need to get
   * @returns returns array of flat objects that are located in specific  house
   * @memberof HouseService
   */
  getHouseFlats(id: number) {
    return this.http.get(environment.houseUrl + id + '/flats').map(flats => flats.json());
  }
  /**
   * Function sends  request to get one specific house
   * @param {number} id id of house that we want to get.
   * @returns Returns a house as a object.
   * @memberof HouseService
   */
  getOneHouse(id: number) {
    return this.http.get(environment.houseUrl + id).map(house => house.json());
  }

}
