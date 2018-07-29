import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Flat } from './flat.model';
import { Http, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { environment } from '../../../environments/environment';


/**
 * This class has all needed properties(variables) and functions to provide crud requests.
 * @export
 * @class FlatService
 */
@Injectable()
export class FlatService {
  constructor(private http: Http) { }
  /**
   * Function sends a request to add a Flat object.
   * @param {Flat} flat Flat-this property is a flat object.
   * @returns Post request to the server.
   * @memberof FlatService 
   */
  addFlat(flat: Flat) {
    const body = JSON.stringify(flat);
    const headerOptions = new Headers({ 'Content-Type': 'application/json' });
    const requestOptions = new RequestOptions({ method: RequestMethod.Post, headers: headerOptions });
    return this.http.post(environment.flatsUrl, body, requestOptions).map(newFlat => newFlat.json());
  }
  /**
   * Function sends a edit request to  edit a Flat object.
   * @param {*} id id-Id of an object that we want to edit.
   * @param {*} flat flat-Flat object with new values.
   * @returns Put request to the server.
   * @memberof FlatService
   */
  editFlat(id: number, flat: Flat) {
    const body = JSON.stringify(flat);
    const headerOptions = new Headers({ 'Content-Type': 'application/json' });
    const requestOptions = new RequestOptions({ method: RequestMethod.Put, headers: headerOptions });
    return this.http.put(environment.flatUrl + id, body, requestOptions).map(editedFlat => editedFlat.json());
  }
  /**
   * Function sends a request to get all flats.
   * @memberof FlatService
   */
  getFlatList() {
    return this.http.get(environment.flatsUrl).map(flats => flats.json());
  }
  /**
   * Function sends a request to delete a object.
   * @param {*} event event-Flat Object.
   * @memberof FlatService
   */
  deleteFlat(event) {
    return this.http.delete(environment.flatUrl + event.data.id);
  }

  /**
   * Function sends a request to get residents from specific flat.
   * @param {number} id id - Id of a flat that we want to get residents from.
   * @returns Returns an array of residents objects that live in specific flat.
   * @memberof FlatService
   */
  getFlatResidents(id: number) {
    return this.http.get(environment.flatUrl + id + '/residents').map(flatResidents => flatResidents.json());
  }
  /**
   * Function will send request to get one additional flat that we want to.
   * @param {number} id id- Id of a flat that we want to get.
   * @returns Returns one flat object.
   * @memberof FlatService
   */
  getOneFlat(id: number) {
    return this.http.get(environment.flatUrl + id).map(oneFlat => oneFlat.json());
  }
  /**
   * Function that sends a request to get amount of all flats.
   * @returns Returns a number value(Flat amount in all database).
   * @memberof FlatService
   */
  getAllFlatAmount() {
    return this.http.get(environment.flatAmountUrl).map(flatAmount => flatAmount.json());
  }
  /**
   * Function that sends a get request to our server.
   * @param {number} id I d- house id number
   * @returns Returns a number value(Flat amount in one additional house)
   * @memberof FlatService
   */
  getFlatAmountInOneHouse(id: number) {
    return this.http.get(environment.houseUrl + id + '/flatAmount').map(flatAmount => flatAmount.json());
  }
}


