import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Resident } from './resident.module'; // our resident model is located here
import { Flat } from '../../pages/flat/flat.module'; // our flat model is located here
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http'; // for http(crud) requests


@Injectable()
export class ResidentService { // service that will contain all crud fucntions and values for them for resident model
  selectedResident: Resident; // value that will contain an additional resident object(just one)
  residentList: Resident[]; // array that will contain all returned house objects
  residentFlatIdList: any[] = []; // array that will hold all flat idies that exist in database
  flatList: Flat[]; // array that will contain all returned flat objects
  TotalResidents: number;
  constructor(private http: Http) { }
  /**
   *this function addes a new  object to our databse that is located on our backend.
   *Function sends a post request to other local server(backend),sends a new object that has to be added
   * @param {*} event event-Object, consist of:
   *data: Object - original row data
   *newData: Object - edited data
   *source: DataSource - table data source
   *confirm: Deferred - Deferred object with resolve(newData: Object) and reject() methods
   * @param {*} data Object - original row data
   * @memberof ResidentService Service that contains all RESTfull functions that we need
   */
  postResident(event, data) {
    if (window.confirm('Are you sure you want to add a resident?')) {
      this.http.post('http://localhost:52414/api/Resident', data).subscribe(res => {
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
   * @param {*} event event-Object, consist of:
   *data: Object - original row data
   *newData: Object - edited data
   *source: DataSource - table data source
   *confirm: Deferred - Deferred object with resolve(newData: Object) and reject() methods
   * @param {*} data Object - original row data
   * @memberof ResidentService Service that contains all RESTfull functions that we need
   */
  putResident(event, data) {
    if (window.confirm('Are you sure you want to update info about a resident?')) {
      this.http.put('http://localhost:52414/api/Resident/' + event.newData.id, data).subscribe(res => {
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
  getResidentList() {
    return this.http.get('http://localhost:52414/api/Resident');
  }
  /**
   *function sends a delete request on our (backend) to delete a object that user wants to delete
   *
   * @param {*} event event-Object, consist of:
   *data: Object - original row data
   *newData: Object - edited data
   *source: DataSource - table data source
   *confirm: Deferred - Deferred object with resolve(newData: Object) and reject() methods
   * @memberof ResidentService Service that contains all RESTfull functions that we need
   */
  deleteResident(event) {
    if (window.confirm('Are you sure you want to delete?')) {
      console.log(event.data);
      this.http.delete('http://localhost:52414/api/Resident/' + event.data.id).subscribe(res => {
        console.log(res);
        event.confirm.resolve(event.source.data);
      });
    } else {
      event.confirm.reject();
    }
  }
  /**
   *function that will send a request to backend so he could returns us all...
   *flat objects
   * @returns Flat list(all flat objects)
   * @memberof ResidentService Service that contains all RESTfull functions that we need
   */
  getFlatIds() {
    return this.http.get('http://localhost:52414/api/Flat');
  }
}

