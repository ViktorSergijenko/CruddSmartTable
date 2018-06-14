import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Flat } from './flat.module';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';


@Injectable()
export class FlatService {
    selectedFlat: Flat;
    flatList: Flat[];
    constructor(private http: Http) { }
    /**
     * this function addes a new object to our database that is
     * located in our backedn(other localhost that we have)
     * @param {Flat} flat this param inheritance(наследует) our house model(class)
     * @returns returns a new object to our localhost where is located our database.
     * @memberof FlatService Service that contains all RESTfull functions that we need
     */
    postFlat(flat: Flat) {
        const body = JSON.stringify(flat); // why i cant use var and let instead of const here?
        const headerOptions = new Headers({ 'Content-Type': 'application/json' });
        const requestOptions = new RequestOptions({ method: RequestMethod.Post, headers: headerOptions });
        return this.http.post('http://localhost:52414/api/Flat', body, requestOptions).map(x => x.json());
      }
      /**
       * function that moddifies our existed objects that we have in our database,saves all this
       * changes and sends them back to our backend,where it will be saved in database
       * @param {any} id we need this param (id) so we could moddefie the exact object that we need(all objects have their unique id)
       * @param {any} flat "flat" is a param that contains all our class fields that are initializated in our form
       * @returns returns  moddified object and sends it back tou our localhost(our backend) where is located our database.
       * @memberof FlatService Service that contains all RESTfull functions that we need
       */
      putFlat(id, flat) {
        const body = JSON.stringify(flat); // why i cant use var and let instead of const here?
        const headerOptions = new Headers({ 'Content-Type': 'application/json' });
        const requestOptions = new RequestOptions({ method: RequestMethod.Put, headers: headerOptions });
        return this.http.put('http://localhost:52414/api/Flat/' + id, body, requestOptions).map(x => x.json());
      }
      /**
       * Function sends a get request to our backend,and returns all data.(in our case it is Flat array)
       * @memberof FlatService Service that contains all RESTfull functions that we need
       */
      getFlatList() {
        return this.http.get('http://localhost:52414/api/Flat');
      }
      /**
       * function that will delete the selected flat object
       * @param {number} id id of an object that we want to delete
       * @returns returns a http request that requests to delete the object with following id.
       * @memberof FlatService Service that contains all RESTfull functions that we need
       */
      deleteFlat(id: number) {
        return this.http.delete('http://localhost:52414/api/Flat/' + id).map(res => res.json());
      }
}
