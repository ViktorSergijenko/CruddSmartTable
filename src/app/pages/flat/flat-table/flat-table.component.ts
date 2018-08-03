import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { FlatService } from '../flat.service';
import { HouseService } from '../../house/house.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Flat } from '../flat.model';
import { NgForm } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import { House } from '../../house/house.model';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-flat-table',
  templateUrl: './flat-table.component.html',
  styleUrls: ['./flat-table.component.scss'],
})
export class FlatTableComponent implements OnInit {
  /**
   * Variable that will contain one of Id's of an house,that will come with params from route.
   * @type {number}
   * @memberof FlatTableComponent
   */
  specifichouseId: any = null;
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
  /**
   * Array that can contain array of flat objects.
   * @type {Flat[]}
   * @memberof FlatTableComponent
   */
  flatList: Flat[];
  /**
   * Variable with type 'House' that can contain one house object.
   * @type {House}
   * @memberof FlatTableComponent
   */
  selectedHouse: House;
  /**
   * Property(variable) that contains information about amount of flats in table.
   * @type {number}
   * @memberof FlatTableComponent
   */
  totalFlatsInTable: number;
  flatThatWeWantToChange;
  /**
   * Variable that contains information about amount of flats in additional house.
   * @type {number}
   * @memberof FlatTableComponent
   */
  totalFlatsInAdditionalHouse: number;
  /**
   * Variable that responds for Registration form visability.
   * @type {number}
   * @memberof FlatTableComponent
   */
  flatRegFormVisible: boolean;
  /**
   * Variable that responds for Edit form visability.
   * @type {boolean}
   * @memberof FlatTableComponent
   */
  flatEditFormVisible: boolean;
  /**
   * Array that will contain a list of flat Objects.
   * @type {Flat[]}
   * @memberof FlatTableComponent
   */
  sourtedFlatList: Flat[];
  /**
   * Ng2 Smart Table settings.
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
      totalArea: {
        title: 'Total Area',
        type: 'number',
      },
      livingSpace: {
        title: 'Living Space',
        type: 'number',
      },
      residentAmount: {
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
   * Creates an instance of FlatTableComponent
   * @param {FlatService} flatService - Includes all variables and functions to make crud requests on server
   * @param {HouseService} houseService - Includes all variables and functions to make crud requests on server
   * @param {Location} location - Location functions
   * @param {ActivatedRoute} route Route params
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
  }
  ngOnInit() {

    this.gettinghouseIdFromRoute(); // First we get a house id,to ensure that we will load exactly those flats that we want to load
    // Also there's cases when there can be no house id in our Route
    // If we dont have house id
    this.loadAllFlatsInTableAndCountThem(); // Then we will load all flats in to our table.
    // If we have house id
    this.loadAdditionalHouseFlatsAndCountThem(); // Then we will load only those flats,that are located ...
    // In house that id is equal to "specifichouseId" value

  }

  /**
   * Function gets specific House id value.
   * @memberof FlatTableComponent
   */
  gettinghouseIdFromRoute() {
    // Getting a route param from our routing.
    this.specifichouseId = this.route.snapshot.paramMap.get('id');
    console.log('Checking my specifichouseId' + this.specifichouseId);
    this.selectedFlat = new Flat(this.specifichouseId); // Using specifichouseId variable in Flat object constructor.
    console.log('Checking my selectedFlat' + <Flat>this.selectedFlat);
    this.sourtedFlatList = []; // To avoid problems with table loading, we clear all that could be in our sourtedFlatList array
    // });
  }
  /**
   * Function will load all existing flats to our table,and count their amount.
   * @memberof FlatTableComponent
   */
  loadAllFlatsInTableAndCountThem() {
    if (!this.specifichouseId || this.specifichouseId === 'all') {
      // Getting all flats from server.
      this.flatService.getFlatList().subscribe(flats => {
        this.flatList = flats; // Putting this flats in to flatList array
        this.source.load(this.flatList); // Loading this flats in to our table
        this.totalFlatsInTable = this.source.count(); // Counting amount of flats that was laoded in to our table
      });
    }
  }
  /**
   * Function will load to our table only those flats, that are located in additional house,and count their amount
   * @memberof FlatTableComponent
   */
  loadAdditionalHouseFlatsAndCountThem() {
    this.flatService.getFlatsWihtHouse(this.specifichouseId).subscribe(houseAndFlats => {
      this.selectedHouse = houseAndFlats[0];
      this.source.load(this.selectedHouse.flats);
      this.totalFlatsInAdditionalHouse = this.source.count();
      console.log(this.selectedHouse);
    }, (err) => {
      this.errorFromServer = err.text(); // Putting an error message to our local variable.
      this.toasterService.popAsync('error', 'Custom error in component', this.errorFromServer); // Will make a Toastr message with text error.
    });
  }

