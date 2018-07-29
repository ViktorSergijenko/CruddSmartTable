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
  styleUrls: ['../house.component.scss'],
})
export class HouseTableComponent implements OnInit {

  /**
   * @property {errorFromServer} - variable that will contain an error text.
   * @type {string}
   * @memberof HouseTableComponent
   */
  errorFromServer: string;

  /**
   * Variable contains a flat object that we want to edit.
   * @type {Flat}
   * @memberof HouseTableComponent
   */
  houseThatWeWantToChange;
  /**
   * Variable that will contain a numeric value that will be our amoint of houses.
   * @type {number}
   * @memberof HouseTableComponent
   */
  totalAmountOfHosesInTable: number;
  /**
   * Variable will contain a House object that user will select
   * @type {House}
   * @memberof HouseTableComponent
   */
  selectedHouse: House;
  /**
   * Variable that responds for visability of our registration form.
   * @type {boolean}
   * @memberof HouseTableComponent
   */
  registrationHouseFormVisible: boolean;
  /**
   * Variable that responds for visability of our edit form.
   * @type {boolean}
   * @memberof HouseTableComponent
   */
  editHouseFormVisible: boolean;

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
   * Creates an instance of HouseTableComponent new House Object,
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
    this.selectedHouse = new House();
  }

  ngOnInit() {
    // Getting all houses from server and loading them in to the table and count their amount.
    this.houseService.getHouseList().subscribe(Houses => {
      this.source.load(Houses);
      this.totalAmountOfHosesInTable = this.source.count();
    });
  }
  /**
   * This function will delete a house Object.
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
    this.registrationHouseFormVisible = true; // if RegistrationHouseForm value is false, then it will be shown
  }
  /**
  * If user will click on 'pencil' button, it will open edit form
  * @param {*} event event- House Object
  * @memberof HouseTableComponent
  */
  onSaveConfirm(event): void {
    this.houseThatWeWantToChange = event.data;
    this.selectedHouse = Object.assign({}, event.data); // this will send all values that has our object that we want to edit to our form
    this.editHouseFormVisible = true; // if EditHouseForm value is not 0, then it will be shown
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
    this.registrationHouseFormVisible = false;
    this.editHouseFormVisible = false;
  }

  /**
   * Function will reset our object values in form.
   * @param {NgForm} [form] Form-this property will say on what form will be used this function.
   * @memberof HouseTableComponent
   */
  resetForm(form?: NgForm) {
    if (form != null)
      form.reset();
    this.selectedHouse = new House();
  }
  /**
   * Clicking on submit will prevent action that adds, or edits a House Object,
   * depends in what form you are using it.
   * @param {NgForm} form form - paramater that will be our form that we use
   * @memberof HouseTableComponent
   */
  onSubmit(form: NgForm) {
    if (form.value.id) {
      this.addRequestFunctionInForm(form);
    } else {
      this.editRequestFunctionInForm(form);
    }

  }
  /**
   * Clicking on submit button in Registration form, this function will edit a house object.
   * @param {NgForm} form Form values.
   * @memberof HouseTableComponent
   */
  editRequestFunctionInForm(form: NgForm) {
    if (form.value.id) {
      this.houseService.editHouse(form.value.id, form.value)
        .subscribe(editedHouse => { // Sending a put request to edit a house values in server.
          this.source.update(this.houseThatWeWantToChange.data, editedHouse); // Modifying our  house object values in table.
          this.resetForm(form); // Reseting form values
          this.toasterService.popAsync('Record updated', 'House info was changed');
        }, (err) => { // If we reaceave an error from server
          this.errorFromServer = err.text(); // We will put a message from error to our local variable 'errorFromServer'
          // And toastr will notify user with this error message
          this.toasterService.popAsync('error', 'Custom error in component', this.errorFromServer);
        },
      );
    } else {
      return null;
    }
  }
  /**
   * Clicking on submit button in Edit form,this function will add a new house.
   * @param {NgForm} form Form values.
   * @memberof HouseTableComponent
   */
  addRequestFunctionInForm(form: NgForm) {
    if (!form.value.id) {
      this.houseService.addHouse(form.value).subscribe(newHouse => { // Sending a post request to add a new house in server
        this.source.prepend(newHouse); // Adding new house in our table
        this.resetForm(form); // Reseting form values
        this.totalAmountOfHosesInTable = this.source.count(); // Counting amount of houses in our table.
        this.toasterService.popAsync('success', 'House was added'); // If house was successfully added,then user will reaceave a toastr message
      }, (err) => { // If we reaceave an error from server
        this.errorFromServer = err.text(); // We will put a message from error to our local variable 'errorFromServer'
        // And toastr will notify user with this error message
        this.toasterService.popAsync('error', 'Custom error in component', this.errorFromServer);
      },
      );
    } else {
      return null;
    }

  }
}


