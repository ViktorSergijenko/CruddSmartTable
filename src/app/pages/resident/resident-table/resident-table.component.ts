import { Component, OnInit, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ResidentService } from '../resident.service';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FlatService } from '../../flat/flat.service';
import { Resident } from '../resident.model';
import { NgForm } from '@angular/forms';
import { ToasterModule, ToasterService } from '../../../../../node_modules/angular2-toaster';

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
  numberPattern = '^2[0-9]{7}'; // pattern for our phone number, but still didnt manage to use it...
  myflatId: any; // variable that will contain value that will come from our param.id
  myError: string = null; // variable that will contain value that will come from server(if server returned an error)
  myReturnedResident;
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
    private toasterService: ToasterService,
  ) {
    this.residentService.selectedResident = new Resident(this.myflatId);
    this.residentService.ResidentEditForm = null;
    this.residentService.ResidentRegForm = null;
    // first of all we get value from route,we use it to define flat id as a params.id
    // then we use GetFlatResidents , getResidentList and GetOneFlat to get all needed information to load in table
    // and counting all objects
    this.route.params.subscribe((params: any) => {
      console.log('I am there');
      this.myflatId = params.id;
      console.log(params.id);
      // if route returns params.id as 'all' or it is undefined then
      // programm will load all flats in to the table that we have in our database on our backend
      if (!params.id || params.id === 'all') {
        this.residentService.getResidentList().subscribe(resident => {
          this.residentService.residentList = resident.json();
          this.source.load(this.residentService.residentList);
          this.residentService.TotalResidentsInAllFlats = this.source.count();
          this.flatService.selectedFlat = null;
        });
        // else (if we have returned param.id as a number(not null or undefined)) it will load to
        // tot the table only those residents,that are located in flat that  id is equal to the value that has param.id
      } else {
        this.resetForm();
        this.flatService.GetFlatResidents(params.id).subscribe(resident => {
          this.flatService.SourtedResidents = resident.json();
          this.source.load(this.flatService.SourtedResidents);
          this.flatService.GetOneFlat(params.id).subscribe(oneFlat => {
            this.flatService.selectedFlat = oneFlat.json();
          });
          this.residentService.getAllResidentAmount().subscribe(resAmount => {
            this.residentService.TotalResidentsInAllFlats = resAmount.json();
            this.residentService.GetResidentAmountInOneFlat(params.id).subscribe(resAmountInOneFlat => {
              this.residentService.TotalResidentsInAdditionalFlat = resAmountInOneFlat.json();
              this.source.refresh();
            });
          });
        });
      }
    });
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
    this.residentService.deleteResident(event).subscribe(res => {
      console.log(res);
      this.source.remove(event.data);
      this.residentService.TotalResidentsInAllFlats = this.residentService.TotalResidentsInAllFlats - 1;
      this.residentService.TotalResidentsInAdditionalFlat = this.residentService.TotalResidentsInAdditionalFlat - 1;
    });
  }
  /**
   * If user will click on 'Plus' button it will open registration form
   * @param {*} event event-Object, consist of:
   * data: Object - original row data
   * newData: Object - edited data
   * source: DataSource - table data source
   * confirm: Deferred - Deferred object with resolve(newData: Object) and reject() methods
   * @memberof ResidentTableComponent ResidentTableComponent - Have all setting of our resident smart table
   */
  onCreateConfirm(event): void {
    this.resetForm();
    this.residentService.ResidentRegForm = 1;
  }
  /**
   * If user will click on 'pencil' button, it will open edit form
   * @param {*} event event-Object, consist of:
   * data: Object - original row data
   * newData: Object - edited data
   * source: DataSource - table data source
   * confirm: Deferred - Deferred object with resolve(newData: Object) and reject() methods
   * @memberof ResidentTableComponent ResidentTableComponent - Have all setting of our resident smart table
   */
  onSaveConfirm(event): void {
    // tslint:disable-next-line:max-line-length
    this.myReturnedResident = event;
    this.residentService.selectedResident = Object.assign({}, event.data); // this will send all values that has our object that we want to edit to our form
    this.residentService.ResidentEditForm = 1; // if ResidentEditForm value is not 0, then it will be shown
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

  /**
   * Function will reset our object values un form
   * @param {NgForm} [form] form-this property will say on what form will be used this function
   * @memberof ResidentTableComponent ResidentTableComponent - Have all setting of our resident smart table
   */
  resetForm(form?: NgForm) {
    // tslint:disable-next-line:curly
    this.residentService.selectedResident = new Resident(this.myflatId);
  }

  /**
   * Function is used on button submit in registration or edit form,if in form our object id is null
   * then when user will click in submit button it will send a post request to server, to create a new object in database,if server
   * will return an error then user will see the message error that will ensure him what did he do wrong.
   * If our object in form has id,then when user will click submit button it will send a put request to our server, to
   * change our object values in database to a new one,if server
   * will return an error then user will see the message error that will ensure him what did he do wrong.
   * @param {NgForm} form form-this property will say on what form will be used this function
   * @memberof ResidentTableComponent ResidentTableComponent - Have all setting of our resident smart table
   */
  onSubmit(form: NgForm) {
    if (!form.value.id) {
      this.residentService.postResident(form.value).subscribe(newResident => {
        this.source.prepend(newResident);
        this.toasterService.popAsync('success', 'Resident was added');
        this.resetForm(form);
        this.residentService.getAllResidentAmount().subscribe(resAmount => {
          this.residentService.TotalResidentsInAllFlats = resAmount.json();
          this.residentService.GetResidentAmountInOneFlat(this.myflatId).subscribe(resAmountInOneFlat => {
            this.residentService.TotalResidentsInAdditionalFlat = resAmountInOneFlat.json();
            this.source.refresh();
          });
        });
      }, (err) => {
        this.myError = <any>err; // .json();
        console.log('this is my errorito: ' + err.text());
        this.myError = err.text();
        console.log('myerrorito' + this.myError);
        this.toasterService.popAsync('error', 'Custom error in component', this.myError);
      },
      );
    } else {
      this.residentService.putResident(form.value.id, form.value)
        .subscribe(editedResident => {
          this.source.update(this.myReturnedResident.data, editedResident);
          this.toasterService.popAsync('Record updated', 'Resident info was changed');
          this.resetForm(form);
        },
          (err) => {
            this.myError = <any>err; // .json();
            console.log('this is my errorito: ' + err.text());
            this.myError = err.text();
            console.log('myerrorito' + this.myError);
            this.toasterService.popAsync('error', 'Custom error in component', this.myError);
          });
    }
  }
  /**
  * Function will close registration or edit form in resident table
  * Used on button in forms
  * @param {NgForm} [form] form-this property will say on what form will be used this function
  * @memberof ResidentTableComponent ResidentTableComponent - Have all setting of our resident smart table
  */
  onClose(form?: NgForm): void {
    this.residentService.ResidentRegForm = null;
    this.residentService.ResidentEditForm = null;
    this.resetForm(form);
  }
}

