import { Injectable } from '@angular/core';
import { NgModule } from '@angular/core';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http'; // for http(crud) requests
import { Flat } from '../flat/flat.model';
import { Subject } from 'rxjs/subject';
import { House } from './house.model';


@Injectable()
export class HouseService { // service that will contain all crud fucntions and values for them for house model
  selectedHouse: House; // variable for one additional selected house item
  houseList: House[]; // array to keep all House object
  SourtedFlatList: Flat[] = []; // array to keep all additional flats of one house
  TotalAmountOfHosesInTable: number; // value that keep amount houses in table
  RegistrationHouseForm: number; // value that responds for visibility of our House Registration Form
  EditHouseForm: number; // value that responds for visibility of our House Edit Form
  constructor(private http: Http) {
    console.log('hi');
  }

  /**
   * function sends a post request to the server to create a new object
   * @param {House} hos hos-house object
   * @returns post request to the server
   * @memberof HouseService  HouseService- Service that contains all RESTfull functions that we need
   */
  postHouse(hos: House) {
    const body = JSON.stringify(hos); // why i cant use var and let instead of const here?
    const headerOptions = new Headers({ 'Content-Type': 'application/json' });
    const requestOptions = new RequestOptions({ method: RequestMethod.Post, headers: headerOptions });
    return this.http.post('http://localhost:52414/api/House', body, requestOptions).map(x => x.json());
  }

  /**
   * function sends a put request to the server to edit a object
   * @param {*} id id-id of an object that we want to edit
   * @param {*} hos hos-House object with new values
   * @returns put request to the server
   * @memberof HouseService  HouseService- Service that contains all RESTfull functions that we need
   */
  putHouse(id, hos) {
    const body = JSON.stringify(hos); // why i cant use var and let instead of const here?
    const headerOptions = new Headers({ 'Content-Type': 'application/json' });
    const requestOptions = new RequestOptions({ method: RequestMethod.Put, headers: headerOptions });
    return this.http.put('http://localhost:52414/api/House/' + id, body, requestOptions);
  }
  /**
   * Function sends a get request to our backend,and returns all data.(in our case it is Flat array)
   * @memberof HouseService HouseService- Service that contains all RESTfull functions that we need
   */
  getHouseList() {
    return this.http.get('http://localhost:52414/api/House');
  }
  /**
   * function sends a delete request on our (backend) to delete a object that user wants to delete
   * @param {*} event event-Object, consist of:
   * data: Object - original row data
   * newData: Object - edited data
   * source: DataSource - table data source
   * confirm: Deferred - Deferred object with resolve(newData: Object) and reject() methods
   * @memberof HouseService HouseService Service that contains all RESTfull functions that we need
   */
  deleteHouse(event) {

    return this.http.delete('http://localhost:52414/api/House/' + event.data.id);
  }
  /**
   * function sends a get request to our backend to get all all flats
   * that are located in additional house
   * @param {number} id id- id of house that has flats that we need
   * @returns returns array of flat objects of additional house
   * @memberof HouseService HouseService Service that contains all RESTfull functions that we need
   */
  GetHouseFlats(id: number) {
    return this.http.get('http://localhost:52414/api/House/' + id + '/flats');
  }
  /**
   * fucntion sends a get request to get one additional house that we need
   * @param {number} id id- id of house that we want to get
   * @returns returns a house as a object
   * @memberof HouseService HouseService Service that contains all RESTfull functions that we need
   */
  GetOneHouse(id: number) {
    return this.http.get('http://localhost:52414/api/House/' + id);
  }

}
