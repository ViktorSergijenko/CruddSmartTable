import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ResidentService } from '../resident.service';
import { Http } from '@angular/http';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FlatService } from '../../flat/flat.service';
import { Resident } from '../resident.model';
import { NgForm } from '@angular/forms';
import 'rxjs/add/operator/take';

/**
 * FIXME💩: Try to remove ../node_modules/  
 * COrrect: 'angular2-toaster' + unused imports
 */
import { ToasterService } from '../../../../../node_modules/angular2-toaster';
import { forkJoin } from '../../../../../node_modules/rxjs';
import { Flat } from '../../flat/flat.model';

@Component({
  selector: 'app-resident-table',
  templateUrl: './resident-table.component.html',
  /**
 * FIXME💩: Better to use in file + file probably is .scss, not .css
 */
  styles: [`
  nb-card {
    transform: translate3d(0, 0, 0);
  }
`],
})
export class ResidentTableComponent implements OnInit {

  /**
   * Used as a pattern for phone number.
   * @memberof ResidentTableComponent
   */
  numberPattern = '^2[0-9]{7}'; // pattern for our phone number, but still didnt manage to use it...
  /**
   * Variable that will contain one of Id's of a flat,that will come with params from route.
   * @type {number}
   * @memberof ResidentTableComponent
   */
  additionalFlatId: any = null;
  /**
   * Variable that contains an error text.
   * @type {string}
   * @memberof ResidentTableComponent
   */
  errorFromServer: string = '';

