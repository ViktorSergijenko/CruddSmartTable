import 'style-loader!angular2-toaster/toaster.css';

import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { HouseService } from '../house.service';
import { NgForm } from '@angular/forms';
import { House } from '../house.model';
import { ToasterService } from 'angular2-toaster';
import { NbSpinnerService } from '@nebular/theme/services/spinner.service';






@Component({
  selector: 'app-house-table',
  templateUrl: './house-table.component.html',
  styleUrls: ['../house.component.scss'],
})
export class HouseTableComponent implements OnInit {
  /**
   * Error string that came from server
   *
   * @type {string}
   * @memberof HouseTableComponent
   */
  errorFromServer: string;

  /**
   * Variable contains a flat object that we want to edit
   * @memberof HouseTableComponent
   */
  houseThatWeWantToChange: any;
  /**
   * Variable that will contain a numeric value that will be our amoint of houses
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
   * Variable that responds for visability of our registration form
   * @type {boolean}
   * @memberof HouseTableComponent
   */
  registrationHouseFormVisible: boolean;
  /**
   * Variable that responds for visability of our edit form
   * @type {boolean}
   * @memberof HouseTableComponent
   */
  editHouseFormVisible: boolean;
  /**
   * Holds the string typed by the user in country input
   *
   * @memberof HouseTableComponent
   */
  query = '';
  countries = [
    'Albania', 'Andorra', 'Armenia', 'Austria', 'Azerbaijan', 'Belarus',

    'Belgium', 'Bosnia & Herzegovina', 'Bulgaria', 'Croatia', 'Cyprus',

    'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Georgia',

    'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Italy', 'Kosovo',

    'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Malta',

    'Moldova', 'Monaco', 'Montenegro', 'Netherlands', 'Norway', 'Poland',

    'Portugal', 'Romania', 'Russia', 'San Marino', 'Serbia', 'Slovakia', 'Slovenia',
    'Spain', 'Sweden', 'Switzerland', 'Turkey', 'Ukraine', 'United Kingdom', 'Vatican city'];
  /**
   * Stores the suggestions being displayed by the component,  
   * its value will constantly change as the user types in the country input
   *
   * @memberof HouseTableComponent
   */
  filteredList = [];
  loading = true;

  /**
   * Ng2 smart table settings.
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
      flatAmount: {
        editable: false,
        addable: false,
        title: 'Flat Amount',
        type: 'Flat',
      },
      actions:
      {
        filter: false,
        addable: false,
        editable: false,
        title: 'House Details',
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
   * Then constructor sends a get request to the server,loads all objects that we get in to our table and counts it amount
   * @param {HouseService} houseService - Includes all variables and functions to make crud requests on server
   * @param {ActivatedRoute} route  Activated aka current route
   * @param {ToasterService} toasterService - Notification service (toasts)
   * @memberof HouseTableComponent
   */
  constructor(
    private houseService: HouseService,

    private toasterService: ToasterService,
  ) {
    document.addEventListener('click', (evt) => {
      const flyoutElement = document.getElementById('countries1');
      let targetElement = evt.srcElement;

      do {
        if (targetElement === flyoutElement) {
          this.filter();
          return;
        }
        // Go up the DOM
        targetElement = targetElement.parentElement;
      } while (targetElement);

      // This is a click outside.
      this.filteredList = [];
    });
    this.selectedHouse = new House();
  }

  ngOnInit() {

    // Getting all houses from server and loading them in to the table and count their amount
    this.houseService.getHouseList().subscribe(Houses => {
      // Loading house objects in to ng2 smart table.
      this.source.load(Houses);
      // Counting amount of houses in table.
      this.totalAmountOfHosesInTable = this.source.count();
      this.loading = false;
    });

  }



