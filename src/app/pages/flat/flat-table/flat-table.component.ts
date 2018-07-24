import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { FlatService } from '../flat.service';
import { HouseService } from '../../house/house.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Flat } from '../flat.model';
import { NgForm } from '@angular/forms';
import { ToasterService } from '../../../../../node_modules/angular2-toaster';
import { House } from '../../house/house.model';
@Component({
  selector: 'app-flat-table',
  templateUrl: './flat-table.component.html',
  styles: [`
  nb-card {
    transform: translate3d(0, 0, 0);
  }
`],
})
export class FlatTableComponent implements OnInit {
  /**
   * Variable that will contain one of Id's of an house,that will come with params from route.
   * @type {number}
   * @memberof FlatTableComponent
   */
  additionalHouseId: any = null;
  /**
   * Variable that contains an error text.
   * @type {string}
   * @memberof FlatTableComponent
   */
  errorFromServer: string = null;
  /**
   * Variable that will contain a Flat object that we want to change.
   * @memberof FlatTableComponent
   */
  selectedFlat: Flat;
  flatList: Flat[];
  selectedHouse: House;
  totalFlatsInTable: number;
  flatThatWeWantToChange;
  totalFlatsInAdditionalHouse: number;
  flatRegForm: number;
  flatEditForm: number;
  /**
   * Settings is a ng2 smart table property where we can set all needed setings for our table(columns names,actions.....)
   * @memberof FlatTableComponent
   */
  settings = {
    mode: 'external',
    noDataMessage: 'Sorry, but there is no Flats in this house,if you want to watch all Flats,Press GET FULL LIST button ',
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
      floor: {
        title: 'Floor',
        type: 'number',
      },
      number: {
        title: 'Flat Number',
        type: 'number',
      },
      totalarea: {
        title: 'Total Area',
        type: 'number',
      },
      livingspace: {
        title: 'Living Space',
        type: 'number',
      },
      residentamount: {
        editable: false,
        addable: false,
        title: 'Resident Amount',
        type: 'number',
      },
      actions:
      {
        addable: false,
        editable: false,
        title: 'Details',
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return `<a title ="See Detail House" href="#/pages/resident/resident-table/${row.id}"><i class=""material-icons">Details</i></a>`;
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
   *Creates an instance of FlatTableComponent.
   * @param {FlatService} flatService - Includes all variables and functions to make crud requests on server
   * @param {HouseService} houseService - Includes all variables and functions to make crud requests on server
   * @param {Location} location - Location functions.
   * @param {ActivatedRoute} route Route params.
   * @param {Router} router - Route
   * @param {ToasterService} toasterService - Toastr
   * @memberof FlatTableComponent
   */
  constructor(
    private flatService: FlatService,
    private houseService: HouseService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private toasterService: ToasterService,
  ) {
    this.flatEditForm = null; // Using this in constructor,to make Edit form Invisible at the beggining.
    this.flatRegForm = null; // Using this in constructor,to make Registration form Invisible at the beggining.
  }
  ngOnInit() {
    this.gettingHouseIdFromRoute(); // First we get a house id,to ensure that we will load exactly those flats that we want to load.
    // Also there's cases when there can be no house id in our Route.
    if (!this.additionalHouseId || this.additionalHouseId === 'all') { // If we dont have house id.
      this.resetTheFuckingForm(); // We will reset form,to avoid problems with our form values.
      this.loadAllFlatsInTableAndCountThem(); // Then we will load all flats in to our table.
    } else { // If we have house id.
      this.resetTheFuckingForm(); // We will reset form,to avoid problems with our form values.
      this.loadAdditionalHouseFlatsAndCountThem(); // Then we will load only those flats,that are located ...
      // In house that id is equal to "additionalHouseId" value.
    }
  }

  /**
   * Function gets House id value.
   * @memberof FlatTableComponent
   */
  gettingHouseIdFromRoute() {
    // Getting a route param from our routing.
    this.route.params.subscribe((params: any) => {
      this.additionalHouseId = params.id; // Putting this route param in to our locate variable "additionalHouseId".
      this.selectedFlat = new Flat(this.additionalHouseId); // Using additionalHouseId variable in Flat object constructor.
      this.houseService.sourtedFlatList = []; // To avoid problems with table loading, we clear all that could be in our sourtedFlatList array.
    });
  }
  /**
   * Function will load all existing flats to our table,and count their amount.
   * @memberof FlatTableComponent
   */
  loadAllFlatsInTableAndCountThem() {
    // Getting all flats from server.
    this.flatService.getFlatList().subscribe(flats => {
      this.flatList = flats.json(); // Putting this flats in to flatList array.
      this.source.load(this.flatList); // Loading this flats in to our table.
      this.totalFlatsInTable = this.source.count(); // Counting amount of flats that was laoded in to our table.
      this.selectedHouse = null; // So,because we have loaded all flats,then we dont need house info.
      // House information is used only in those cases,when we are loading flats from additional house.
    });
  }
  /**
   * Function will load to our table only those flats, that are located in additional house,and count their amount.
   * @memberof FlatTableComponent
   */
  loadAdditionalHouseFlatsAndCountThem() {
    // Getting flats that are located in house, that has id equal to "additionalHouseId".
    this.houseService.getHouseFlats(this.additionalHouseId).subscribe(additionalFlats => {
      this.houseService.sourtedFlatList = additionalFlats.json(); // Putting them in to a sourtedFlatList array.
      this.source.load(this.houseService.sourtedFlatList); // Loading this flats to our table.
      this.totalFlatsInAdditionalHouse = this.source.count(); // Counting amount of loaded flats.
      this.houseService.getOneHouse(this.additionalHouseId).subscribe(house => { // Getting Info about house, where our falts are located.
        this.selectedHouse = house.json(); // Putting our house info in to selectedHouse variable.
      });
    });
  }

  /**
  * This function will call "deleteResident" function that will make a delete request.
  * @param {*} event - event-Object,in our case it is Flat object
  * @memberof FlatTableComponent
  */
  onDeleteConfirm(event): void {
    this.flatService.deleteFlat(event).subscribe(res => {
      this.source.remove(event.data); // This function removes a deleted object from our table.
      if (this.additionalHouseId) { // If we have a value in additionalHouseId variable,then it will count amount of flats in additional house...
        // Because if our additionalHouseId variable is not null,then our table has loaded flats from additional house
        // That has id equal to additionalHouseId value.
        this.flatService.getFlatAmountInOneHouse(this.additionalHouseId).subscribe(Amount => {
          this.totalFlatsInAdditionalHouse = Amount.json();
        });
        // If our table has loaded all flats that exists,then it will count all flat amount in database.
      } else {
        this.flatService.getAllFlatAmount().subscribe(Amount => {
          this.totalFlatsInTable = Amount.json();
        });
      }
    });
  }
  /**
   * If user will click on 'Plus' button it will open registration form.
   * @memberof FlatTableComponent
   */
  onCreateConfirm(): void {
    this.flatRegForm = 1; // if flatRegForm value is not 0, then Registration form will be shown.
  }
  /**
  * If user will click on 'pencil' button, it will open edit form.
  * @param {*} event event-Flat Object,
  * @memberof FlatTableComponent
  */
  onSaveConfirm(event): void {
    this.flatThatWeWantToChange = event;
    this.selectedFlat = Object.assign({}, event.data); // This will send all values that has our object that we want to edit to our form
    this.flatEditForm = 1; // If flatEditForm value is not 0, then Edit form will be shown.
  }
  /**
   * Function will be use on button,when we will click on button,
   * function will send uss on previous page.
   * @memberof FlatTableComponent
   */
  goBack(): void {
    this.location.back();
  }
  /**
   * Give us posability to click on a row
   * as a result it will give us all values of this row as an event
   * and after that it will route uss to '/pages/resident/resident-table/ id'
   * @param {*} event event- in our case it is a click event on a row
   * @memberof FlatTableComponent
   */
  onUserRowSelect(event) {
    console.log('user row select: ', event.data.id);
    this.router.navigate(['/pages/resident/resident-table/' + event.data.id], { relativeTo: this.route });
  }
  /**
   * This function is used on a button,when we will press button,it will
   * send uss on a House table page, where we will be able to see all houses that exists.
   * @memberof FlatTableComponent
   */
  getFullList(): void {
    this.router.navigate(['/pages/flat/flat-table'],
    );
  }
  /**
   * Function resets all form values(edit and registration)
   * to a default values.
   * @param {NgForm} [form] form - Form that we want to reset.
   * @memberof FlatTableComponent
   */
  resetTheFuckingForm(form?: NgForm) {
    this.selectedFlat = new Flat(this.additionalHouseId);
  }
  /**
   * In Registration form,when we will click submit button,function will send a post request to the server,
   * same in Edit form,but instead of post request it will send put request.
   * @param {NgForm} form form-paramater that will be our form that we use.
   * @memberof FlatTableComponent
   */
  onSubmit(form: NgForm) {
    if (!form.value.id) {
      this.postRequestFunctionInForm(form);
    } else {
      this.putRequestFunctionInForm(form);
    }
  }
  /**
   * This function will send a post request to the server, if request was successfull,  it will
   * add a new object to the table and then resets edit form values to default,if request was unsuccessfull,then
   * user will receive an error message. 
   * @param {NgForm} form form values
   * @memberof FlatTableComponent
   */
  postRequestFunctionInForm(form: NgForm) {
    this.flatService.postFlat(form.value).subscribe(newFlat => {
      this.source.prepend(newFlat); // Function that addes a new object in to the table.
      this.toasterService.popAsync('success', 'Flat was added'); // Will make a Toastr message.
      this.resetTheFuckingForm(form); // Resets a form values to default.
      this.flatService.getFlatAmountInOneHouse(this.additionalHouseId).subscribe(flatAmountInOneHouse => {
        this.totalFlatsInAdditionalHouse = flatAmountInOneHouse.json();
      });
    },
      (err) => {
        this.errorFromServer = err.text(); // Putting an error message to our local variable.
        this.toasterService.popAsync('error', 'Custom error in component', this.errorFromServer); // Will make a Toastr message with text error.
      },
    );
  }
  /**
   * This function will send a put request to the server, if request was successfull,  it will
   * update object values in table and then resets edit form values to default,if request was unsuccessfull,then
   * user will receive an error message. 
   * @param {NgForm} form
   * @memberof FlatTableComponent
   */
  putRequestFunctionInForm(form: NgForm) {
    this.flatService.putFlat(form.value.id, form.value)
      .subscribe(editedFlat => { // Returning a edited flat.
        this.source.update(this.flatThatWeWantToChange.data, editedFlat); // Updating our edited object in our table.
        this.resetTheFuckingForm(form); // Reseting our form.
        this.toasterService.popAsync('Record updated', 'Flat info was changed'); // Toastr ensure user with a message taht object was edited.
      },
        (err) => { // If put request was unsuccesssfull, then we will have an error message from server
          this.errorFromServer = err.text(); // Putting this error message to our local variable "errorFromServer"
          // Toastr will ensure user with an message with an error text that is stored in our variable "errorFromServer"
          this.toasterService.popAsync('error', 'Custom error in component', this.errorFromServer);
        });
  }
  /**
   * Function will close registration or edit form in house table,
   * Used on button in forms
   * @param {NgForm} [form] form-Form that we are using.
   * @memberof FlatTableComponent
   */
  onClose(form: NgForm): void {
    this.flatEditForm = null; // If flatEditForm has no value,then Edit form is invisible.
    this.flatRegForm = null; // If flatRegForm has no value,then Registration form is invisible.
    this.resetTheFuckingForm(form); // When we close our form,we need to make sure that we will open it next time
    // It will be clear,and wont have previous values.
  }
}

