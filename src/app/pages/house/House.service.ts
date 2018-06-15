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
    *this function addes a new  object to our databse that is located on our backend.
    *Function sends a post request to other local server(backend),sends a new object that has to be added
    * @param {*} event Object
    * @param {*} data Object - original row data
    * @memberof FlatService Service that contains all RESTfull functions that we need
    */
   postHouse(event, data) {
    if (window.confirm('Are you sure you want to add a House?')) {
      this.http.post('http://localhost:52414/api/House', data).subscribe(res => {
        console.log(res);
        event.confirm.resolve(event.newData);
      });
      } else {
        event.confirm.reject();
      }
  }
 /**
  *this function saves all changes with our object(Resident),function sends a put request to
  *our database that is located on backend,it sends a new information about resident to chnage information about him
  * @param {*} event its object
  * @param {*} data Object - original row data
  * @memberof FlatService Service that contains all RESTfull functions that we need
  */
 putHouse(event, data) {
    if (window.confirm('Are you sure you want to update info about a House?')) {
      this.http.put('http://localhost:52414/api/House/' + event.newData.id, data).subscribe(res => {
        console.log(res);
        event.confirm.resolve(event.newData);
      });
      } else {
        event.confirm.reject();
      }
  }
  /**
   * Function sends a get request to our backend,and returns all data.(in our case it is Flat array)
   * @memberof ResidentService Service that contains all RESTfull functions that we need
   */
  getHouseList() {
    return this.http.get('http://localhost:52414/api/House');
  }
 /**
  *function sends a delete request on our (backend) to delete a object that user wants to delete
  *
  * @param {*} event Object
  * @memberof FlatService Service that contains all RESTfull functions that we need
  */
 deleteHouse(event) {
    if (window.confirm('Are you sure you want to delete?')) {
      console.log(event.data);
      this.http.delete('http://localhost:52414/api/House/' + event.data.id).subscribe(res => {
      console.log(res);
      event.confirm.resolve(event.source.data);
    });
    } else {
      event.confirm.reject();
    }
  }
}