  /**
   * Function deletes a house Object.
   * @param {*} event  event- Ng2 Smart table event object which contains row data
   * @memberof HouseTableComponent
   */
  deleteHouseFromTable(event): void {
    this.houseService.deleteHouse(event).subscribe(() => {
      this.source.remove(event.data);
      this.totalAmountOfHosesInTable--;
    });
  }
  /**
   * Method opens new house registration form
   * @memberof HouseTableComponent
   */
  openHouseRegistrationForm(): void {
    // If user will click on 'Plus' button it will open registration form
    this.registrationHouseFormVisible = true; // If RegistrationHouseForm value is true, then it will be shown
  }
  /**
  * Method opens a House edit form.
  * @param {*} event event- Ng2 Smart table event object which contains row data
  * @memberof HouseTableComponent
  */
  openHouseEditForm(event): void {
    this.houseThatWeWantToChange = event;

    this.selectedHouse = Object.assign({}, event.data); // This will send all values that has our object that we want to edit to our form
    // If user will click on 'pencil' button, it will open edit form
    this.query = this.selectedHouse.country;
    this.editHouseFormVisible = true; // If EditHouseForm value is not 0, then it will be shown
  }

  /**
   * Function will close registration or edit form in house table,  
   * Used on button in forms
   * @param {NgForm} [form]  Property says on what form will be used this function
   * @memberof HouseTableComponent
   */

  closeHouseRegistrationOrEditForm(form: NgForm): void {
    this.resetForm(form);
    this.registrationHouseFormVisible = false;
    this.editHouseFormVisible = false;
  }

  /**
   * Function  resets House object values in form
   * @param {NgForm} [form] Form-this property will say on what form will be used this function
   * @memberof HouseTableComponent
   */

  resetForm(form: NgForm) {
    if (form !== null) {
      form.reset();
      this.query = '';
      this.selectedHouse = new House();
    }
  }
  /**
   * Method adds a new house,or edits house vaules,depends in what from you are working.
   * @param {NgForm} form form - paramater that will be our form that we use
   * @memberof HouseTableComponent
   */
  onSubmit(form: NgForm) {
    if (!form.value.id) {
      this.submitToAddNewHouse(form);
    } else {
      this.submitToEditHouseValues(form);
    }

  }
  /**
   * Clicking on submit button in Registration form, function edits a house object
   * @param {NgForm} form Form values
   * @memberof HouseTableComponent
   */

  submitToEditHouseValues(form: NgForm) {
    this.houseService.editHouse(form.value.id, form.value)
      .subscribe(editedHouse => { // Sending a put request to edit a house values in server
        this.source.update(this.houseThatWeWantToChange.data, editedHouse); // Modifying our  house object values in table
        this.resetForm(form); // Reseting form values
        this.toasterService.popAsync('Record updated', 'House info was changed');
      }, (err) => { // If we reaceave an error from server
        console.log(err);
        console.log(err.text());

        this.errorFromServer = err.text(); // We will put a message from error to our local variable 'errorFromServer'
        // And toastr will notify user with this error message
        this.toasterService.popAsync('error', 'Custom error in component', this.errorFromServer);
      },
      );
  }
  /**
   * Clicking on submit button in Registration form, function adds a new house
   * @param {NgForm} form Form values.
   * @memberof HouseTableComponent
   */

  submitToAddNewHouse(form: NgForm) {
    this.houseService.addHouse(form.value).subscribe(newHouse => { // Sending a post request to add a new house in server
      this.source.prepend(newHouse); // Adding new house in our table
      this.resetForm(form); // Reseting form values
      this.totalAmountOfHosesInTable = this.source.count(); // Counting amount of houses in our table.
      this.toasterService.popAsync('success', 'House was added'); // If house was successfully added,then user will reaceave a toastr message
    }, (err) => { // If we reaceave an error from server
      console.log(err);
      console.log(err.text());
      this.errorFromServer = err.text(); // We will put a message from error to our local variable 'errorFromServer'
      // And toastr will notify user with this error message
      this.toasterService.popAsync('error', 'Custom error in component', this.errorFromServer);
    });
  }
  /**
   * Function uses the query variable to filter the countries, then it stores the result in the filteredList.
   *
   * @memberof HouseTableComponent
   */
  filter() {
    if (this.query !== '') {
      this.filteredList = this.countries.filter((el) => {
        return el.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
      });
    } else {
      this.filteredList = [];
    }
  }

  /**
   * Function assigning the selected item to the query variable in order to make it appear in the input,
   * and to make the suggestions list disappear function removes everything from the filteredList.
   *
   * @param {*} item
   * @memberof HouseTableComponent
   */
  select(item) {
    this.query = item;
    this.filteredList = [];
  }


}


