import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ResidentService } from '../resident.service';
import { DataSource } from '../../../../../node_modules/ng2-smart-table/lib/data-source/data-source';
import { SmartTableService } from '../../../@core/data/smart-table.service';
import { Resident } from '../resident.module';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
@Component({
  selector: 'app-resident-table',
  templateUrl: './resident-table.component.html',
  styles: [`
  nb-card {
    transform: translate3d(0, 0, 0);
  }
`],
})
export class ResidentTableComponent {
  // vesj html(kak vigljadjat i nazivajutsja nawi polja i td,vsja eta infa sazovivaetsja v peremennuju "settings")
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
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      firstname: {
        title: 'First Name',
        type: 'string',
      },
      lastname: {
        title: 'Last Name',
        type: 'string',
      },
      postcode: {
        title: 'Post-code',
        type: 'string',
      },
      phone: {
        title: 'Phone Number',
        type: 'string',
      },
      email: {
        title: 'E-mail',
        type: 'string',
      },
      flatid: {
        title: 'FlatId',
        type: 'number',
      },
    },
  };
  // source nasleduet nowij object klassa LocalDataSource,tem samim nasleduja vesj funkcional(budu ispolzovatj funkciju "load")...
  // dlja togo wtobi zagruzaitj svoi dannie v tablicu/
  source: LocalDataSource = new LocalDataSource();
  // v konstruktore ja sozdaju peremennuju kotoraja nasleduet klass HouseService(vesj Restfull Funkcional imenno tut)...
  constructor(private residentService: ResidentService, private http: Http) {
    // vipolnjaet funkciju getFlatList iz klassa FlatService,subskrajbit dlja togo wtobi snachala prowli...
    // vse dannie po zaprosu "GET" i kak tolko vse dannie prijdut,liw togda programma nachnot zasovivatj...
    // vse eti dannie(massiv tipa Flat),v peremennuju flatList
    this.residentService.getResidentList().subscribe((resp) => {
      this.residentService.residentList = resp.json();
      this.source.load(residentService.residentList);
    });
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
    this.residentService.deleteResident(event);
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
      'firstname' : event.newData.firstname,
      'lastname' : event.newData.lastname,
      'postcode' :  event.newData.postcode,
      'phone' : event.newData.phone,
      'email' : event.newData.email,
      'flatid' : event.newData.flatid,
    };
    this.residentService.postResident(event, data);
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
      'firstname' : event.newData.firstname,
      'lastname' : event.newData.lastname,
      'postcode' :  event.newData.postcode,
      'phone' : event.newData.phone,
      'email' : event.newData.email,
      'flatid' : event.newData.flatid,
    };
    this.residentService.putResident(event, data);
  }
}