  /**
   * Variable that will contain a Resident object that we want to change.
   * @memberof ResidentTableComponent
   */
  residentThatWeWantToChange;
  selectedResident: Resident;
  residentList: Resident[];
  flatList: Flat[];
  totalResidentsInAllFlats: number;
  totalResidentsInAdditionalFlat: number;
  sourtedResidents: Resident[] = [];
  residentRegForm: number;
  residentEditForm: number;
  selectedFlat: number;
  /**
   * Settings is a ng2 smart table property where we can set all needed setings for our table(columns names,actions.....)
   * @memberof ResidentTableComponent
   */
  settings = {
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


  source: LocalDataSource = new LocalDataSource();

  constructor(
    private residentService: ResidentService,
    private flatService: FlatService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private toasterService: ToasterService,
  ) {
    this.residentEditForm = null; // Using this in constructor,to make Edit form Invisible at the beggining.
    this.residentRegForm = null;  // Using this in constructor,to make Registration form Invisible at the beggining.
  }
  ngOnInit() {
    this.gettingFlatIdFromRoute(); // First we get a flat id,to ensure that we will load exactly those residents that we want to load.
    // Also there can be  cases when there can be no flat id in our Route.
    if (!this.additionalFlatId || this.additionalFlatId === 'all') { // If we dont have flat id.
      this.resetForm(); // We will reset form,to avoid problems with our form values.
      this.loadAllResidentsInTableAndCountThem(); // Then we will load all residents in to our table.
    } else { // If we have flat id.
      this.resetForm(); // We will reset form,to avoid problems with our form values.
      this.loadAdditionalHouseFlatsAndCountThem(); // Then we will load only those resdients,that are located ...
      // In flat that id is equal to "additionalFlatId" value.
    }
  }

  /**
   * Function gets Flat id value from route params.
   * @memberof ResidentTableComponent
   */
  gettingFlatIdFromRoute() {
    // Getting a route param from our routing.
    this.route.params.take(1).subscribe((params: any) => {
      this.additionalFlatId = params.id; // Putting this route param in to our locate variable "additionalFlatId".
      this.selectedResident = new Resident(this.additionalFlatId); // Using additionalFlatId variable in Resident object constructor.
      this.sourtedResidents = []; // To avoid problems with table loading, we clear all that could be in our sourtedResidents array.
    });
  }

  /**
   * Function will load all existing residents to our table,and count their amount.
   * @memberof ResidentTableComponent
   */
  loadAllResidentsInTableAndCountThem() {
    // Getting all residents from server.
    this.residentService.getResidentList().subscribe(residents => {
      this.source.load(residents); // Loading this residents in to our table.
      this.totalResidentsInAllFlats = this.source.count(); // Counting amount of residents that was laoded in to our table.
      this.selectedFlat = null; // So,because we have loaded all residents,then we dont need flat info.
      // Flat information is used only in those cases,when we are loading residents from additional flat.
    });
  }
  /**
   * Function will load to our table only those residents, that are located in additional flat,and count their amount.
   * @memberof ResidentTableComponent
   */
  loadAdditionalHouseFlatsAndCountThem() {
    forkJoin(
      // Getting residents that are located in flat, that has id equal to "additionalFlatId" value.
      this.flatService.getFlatResidents(this.additionalFlatId),
      // Getting Info about flat, where our residents are living.
      this.flatService.getOneFlat(this.additionalFlatId),
    ).subscribe(flatAndItsResidents => {
      // Loading this residents to our table.
      this.source.load(flatAndItsResidents[0]);
      // Counting amount of loaded residents.
      this.totalResidentsInAdditionalFlat = this.source.count();
      // Putting our flat in to selectedFlat variable,to get flat info later.
      this.selectedFlat = flatAndItsResidents[1];
    });
  }

  // FIXME💩: Types + JSDoc param description should be moved to specific model and it should be described
  // + you dont need "-" after param name. Good example: @param {*} event Event of something
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
      this.totalResidentsInAllFlats = this.totalResidentsInAllFlats - 1;
      this.totalResidentsInAdditionalFlat = this.totalResidentsInAdditionalFlat - 1;
    });
  }


  /**
   * If user will click on 'Plus' button it will open registration form.
   * @memberof ResidentTableComponent
   */
  onCreateConfirm(): void {
    this.residentRegForm = 1; // if residentRegForm value is not 0, then Registration form will be shown.
  }

  /**
   * If user will click on 'pencil' button, it will open edit form.
   * @param {*} event event-Resident Object,
   * @memberof ResidentTableComponent
   */
  onSaveConfirm(event): void {
    this.residentThatWeWantToChange = event;
    this.selectedResident = Object.assign({}, event.data); // This will send all values that has our object that we want to edit to our form.
    this.residentEditForm = 1; // if residentEditForm value is not 0, then it will be shown.
  }

  /**
   * Function will be use on button,when we will click on button,
   * function will send uss on previous page.
   * @memberof ResidentTableComponent
   */
  goBack(): void {
    this.location.back();
  }

  /**
  * This function is used on a button,when we will press button,it will
  * send uss on a House table page, where we will be able to see all houses that exists.
  * @memberof ResidentTableComponent
  */
  getFullList(): void {
    this.router.navigate(['/pages/resident/resident-table'],
    );
  }

  /**
   * Function resets all form values(edit and registration)
   * to a default values.
   * @param {NgForm} [form] form - Form that we want to reset.
   * @memberof ResidentTableComponent
   */
  resetForm(form?: NgForm) {
    this.selectedResident = new Resident(this.additionalFlatId);
  }

  /**
   * Function is used on button submit in registration or edit form,if in form our object id is null
   * then when user will click in submit button it will send a post request to server, to create a new object in database,if server
   * will return an error then user will see the message error that will ensure him what did he do wrong.
   * If our object in form has id,then when user will click submit button it will send a put request to our server, to
   * change our object values in database to a new one,if server
   * will return an error then user will see the message error that will ensure him what did he do wrong.
   * @param {NgForm} form form-this property will say on what form will be used this function
   * @memberof ResidentTableComponent
   */
  onSubmit(form: NgForm) {
    if (!form.value.id) {
      this.postRequestFunctionInForm(form);
    } else {
      this.putRequestFunctionInForm(form);
    }
  }
  postRequestFunctionInForm(form: NgForm) {
    forkJoin(
      this.residentService.postResident(form.value),
      this.residentService.getResidentAmountInOneFlat(this.additionalFlatId),
    ).subscribe(newResidentAndResidentAmount => {
      this.source.prepend(newResidentAndResidentAmount[0]);
      this.toasterService.popAsync('success', 'Resident was added');
      this.resetForm(form);
      this.totalResidentsInAdditionalFlat = newResidentAndResidentAmount[1];
    }, (err) => {
      this.errorFromServer = err.text();
      this.toasterService.popAsync('error', 'Custom error in component', this.errorFromServer);
    });
  }
  putRequestFunctionInForm(form: NgForm) {
    this.residentService.putResident(form.value.id, form.value)
      .subscribe(editedResident => {
        this.source.update(this.residentThatWeWantToChange.data, editedResident);
        this.toasterService.popAsync('Record updated', 'Resident info was changed');
        this.resetForm(form);
      },
        (err) => {
          this.errorFromServer = err.text();
          this.toasterService.popAsync('error', 'Custom error in component', this.errorFromServer);
        });
  }

  // FIXME💩: JSDocs are a little wrong (properties). See FIXME above for similar
  /**
  * Function will close registration or edit form in resident table  
  * Used on button in forms
  * @param {NgForm} [form] form-this property will say on what form will be used this function
  * @memberof ResidentTableComponent
  */
  onClose(form?: NgForm): void {

    this.residentRegForm = null;
    this.residentEditForm = null;
    this.resetForm(form);
  }
}

