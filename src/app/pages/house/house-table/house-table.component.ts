import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { HouseService } from '../House.service';
import { DataSource } from '../../../../../node_modules/ng2-smart-table/lib/data-source/data-source';
import { SmartTableService } from '../../../@core/data/smart-table.service';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { House } from '../house.module';

@Component({
  selector: 'app-house-table',
  templateUrl: './house-table.component.html',
  styles: [`
  nb-card {
    transform: translate3d(0, 0, 0);
  }
`],
})
export class HouseTableComponent {
  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash" (click)="justGettingHouses()"></i>',
      confirmDelete: true,
    },
    columns: {
      street: {
        title: 'Street Name',
        type: 'string',
      },
      city: {
        title: 'City',
        type: 'string',
      },
      country: {
        title: 'Country',
        type: 'string',
      },
      postindex: {
        title: 'P.Index',
        type: 'string',
      },
    },
  };
  data: any = [];
  source: LocalDataSource = new LocalDataSource();
  constructor(private houseService: HouseService, private http: Http) {
    this.houseService.getHouseList().subscribe(resp => {
      console.log(resp.json());
      this.houseService.houseList = resp.json();
      this.source.load(resp.json());
    });

    // var data = houseService.houseList; // data = undefined ;(
    // var data = houseService.GetHouse(); // same
    // this.source.load(data); // problem with this
    // this.source.load(houseService.houseList); // problem with this
    // this.source.load(data); // problem with this
  }
  /**
 *If user will confirm that he wants to delete additional resident,
 *then this function will call "deleteResident" fucntion that will make a delete request
 *
 * @param {*} event - event-Object, consist of:
data: Object - original row data
newData: Object - edited data
source: DataSource - table data source
confirm: Deferred - Deferred object with resolve(newData: Object) and reject() methods
 * @memberof ResidentTableComponent ResidentTableComponent - Have all setting of our resident smart table
 */
onDeleteConfirm(event): void {
  this.houseService.deleteHouse(event);
}
/**
 *If user will confirm that he wants to add a new resident,function will call
 *"postResident" function that will make a post request to other localhost
 * @param {*} event event-Object, consist of:
data: Object - original row data
newData: Object - edited data
source: DataSource - table data source
confirm: Deferred - Deferred object with resolve(newData: Object) and reject() methods
 * @memberof ResidentTableComponent ResidentTableComponent - Have all setting of our resident smart table
 */
onCreateConfirm(event): void {
  const data = {
    'id' : event.newData.id = 0,
    'street' : event.newData.street,
    'city' : event.newData.city,
    'country' :  event.newData.country,
    'postindex' : event.newData.postindex,
  };
  this.houseService.postHouse(event, data);
}
/**
*If user will confirm that he wants to change information about additional resident
* function will call other function called "putResident",that will send put request to our backend
* @param {*} event event-Object, consist of:
data: Object - original row data
newData: Object - edited data
source: DataSource - table data source
confirm: Deferred - Deferred object with resolve(newData: Object) and reject() methods
* @memberof ResidentTableComponent ResidentTableComponent - Have all setting of our resident smart table
*/
onSaveConfirm(event): void {
  const data = {
    'id' : event.newData.id,
    'street' : event.newData.street,
    'city' : event.newData.city,
    'country' :  event.newData.country,
    'postindex' : event.newData.postindex,
  };
  this.houseService.putHouse(event, data);
}


}
