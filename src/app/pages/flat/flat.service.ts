import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Flat } from './flat.model';
import { Http, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { Resident } from '../resident/resident.model';
import { House } from '../house/house.model';
import { environment } from '../../../environments/environment';


/**
 * This class has all needed properties(variables) and functions to provide crud requests.
 * @export
 * @class FlatService
 */
@Injectable()
export class FlatService {
  /**
   * @property {selectedFlat} -  Property(variable) that can contain one flat object.
   * @type {Flat}
   * @memberof FlatService
   */
  selectedFlat: Flat;
  /**
   * @property {flatList} - Property(array) that can contain array of flat objects.
   * @type {Flat[]}
   * @memberof FlatService
   */
  flatList: Flat[];
  /**
   * @property {houseList} - Array that will contain House Objects.
   * @type {House[]}
   * @memberof FlatService
   */
  houseList: House[] = [];
  /**
   * @property {selectedHouse} - Property(variable) that can contain one house object.
   * @type {House}
   * @memberof FlatService
   */
  selectedHouse: House;
  /**
   * @property {TotalFlatsInTable} - Property(variable) that contains information about amount of flats in table.
   * @type {number}
   * @memberof FlatService
   */
  totalFlatsInTable: number;
  /**
   * @property {TotalFlatsInAdditionalHouse} - Property(variable) that contains information about amount of flats in additional house.
   * @type {number}
   * @memberof FlatService
   */
  totalFlatsInAdditionalHouse: number;
  /**
   * @property {SourtedResidents} - Array that will contain  residents objects from additional flat.
   * @type {Resident[]}
   * @memberof FlatService
   */
  sourtedResidents: Resident[] = [];
  /**
   * @property {FlatRegForm} - Property(variable) that responds for Registration form visability.
   * @type {number}
   * @memberof FlatService
   */
  flatRegForm: number;
  /**
   * @property {FlatEditForm} - Property(variable) that responds for Edit form visability.
   * @type {number}
   * @memberof FlatService
   */
  flatEditForm: number;
  constructor(private http: Http) { }
  /**
   * Function sends a post request to the server to create a new object.
   * @param {Flat} flat Flat-this property is a flat object.
   * @returns Post request to the server.
   * @memberof FlatService 
   */
  postFlat(flat: Flat) {
    const body = JSON.stringify(flat);
    const headerOptions = new Headers({ 'Content-Type': 'application/json' });
    const requestOptions = new RequestOptions({ method: RequestMethod.Post, headers: headerOptions });
    return this.http.post(environment.FlatsUrl, body, requestOptions).map(newFlat => newFlat.json());
  }
  /**
   * Function sends a put request to the server to edit a object.
   * @param {*} id id-Id of an object that we want to edit.
   * @param {*} flat flat-Flat object with new values.
   * @returns Put request to the server.
   * @memberof FlatService
   */
  putFlat(id, flat) {
    const body = JSON.stringify(flat);
    const headerOptions = new Headers({ 'Content-Type': 'application/json' });
    const requestOptions = new RequestOptions({ method: RequestMethod.Put, headers: headerOptions });
    return this.http.put(environment.FlatUrl + id, body, requestOptions).map(editedFlat => editedFlat.json());
  }
  /**
   * Function sends a get request to our server,and returns all data.(in our case it is Flat array).
   * @memberof FlatService
   */
  getFlatList() {
    return this.http.get(environment.FlatsUrl);
  }
  /**
   *Function sends a delete request on our server to delete a object that user wants to.
   * @param {*} event event-Flat Object.
   * @memberof FlatService
   */
  deleteFlat(event) {
    return this.http.delete(environment.FlatUrl + event.data.id);
  }

  /**
   * Function sends a get request to our server to get all residents that live in
   * additional flat.
   * @param {number} id id - Id of a flat that we want to get residents from.
   * @returns Returns an array of residents objects that live in additional flat.
   * @memberof FlatService
   */
  getFlatResidents(id: number) {
    return this.http.get(environment.FlatUrl + id + '/residents');
  }
  /**
   * Function will send get request to our server to get one additional flat that we want to.
   * @param {number} id id- Id of a flat that we want to get.
   * @returns Returns one flat object.
   * @memberof FlatService
   */
  getOneFlat(id: number) {
    return this.http.get(environment.FlatUrl + id);
  }
  /**
   * Function that sends a get request to our server.
   * @returns Returns a number value(Flat amount in all database).
   * @memberof FlatService
   */
  getAllFlatAmount() {
    return this.http.get(environment.FlatAmountUrl);
  }
  /**
   * Function that sends a get request to our server.
   * @param {number} id I d- house id number
   * @returns Returns a number value(Flat amount in one additional house)
   * @memberof FlatService
   */
  getFlatAmountInOneHouse(id: number) {
    return this.http.get(environment.HouseUrl + id + '/flatAmount');
  }
}


