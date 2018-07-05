import { Component, OnInit, OnChanges } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ResidentService } from '../resident.service';
import { DataSource } from '../../../../../node_modules/ng2-smart-table/lib/data-source/data-source';
import { SmartTableService } from '../../../@core/data/smart-table.service';
import { Resident } from '../resident.module';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FlatService } from '../../flat/flat.service';
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
  totalRows: number = 0;
  // vesj html(kak vigljadjat i nazivajutsja nawi polja i td,vsja eta infa sazovivaetsja v peremennuju "settings")
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
        type: 'html',
        editor: {
          type: 'list',
          config: {
            list: [],
          },
        },
      },
      // Actions: // or something
      //  {
      //    title: 'Detail',
      //    type: 'html',
      //    filter: false,
      //    editable: false,
      //   addable: false,
      //   valuePrepareFunction: (cell, row) => {
      //     return '<a title="See Detail Product " href = "Your api key or something/${row.Id}" > <i class="ion-edit" > </i></a >';
      //   },
      //    Id: { //  this Id to use in ${row.Id}
      //      title: 'ID',
      //      type: 'number',
      //   },
      // },
    },
  };
  source: LocalDataSource = new LocalDataSource(); // fucntionality of our ng2 smart table
  // our constructor calles getFlatList() function to send a request to our backend so he could return us all house objects...
  // then all this returned values will be placed in flatList from FlatService(Array of Flat Objects),and after that...
  // function load() from LocalDataSource class will load all this data to our smart table
  constructor(
    private residentService: ResidentService,
    private flatService: FlatService,
    private http: Http,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.route.params.subscribe((params: any) => {
      this.flatService.SourtedResidents = [];
      console.log('I am there');
      console.log(params.id);
      this.flatService.GetFlatResidents(params.id).subscribe(myResidents => {
        this.flatService.SourtedResidents = myResidents.json();
        this.residentService.getResidentList().subscribe(resident => {
          this.residentService.residentList = resident.json();
        });
      });
      if (!params.id || params.id === 'all') {
        this.residentService.getResidentList().subscribe(resident => {
          this.residentService.residentList = resident.json();
          this.source.load(this.residentService.residentList);
          this.residentService.TotalResidents = this.source.count();
        });
      } else {
        this.flatService.GetFlatResidents(params.id).subscribe(resident => {
          this.flatService.SourtedResidents = resident.json();
          this.source.load(this.flatService.SourtedResidents);
          this.source.refresh();
          this.flatService.SourtedResidents = [];
        });
      }
      this.source.refresh();
    });
    const options = [];
    this.residentService.getFlatIds().subscribe(resp => {
      this.residentService.flatList = resp.json();
      this.residentService.flatList.map(flat => {
        const myTest = { value: flat.id, title: flat.number };
        options.push(myTest);
      });
      this.settings.columns.flatid.editor.config.list = options;
      this.settings = Object.assign({}, this.settings);
      console.log(options);
    });
    this.residentService.getResidentList().subscribe((resp) => {
      this.residentService.residentList = resp.json();
      this.source.load(residentService.residentList);
      this.residentService.TotalResidents = this.source.count();
      console.log(this.residentService.TotalResidents);
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
    this.residentService.deleteResident(event);
    this.residentService.TotalResidents = this.residentService.TotalResidents - 1;
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
      'firstname': event.newData.firstname,
      'lastname': event.newData.lastname,
      'postcode': event.newData.postcode,
      'phone': event.newData.phone,
      'email': event.newData.email,
      'flatid': event.newData.flatid,
    };
    this.residentService.postResident(event, data);
    this.residentService.TotalResidents = this.residentService.TotalResidents + 1;
    this.source.refresh();
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
      'firstname': event.newData.firstname,
      'lastname': event.newData.lastname,
      'postcode': event.newData.postcode,
      'phone': event.newData.phone,
      'email': event.newData.email,
      'flatid': event.newData.flatid,
    };
    this.residentService.putResident(event, data);
  }

  goBack(): void {
    this.router.navigate(['/pages/flat/flat-table/all'], { relativeTo: this.route });
  }
  getFullList(): void {
    this.source.empty();
    this.source.load(this.residentService.residentList);
    this.residentService.TotalResidents = this.source.count();
    this.source.refresh();
  }
}

