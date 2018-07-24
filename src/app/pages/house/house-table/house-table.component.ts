import 'style-loader!angular2-toaster/toaster.css';

import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { HouseService } from '../house.service';
import { Http } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { House } from '../house.model';
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
export class HouseTableComponent implements OnInit {

  /**
   * @property {errorFromServer} - variable that contains an error text.
   * @type {string}
   * @memberof HouseTableComponent
   */
  errorFromServer: string;
  houseThatWeWantToChange;
  totalAmountOfHosesInTable: number;
  selectedHouse: House;
  registrationHouseForm: number;
  editHouseForm: number;

  /**
   * Settings is a ng2 smart table property where we can set all needed setings for our table(columns names,actions.....)
   * @memberof HouseTableComponent
   */
  settings = {
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
      postIndex: {
        title: 'P.Index',
        type: 'string',
      },
      flatamount: {
        editable: false,
        addable: false,
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
  source: LocalDataSource = new LocalDataSource();
  /**
   * Creates an instance of HouseTableComponent,sets Registration form and Edit form invisible and creates a new House Object,
   * Then constructor sends a get request to the server,loads all objects that we get in to our table and counts it amount.
   * @param {HouseService} houseService - Includes all variables and functions to make crud requests on server.
   * @param {Http} http HTTP requests.
   * @param {Router} router Routes.
   * @param {ActivatedRoute} route  Route.
   * @param {ProcessHttpMsgService} errorHandler - Service that handles with errors.
   * @param {ToasterService} toasterService - Toastr.
   * @memberof HouseTableComponent
   */
  constructor(
    private houseService: HouseService,
    private http: Http,
    private router: Router,
    private route: ActivatedRoute,
    private errorHandler: ProcessHttpMsgService,
    private toasterService: ToasterService,
  ) {
    this.registrationHouseForm = null;
    this.editHouseForm = null;
    this.selectedHouse = new House();
  }
  ngOnInit() {
    this.houseService.getHouseList().subscribe(Houses => {
      this.source.load(Houses.json());
      this.totalAmountOfHosesInTable = this.source.count();
    });
  }
  /**
   * This function will call "deleteResident" function that will make a delete request.
   * @param {*} event - event-Object,in our case it is House object
   * @memberof HouseTableComponent
   */
  onDeleteConfirm(event): void {
    this.houseService.deleteHouse(event).subscribe(delHouse => {
      this.source.remove(event.data);
      this.totalAmountOfHosesInTable = this.source.count();
    });
  }
  /**
   * If user will click on 'Plus' button it will open registration form
   * @memberof HouseTableComponent
   */
  onCreateConfirm(): void {
    this.registrationHouseForm = 1; // if RegistrationHouseForm value is not 0, then it will be shown
  }
  /**
  * If user will click on 'pencil' button, it will open edit form
  * @param {*} event event- House Object
  * @memberof HouseTableComponent
  */
  onSaveConfirm(event): void {
    this.houseThatWeWantToChange = event;
    this.selectedHouse = Object.assign({}, event.data); // this will send all values that has our object that we want to edit to our form
    this.editHouseForm = 1; // if EditHouseForm value is not 0, then it will be shown
  }
  /**
   * Give us posability to click on a row
   * as a result it will give us all values of this row as an event
   * @param {*} event event- in our case it is a click event on a row
   * @memberof HouseTableComponent
   */
  onUserRowSelect(event) {
    this.router.navigate(['/pages/flat/flat-table/' + event.data.id], { relativeTo: this.route });
  }

  /**
   * Function will close registration or edit form in resident table
   * Used on button in forms
   * @param {NgForm} [form] form-this property will say on what form will be used this function
   * @memberof HouseTableComponent
   */
  onClose(form?: NgForm): void {
    this.resetForm(form);
    this.registrationHouseForm = null;
    this.editHouseForm = null;
  }

  /**
   * Function will reset our object values un form
   * @param {NgForm} [form] form-this property will say on what form will be used this function
   * @memberof HouseTableComponent
   */
  resetForm(form?: NgForm) {
    // tslint:disable-next-line:curly
    if (form != null)
      form.reset();
    this.selectedHouse = new House();
  }
  /**
   * In Registration form,when we will click submit button,function will send a post request to the server,
   * same in Edit form,but instead of post request it will send put request.
   * @param {NgForm} form form - paramater that will be our form that we use
   * @memberof HouseTableComponent
   */
  onSubmit(form: NgForm) {
    if (!form.value.id) {
      this.postRequestFunctionInForm(form);
    } else {
      this.putRequestFunctionInForm(form);
    }
  }
  /**
   * This function will send a put request to the server, if request was successfull,  it will
   * update object values in table and then resets edit form values to default,if request was unsuccessfull,then
   * user will receive an error message. 
   * @param {NgForm} form
   * @memberof HouseTableComponent
   */
  putRequestFunctionInForm(form: NgForm) {
    this.houseService.putHouse(form.value.id, form.value)
      .subscribe(editedHouse => {
        this.source.update(this.houseThatWeWantToChange.data, editedHouse);
        this.resetForm(form);
        this.toasterService.popAsync('Record updated', 'House info was changed');
      }, (err) => {
        this.errorFromServer = err.text();
        this.toasterService.popAsync('error', 'Custom error in component', this.errorFromServer);
      },
    );
  }
  /**
   * This function will send a post request to the server, if request was successfull,  it will
   * add a new object to the table and then resets edit form values to default,if request was unsuccessfull,then
   * user will receive an error message. 
   * @param {NgForm} form
   * @memberof HouseTableComponent
   */
  postRequestFunctionInForm(form: NgForm) {
    this.houseService.postHouse(form.value).subscribe(newHouse => {
      this.source.prepend(newHouse);
      this.resetForm(form);
      this.totalAmountOfHosesInTable = this.source.count();
      this.toasterService.popAsync('success', 'House was added');
    }, (err) => {
      this.errorFromServer = err.text();
      this.toasterService.popAsync('error', 'Custom error in component', this.errorFromServer);
    },
    );
  }
}


