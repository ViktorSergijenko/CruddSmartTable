import { Component, OnInit, OnChanges } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ResidentService } from '../resident.service';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FlatService } from '../../flat/flat.service';
import { Resident } from '../resident.model';
import { NgForm } from '@angular/forms';
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
  flatId: any;
  // vesj html(kak vigljadjat i nazivajutsja nawi polja i td,vsja eta infa sazovivaetsja v peremennuju "settings")
  settings = { // setting of our smart table (buttons,columns,names......)
    mode: 'external',
    noDataMessage: 'Sorry, but there is no Residents in this house,if you want to watch all Residents,Press GO TO RESIDENT LIST button ',
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
        editable: false,
        title: 'FlatId',
        type: 'html',
        editor: {
          type: 'list',
          config: {
            list: [],
          },
        },
      },
    },
  };
  source: LocalDataSource = new LocalDataSource(); // fucntionality of our ng2 smart table
  // our constructor calles getFlatList() function to send a request to our backend so he could return us all house objects...
  // then all this returned values will be placed in flatList from FlatService(Array of Flat Objects),and after that...
  // function load() from LocalDataSource class will load all this data to our smart table
  constructor(
    public residentService: ResidentService,
    public flatService: FlatService,
    private http: Http,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.residentService.selectedResident = new Resident();
    this.residentService.ResidentEditForm = null;
    this.residentService.ResidentRegForm = null;
    // first of all we get value from route,we use it to define house id as a params.id
    // then we use GetFlatResidents , getResidentList and GetOneFlat to get all needed information to load in table
    // and counting all objects
    this.route.params.subscribe((params: any) => {
      this.flatService.SourtedResidents = [];
      console.log('I am there');
      this.flatId = params.id;
      console.log(params.id);
      this.flatService.GetFlatResidents(params.id).subscribe(myResidents => {
        this.flatService.SourtedResidents = myResidents.json();
        this.residentService.getResidentList().subscribe(myResidentsALL => {
          this.residentService.residentList = myResidentsALL.json();
          this.flatService.GetOneFlat(params.id).subscribe(OneFlat => {
            this.flatService.selectedFlat = OneFlat.json();
            console.log('BLEDJ' + OneFlat.json());
            this.residentService.TotalResidentsInAllFlats = this.residentService.residentList.length;
          });
        });
      });
      // if route returns params.id as 'all' or it is undefined then
      // programm will load all flats in to the table that we have in our database on our backend
      if (!params.id || params.id === 'all') {
        this.residentService.getResidentList().subscribe(resident => {
          this.residentService.residentList = resident.json();
          this.source.load(this.residentService.residentList);
          this.residentService.TotalResidentsInAllFlats = this.source.count();
          this.flatService.selectedFlat = null;
        });
        // else (if we have returned param.id as a number) it will load to
        // the table all flats that include house with id that have === param.id
      } else {
        this.flatService.GetFlatResidents(params.id).subscribe(resident => {
          this.flatService.SourtedResidents = resident.json();
          this.source.load(this.flatService.SourtedResidents);
          this.residentService.TotalResidentsInAdditionalFlat = this.source.count();
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
        const myTest = { value: flat.id, title: flat.id };
        options.push(myTest);
      });
      this.settings.columns.flatid.editor.config.list = options;
      this.settings = Object.assign({}, this.settings);
      console.log(options);
      this.source.refresh();
    });
    this.residentService.TotalResidentsInAllFlats = this.source.count();
  }
  /**
   * If user will confirm that he wants to delete additional resident,
   * then this function will call "deleteResident" fucntion that will make a delete request
   *
   * @param {*} event - event-Object, consist of:
   * data: Object - original row data
   * newData: Object - edited data
   * source: DataSource - table data source
   * confirm: Deferred - Deferred object with resolve(newData: Object) and reject() methods
   * @memberof ResidentTableComponent ResidentTableComponent - Have all setting of our resident smart table
   */
  onDeleteConfirm(event): void {
    this.residentService.deleteResident(event);
    this.residentService.TotalResidentsInAllFlats = this.residentService.TotalResidentsInAllFlats - 1;
    this.residentService.TotalResidentsInAdditionalFlat = this.residentService.TotalResidentsInAdditionalFlat - 1;
  }
  /**
   * If user will confirm that he wants to add a new resident,function will call
   *"postResident" function that will make a post request to other localhost
   * @param {*} event event-Object, consist of:
   * data: Object - original row data
   * newData: Object - edited data
   * source: DataSource - table data source
   * confirm: Deferred - Deferred object with resolve(newData: Object) and reject() methods
   * @memberof ResidentTableComponent ResidentTableComponent - Have all setting of our resident smart table
   */
  onCreateConfirm(event): void {
    // const data = { // values of our data that we will work with
    //   'id': event.newData.id = 0,
    //   'firstname': event.newData.firstname,
    //   'lastname': event.newData.lastname,
    //   'postcode': event.newData.postcode,
    //   'phone': event.newData.phone,
    //   'email': event.newData.email,
    //   'flatid': event.newData.flatid,
    // };
    // this.residentService.postResident(event, data);
    // this.residentService.TotalResidentsInAllFlats = this.residentService.TotalResidentsInAllFlats + 1;
    // this.residentService.TotalResidentsInAdditionalFlat = this.residentService.TotalResidentsInAdditionalFlat + 1;
    // this.source.refresh();
    this.residentService.ResidentRegForm = 1;
  }
  /**
   * If user will confirm that he wants to change information about additional resident
   * function will call other function called "putResident",that will send put request to our backend
   * @param {*} event event-Object, consist of:
   * data: Object - original row data
   * newData: Object - edited data
   * source: DataSource - table data source
   * confirm: Deferred - Deferred object with resolve(newData: Object) and reject() methods
   * @memberof ResidentTableComponent ResidentTableComponent - Have all setting of our resident smart table
   */
  onSaveConfirm(event): void {
    // const data = { // values of our data that we will work with
    //   'id': event.newData.id,
    //   'firstname': event.newData.firstname,
    //   'lastname': event.newData.lastname,
    //   'postcode': event.newData.postcode,
    //   'phone': event.newData.phone,
    //   'email': event.newData.email,
    //   'flatid': event.newData.flatid,
    // };
    // this.residentService.putResident(event, data);
    this.residentService.selectedResident = Object.assign({}, event.data);
    this.residentService.ResidentEditForm = 1;
  }
  /**
   * Function will be use on button,when we will click on button,
   * function will send uss on other page
   * @memberof ResidentTableComponent ResidentTableComponent - Have all setting of our resident smart table
   */
  goBack(): void {
    this.location.back();
  }
  /**
   * This function is use on a button,when we will press button,it will
   * send uss on a Flat table page,where will be loaded all flats that we have in database
   * @memberof ResidentTableComponent ResidentTableComponent - Have all setting of our resident smart table
   */
  getFullList(): void {
    this.router.navigate(['/pages/resident/resident-table'],
    );
  }
  resetForm(form?: NgForm) {
    // tslint:disable-next-line:curly
    if (form != null)
      form.reset();
    this.residentService.selectedResident = {
      id: null,
      firstname: '',
      lastname: '',
      postcode: '',
      phone: '',
      email: '',
      flatid: this.flatId,
    };
  }
  onSubmit(form: NgForm) {
    if (!form.value.id) {
      this.residentService.postResident(form.value).subscribe(data => {
        this.resetForm(form);
        // this.toastr.success('New Record Added', 'House registered');
      });
    } else {
      this.residentService.putResident(form.value.id, form.value)
        .subscribe(data => {
          this.resetForm(form);
          // this.toastr.info('Record updated', 'Flat info was changed');
        });
    }
  }
  onClose(form?: NgForm): void {
    this.residentService.ResidentRegForm = null;
    this.residentService.ResidentEditForm = null;
    this.resetForm(form);
  }
}

