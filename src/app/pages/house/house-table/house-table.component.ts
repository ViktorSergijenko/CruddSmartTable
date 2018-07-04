import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { HouseService } from '../House.service';
import { DataSource } from '../../../../../node_modules/ng2-smart-table/lib/data-source/data-source';
import { SmartTableService } from '../../../@core/data/smart-table.service';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { House } from '../house.module';
import { Router, ActivatedRoute } from '@angular/router';

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
  settings = { // setting of our smart table (buttons,columns,names......)
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
      deleteButtonContent: '<i class="nb-trash"></i>',
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
      flatamount: {
        title: 'FlatAmount',
        type: 'Flat',
      },
    },
  };
  source: LocalDataSource = new LocalDataSource(); // ng2 smart table functionality
  // our constructor calles getHouseList() function to send a request to our backend so he could rewturn us all house objects...
  // then all this returned values will be placed in houseList from HouseService(Array of House Objects),and after that...
  // function load() from LocalDataSource class will load all this data to our smart table
  constructor(private houseService: HouseService, private http: Http, private router: Router, private route: ActivatedRoute) {
    // houseService.mysubject.next('My favourite value');
    this.houseService.getHouseList().subscribe(resp => {
      console.log(resp.json());
      this.houseService.houseList = resp.json();
      this.source.load(resp.json());
      this.source.count();
      this.houseService.TotalAmountOfHosesInTable = this.source.count();
    });
  }
  /**
 *If user will confirm that he wants to delete additional resident,
 *then this function will call "deleteResident" fucntion that will make a delete request
 *
 * @param {*} event - event-Object, consist of:
 *data: Object - original row data
 *newData: Object - edited data
 *source: DataSource - table data source
 *confirm: Deferred - Deferred object with resolve(newData: Object) and reject() methods
 * @memberof ResidentTableComponent ResidentTableComponent - Have all setting of our resident smart table
 */
  onDeleteConfirm(event): void {
    this.houseService.deleteHouse(event);
    this.houseService.TotalAmountOfHosesInTable = this.houseService.TotalAmountOfHosesInTable - 1;
  }
  /**
   *If user will confirm that he wants to add a new resident,function will call
   *"postResident" function that will make a post request to other localhost
   * @param {*} event event-Object, consist of:
   *data: Object - original row data
   *newData: Object - edited data
   *source: DataSource - table data source
   *confirm: Deferred - Deferred object with resolve(newData: Object) and reject() methods
   * @memberof ResidentTableComponent ResidentTableComponent - Have all setting of our resident smart table
   */
  onCreateConfirm(event): void {
    const data = { // values of our data that we will work with
      'id': event.newData.id = 0,
      'street': event.newData.street,
      'city': event.newData.city,
      'country': event.newData.country,
      'postindex': event.newData.postindex,
    };
    this.houseService.postHouse(event, data);
    this.houseService.TotalAmountOfHosesInTable = this.houseService.TotalAmountOfHosesInTable + 1;
  }
  /**
  *If user will confirm that he wants to change information about additional resident
  * function will call other function called "putResident",that will send put request to our backend
  * @param {*} event event-Object, consist of:
  *data: Object - original row data
  *newData: Object - edited data
  *source: DataSource - table data source
  *confirm: Deferred - Deferred object with resolve(newData: Object) and reject() methods
  * @memberof ResidentTableComponent ResidentTableComponent - Have all setting of our resident smart table
  */
  onSaveConfirm(event): void {
    const data = { // values of our data that we will work with
      'id': event.newData.id,
      'street': event.newData.street,
      'city': event.newData.city,
      'country': event.newData.country,
      'postindex': event.newData.postindex,
    };
    this.houseService.putHouse(event, data);
  }
  onUserRowSelect(event) {
    console.log('user row select: ', event.data.id);
    this.router.navigate(['/pages/flat/flat-table/' + event.data.id], { relativeTo: this.route });
    // this.houseService.GetHouseFlats(event.data.id);
  }

}
// valuePrepareFunction: (cell, row) => {
//  return '<a title="See Detail Product " href = "Your api key or something/${row.Id}" > <i class="ion-edit" > </i></a >';
// }
