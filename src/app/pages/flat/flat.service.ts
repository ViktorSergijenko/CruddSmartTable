import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Flat } from './flat.model'; // our flat model is located here
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http'; // for http(crud) requests
import { Resident } from '../resident/resident.model';
import { House } from '../house/house.model';


@Injectable()
export class FlatService { // service that will contain all crud fucntions and values for them for flat model
  selectedFlat: Flat; // value that will contain an additional flat object(just one)
  flatList: Flat[]; // array that will contain all Flat objects
  flatHouseIdList: any[] = []; // array that will hold all house idies that exist in database
  houseList: House[] = []; // array that will contain House Objects
  selectedHouse: House; // value that will contain an additional house object(just one)
  TotalFlatsInTable: number; // value that will contain total amount of existing flats in database
  TotalFlatsInAdditionalHouse: number; // value that will contain total amount of flats that contains in additional house
  SourtedResidents: Resident[] = []; // array that will contain returned residents objects from additional flat
  FlatRegForm: number; // variable that responds for visibility of our Flat Registration form
  FlatEditForm: number; // variable that responds for visibility of our Flat edit form
  constructor(private http: Http) { }
  /**
   * function sends a post request to the server to create a new object
   * @param {Flat} flat flat-flat object
   * @returns post request to the server
   * @memberof FlatService FlatService - Service that contains all RESTfull functions that we need
   */
  postFlat(flat: Flat) {
    const body = JSON.stringify(flat);
    const headerOptions = new Headers({ 'Content-Type': 'application/json' });
    const requestOptions = new RequestOptions({ method: RequestMethod.Post, headers: headerOptions });
    return this.http.post('http://localhost:52414/api/Flat', body, requestOptions).map(newFlat => newFlat.json());
  }
  /**
   * function sends a put request to the server to edit a object
   * @param {*} id id-id of an object that we want to edit
   * @param {*} fla fla-Flat object with new values
   * @returns put request to the server
   * @memberof FlatService FlatService - Service that contains all RESTfull functions that we need
   */
  putFlat(id, fla) {
    const body = JSON.stringify(fla);
    const headerOptions = new Headers({ 'Content-Type': 'application/json' });
    const requestOptions = new RequestOptions({ method: RequestMethod.Put, headers: headerOptions });
    return this.http.put('http://localhost:52414/api/Flat/' + id, body, requestOptions);
  }
  /**
   * Function sends a get request to our backend,and returns all data.(in our case it is Flat array)
   * @memberof FlatService FlatService - Service that contains all RESTfull functions that we need
   */
  getFlatList() {
    return this.http.get('http://localhost:52414/api/Flat');
  }
  /**
   *function sends a delete request on our (backend) to delete a object that user wants to delete
   *
   * @param {*} event event-Object, consist of:
   *data: Object - original row data
   *newData: Object - edited data
   *source: DataSource - table data source
   *confirm: Deferred - Deferred object with resolve(newData: Object) and reject() methods
   * @memberof FlatService FlatService - Service that contains all RESTfull functions that we need
   */
  deleteFlat(event) {
    return this.http.delete('http://localhost:52414/api/Flat/' + event.data.id);
  }
  /**
   * it's just a function for sending a request to our backend,so he could return
   * us a house objects from database.
   * @returns House List(all objects HOUSE)
   * @memberof FlatService FlatService - Service that contains all RESTfull functions that we need
   */
  getHouseIds() {
    return this.http.get('http://localhost:52414/api/House');
  }
  /**
   * function sends a get request to our backend to get all residents that live in
   * additional flat
   * @param {number} id id- id of a flat that we want to get residents from
   * @returns returns an array of residents objects that live in additional flat
   * @memberof FlatService FlatService - Service that contains all RESTfull functions that we need
   */
  GetFlatResidents(id: number) {
    return this.http.get('http://localhost:52414/api/flat/' + id + '/residents');
  }
  /**
   * Function will send get request to our backend to get one additional flat that we want
   *
   * @param {number} id id- id of a flat that we want to get
   * @returns returns one flat object
   * @memberof FlatService FlatService - Service that contains all RESTfull functions that we need
   */
  GetOneFlat(id: number) {
    return this.http.get('http://localhost:52414/api/flat/' + id);
  }
  /**
   * Function that sends a get request to our backend  and returns
   * a value as a number
   * @returns number value(Flat amount in all database)
   * @memberof FlatService FlatService - Service that contains all RESTfull functions that we need
   */
  getAllFlatAmount() {
    return this.http.get('http://localhost:52414/api/flat/FlatsAmount');
  }
  /**
   * Function that sends a get request to our backend  and returns
   * a value as a number
   * @param {number} id id- house id number
   * @returns a number value(Flat amount in one additional house)
   * @memberof FlatService FlatService - Service that contains all RESTfull functions that we need
   */
  GetFlatAmountInOneHouse(id: number) {
    return this.http.get('http://localhost:52414/api/House/' + id + '/flatAmount');
  }
}


