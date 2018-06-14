import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { House } from './house.module';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';


@Injectable()
export class HouseService {
    selectedHouse: House;
    houseList: House[];
    constructor(private http: Http) { }
    /**
     * this function addes a new object to our database that is
     * located in our backedn(other localhost that we have)
     * @param {House} hos this param inheritance(наследует) our house model(class)
     * @returns returns a new object to our localhost where is located our database.
     * @memberof HouseService Service that contains all RESTfull functions that we need
     */
    postHouse(house: House) {
        const body = JSON.stringify(house); // why i cant use var and let instead of const here?
        const headerOptions = new Headers({ 'Content-Type': 'application/json' });
        const requestOptions = new RequestOptions({ method: RequestMethod.Post, headers: headerOptions });
        return this.http.post('http://localhost:52414/api/House', body, requestOptions).map(x => x.json());
      }
      /**
       * function that moddifies our existed objects that we have in our database,saves all this
       * changes and sends them back to our backend,where it will be saved in database
       * @param {any} id we need this param (id) so we could moddefie the exact object that we need(all objects have their unique id)
       * @param {any} hos "hos" is a param that contains all our class fields that are initializated in our form
       * @returns returns  moddified object and sends it back tou our localhost(our backend) where is located our database.
       * @memberof HouseService Service that contains all RESTfull functions that we need
       */
      putHouse(id, house) {
        const body = JSON.stringify(house); // why i cant use var and let instead of const here?
        const headerOptions = new Headers({ 'Content-Type': 'application/json' });
        const requestOptions = new RequestOptions({ method: RequestMethod.Put, headers: headerOptions });
        return this.http.put('http://localhost:52414/api/House/' + id, body, requestOptions).map(x => x.json());
      }
      /**
       * this function gets all our objects(house objects),from our localhost(backend) where are located our database with all this objects.
       * Function "maps"(something like forEach in C#) by using function "map" and records all this objects that
       * we have in a variable called "data"...
       * this variable will pe converted to a json as a House(class/model) array and then all
       * this objects that is in our data,will be puted in a variable "houseList" that inheritanced(наследовал)
       * class "House"
       * @memberof HouseService Service that contains all RESTfull functions that we need
       */
      getHouseList() {
        // this.http.get('http://localhost:52414/api/House')
        //   .map((data: Response) => {
        //     return data.json() as House[];
        //   }).toPromise().then(x => {
        //     this.houseList = x;
        //   });
        return this.http.get('http://localhost:52414/api/House');
      }
      /**
       * function that will delete the selected house object
       * @param {number} id id of an object that we want to delete
       * @returns returns a http request that requests to delete the object with following id.
       * @memberof HouseService Service that contains all RESTfull functions that we need
       */
      deleteHouse(id: number) {
        return this.http.delete('http://localhost:52414/api/House/' + id).map(res => res.json());
      }
      GetHouse() {
        this.getHouseList();
        return this.houseList;
      }
}