  /**
  * Function deletes a flat from table
  * @param {*} event  event- Ng2 Smart table event object which contains row data
  * @memberof FlatTableComponent
  */
  deleteFlatFromTable(event): void {
    this.flatService.deleteFlat(event).subscribe(res => {
      this.source.remove(event.data); // This function removes a deleted object from our table.
      if (this.specifichouseId) { // If we have a value in specifichouseId variable,then it will count amount of flats in additional house...
        // Because if our specifichouseId variable is not null,then our table has loaded flats from additional house
        // That has id equal to specifichouseId value.
        this.flatService.getFlatAmountInOneHouse(this.specifichouseId).subscribe(Amount => {
          this.totalFlatsInAdditionalHouse = Amount;
        });
        // If our table has loaded all flats that exists,then it will count all flat amount in database
      } else {
        this.flatService.getAllFlatAmount().subscribe(Amount => {
          this.totalFlatsInTable = Amount;
        });
      }
    });
  }
  /**
   * Function opens a Flat registration form
   * @memberof FlatTableComponent
   */
  openFlatRegistrationForm(): void {
    // If user will click on 'Plus' button it will open registration form.
    this.flatRegFormVisible = true; // If flatRegFormVisible value is true, then Registration form will be shown
  }
  /**
  * Function opens a Flat edit form
  * @param {*} event event- Ng2 Smart table event object which contains row data
  * @memberof FlatTableComponent
  */
  openFlatEditForm(event): void {
    this.flatThatWeWantToChange = event;
    this.selectedFlat = Object.assign({}, event.data); // This will send all values that has our object that we want to edit to our form
    this.flatEditFormVisible = true; // If flatEditForm value is not false, then Edit form will be shown
  }
  /**
   * Method navigates on previous page,  
   * can be used on buttons.
   * @memberof FlatTableComponent
   */
  goOnPreviousPage(): void {
    this.location.back();
  }


  /**
   * This function is used on a button,when we will press button,it will,  
   * send uss on a House table page, where we will be able to see all houses that exists
   * @memberof FlatTableComponent
   */
  getFullList(): void {
    this.router.navigate(['/pages/flat/flat-table'],
    );
  }
  /**
   * Function resets all form values(edit and registration)
   * to a default values.
   * @param {NgForm} [form] form - Form that we want to reset
   * @memberof FlatTableComponent
   */
  resetForm(form?: NgForm) {
    if (form !== null) {
      form.reset();
      this.selectedFlat = new Flat(this.specifichouseId);
    }
  }
  /**
   * Clicking on submit will prevent action that adds, or edits a House Object,  
   * depends in what form you are using it
   * @param {NgForm} form form-paramater that will be our form that we use
   * @memberof FlatTableComponent
   */
  onSubmit(form: NgForm) {
    if (!form.value.id) {
      this.addRequestFunctionInForm(form);
    } else {
      this.editRequestFunctionInForm(form);
    }
  }
  /**
   * Clicking on submit button in Registration form, function adds a new house
   * @param {NgForm} form form values
   * @memberof FlatTableComponent
   */
  addRequestFunctionInForm(form: NgForm) {
    this.flatService.addFlat(form.value).subscribe(newFlat => {
      this.source.prepend(newFlat); // Function that addes a new object in to the table.
      this.toasterService.popAsync('success', 'Flat was added'); // Will make a Toastr message.
      this.resetForm(form); // Resets a form values to default.
      this.flatService.getFlatAmountInOneHouse(this.specifichouseId).subscribe(flatAmountInOneHouse => {
        this.totalFlatsInAdditionalHouse = flatAmountInOneHouse;
      });
    },
      (err) => {
        this.errorFromServer = err.text(); // Putting an error message to our local variable.
        this.toasterService.popAsync('error', 'Custom error in component', this.errorFromServer); // Will make a Toastr message with text error.
      },
    );
  }
  /**
   * Clicking on submit button in Edit form, function edits a house object
   * @param {NgForm} form Form values.
   * @memberof FlatTableComponent
   */
  editRequestFunctionInForm(form: NgForm) {
    this.flatService.editFlat(form.value.id, form.value)
      .subscribe(editedFlat => { // Returning a edited flat
        this.source.update(this.flatThatWeWantToChange.data, editedFlat); // Updating our edited object in our table
        this.resetForm(form); // Reseting our form.
        this.toasterService.popAsync('Record updated', 'Flat info was changed'); // Toastr ensure user with a message taht object was edited
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
   * @param {NgForm} [form] form-Form that we are using
   * @memberof FlatTableComponent
   */
  closeFlatRegistrationOrEditForm(form: NgForm): void {
    // If flatEditFormVisible has no value,then Edit form is invisible
    this.flatEditFormVisible = false;
    // If flatRegFormVisible has no value,then Registration form is invisible
    this.flatRegFormVisible = false;
    // When we close our form,we need to make sure that we will open it next time
    this.resetForm(form);
    // It will be clear,and wont have previous values.
  }
}

