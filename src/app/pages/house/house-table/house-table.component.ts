import 'style-loader!angular2-toaster/toaster.css';

import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { HouseService } from '../house.service';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { House } from '../house.model';
import { Observable } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProcessHttpMsgService } from '../../../process-httpmsg.service';
import { ToasterService } from '../../../../../node_modules/angular2-toaster';


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

  myError: string;
  settings = { // setting of our smart table (buttons,columns,names......)
    mode: 'external',
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      create: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: false,
    },
    columns: {
      street: {
        title: 'Street Name',
        type: 'string',
      },
      number: {
        title: 'House Number',
        type: 'number',
      },
      floors: {
        title: 'Floors',
        type: 'number',
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
        editable: false, // dont have posability to edit this column
        addable: false, // dont have posability to ad values in this column
        title: 'Flat Amount',
        type: 'Flat',
      },
      actions:
      {
        addable: false,
        editable: false,
        title: 'Details',
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return `<a title ="See Detail House" href="#/pages/flat/flat-table/${row.id}"><i class=""material-icons">Details</i></a>`;
        },
        id: {
          title: 'ID',
          type: 'number',
        },
      },
    },
  };
  source: LocalDataSource = new LocalDataSource(); // ng2 smart table functionality
  // our constructor calles getHouseList() function to send a request to our server to get all existing houses in database
  // then all this returned values(House objects) will be placed in houseList(array that can contain only house objects)
  // from HouseService,and after that...
  // function load() from LocalDataSource class will load all this data to our smart table
  // when objects will be loaded in to the table,function count will count how many houses are in table
  constructor(
    public houseService: HouseService,
    private http: Http,
    private router: Router,
    private route: ActivatedRoute,
    private errorHandler: ProcessHttpMsgService,
    private toasterService: ToasterService,
  ) {
    this.houseService.RegistrationHouseForm = null;
    this.houseService.EditHouseForm = null;
    this.houseService.selectedHouse = new House();
    this.houseService.getHouseList().subscribe(resp => {
      console.log(resp.json());
      this.houseService.houseList = resp.json();
      this.source.load(this.houseService.houseList);
      this.houseService.TotalAmountOfHosesInTable = this.source.count();
    });
  }
  /**
   * If user will click on 'Plus' button it will open registration form
   * then this function will call "deleteResident" fucntion that will make a delete request
   * @param {*} event - event-Object, consist of:
   * data: Object - original row data
   * newData: Object - edited data
   * source: DataSource - table data source
   * confirm: Deferred - Deferred object with resolve(newData: Object) and reject() methods
   * @memberof HouseTableComponent HouseTableComponent - Have all setting of our resident smart table
   */
  onDeleteConfirm(event): void {
    this.houseService.deleteHouse(event).subscribe(res => {
      console.log(res);
      this.source.remove(event.data);
      this.houseService.TotalAmountOfHosesInTable = this.source.count();
    });
  }
  /**
   * If user will click on 'Plus' button it will open registration form
   * @param {*} event event-Object, consist of:
   * data: Object - original row data
   * newData: Object - edited data
   * source: DataSource - table data source
   * confirm: Deferred - Deferred object with resolve(newData: Object) and reject() methods
   * @memberof HouseTableComponent HouseTableComponent - Have all setting of our resident smart table
   */
  onCreateConfirm(): void {
    this.houseService.RegistrationHouseForm = 1; // if RegistrationHouseForm value is not 0, then it will be shown
    console.log('HEYHEY');
  }
  /**
  * If user will click on 'pencil' button, it will open edit form
  * @param {*} event event-Object, consist of:
  * data: Object - original row data
  * newData: Object - edited data
  * source: DataSource - table data source
  * confirm: Deferred - Deferred object with resolve(newData: Object) and reject() methods
  * @memberof HouseTableComponent HouseTableComponent - Have all setting of our resident smart table
  */
  onSaveConfirm(event): void {
    console.log('asdsadsad');
    console.log(event.data);
    this.houseService.selectedHouse = Object.assign({}, event.data); // this will send all values that has our object that we want to edit to our form
    this.houseService.EditHouseForm = 1; // if EditHouseForm value is not 0, then it will be shown
  }
  /**
   * give us posability to click on a row
   * as a result it will give us all values of this row as an event
   * @param {*} event event- in our case it is a click event on a row
   * @memberof HouseTableComponent HouseTableComponent - Have all setting of our resident smart table
   */
  onUserRowSelect(event) {
    console.log('user row select: ', event.data.id);
    this.router.navigate(['/pages/flat/flat-table/' + event.data.id], { relativeTo: this.route });
  }

  /**
   * Function will close registration or edit form in resident table
   * Used on button in forms
   * @param {NgForm} [form] form-this property will say on what form will be used this function
   * @memberof HouseTableComponent HouseTableComponent - Have all setting of our resident smart table
   */
  onClose(form?: NgForm): void {
    this.resetForm(form);
    this.houseService.RegistrationHouseForm = null;
    this.houseService.EditHouseForm = null;
  }

  /**
   * Function will reset our object values un form
   * @param {NgForm} [form] form-this property will say on what form will be used this function
   * @memberof HouseTableComponent HouseTableComponent - Have all setting of our resident smart table
   */
  resetForm(form?: NgForm) {
    // tslint:disable-next-line:curly
    if (form != null)
      form.reset();
    this.houseService.selectedHouse = {
      id: null,
      street: '',
      number: null,
      floors: null,
      flatamount: 0,
      city: '',
      country: '',
      postindex: '',
      flats: null,
    };
  }
  /**
   * Function is used on button submit in registration or edit form,if in form our object id is null
   * then when user will click in submit button it will send a post request to server, to create a new object in database,if server
   * will return an error then user will see the message error that will ensure him what did he do wrong.
   * If our object in form has id,then when user will click submit button it will send a put request to our server, to
   * change our object values in database to a new one,if server
   * will return an error then user will see the message error that will ensure him what did he do wrong.
   * @param {NgForm} form form - paramater that will be our form that we use
   * @memberof HouseTableComponent HouseTableComponent - Have all setting of our resident smart table
   */
  onSubmit(form: NgForm) {
    if (!form.value.id) {
      this.houseService.postHouse(form.value).subscribe(data => {
        this.source.prepend(form.value);
        this.resetForm(form);
        this.houseService.TotalAmountOfHosesInTable = this.source.count();
        // this.toasterService.('New Record Added', 'House registered');
        this.toasterService.popAsync('success', 'House was added');
      }, (err) => {
        this.myError = <any>err; // .json();
        console.log('this is my errorito: ' + err.text());
        this.myError = err.text();
        console.log('myerrorito' + this.myError);
        this.toasterService.popAsync('error', 'Custom error in component', this.myError);
      },
      );
    } else {
      this.houseService.putHouse(form.value.id, form.value)
        .subscribe(data => {
          this.source.update(event, form.value);
          this.resetForm(form);
          this.toasterService.popAsync('Record updated', 'House info was changed');
        }, (err) => {
          this.myError = <any>err; // .json();
          console.log('this is my errorito: ' + err.text());
          this.myError = err.text();
          console.log('myerrorito' + this.myError);
          this.toasterService.popAsync('error', 'Custom error in component', this.myError);
        },
      );
    }
  }
}

