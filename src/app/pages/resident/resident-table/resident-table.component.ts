import { Component, OnInit, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ResidentService } from '../resident.service';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
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
import { ToasterModule, ToasterService } from '../../../../../node_modules/angular2-toaster';
import { forkJoin, Observable } from '../../../../../node_modules/rxjs';

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
export class ResidentTableComponent {
  /**
 * FIXME💩: JSDocs would be better than comments + Comments with capital letter
 */
  numberPattern = '^2[0-9]{7}'; // pattern for our phone number, but still didnt manage to use it...
  /**
 * FIXME💩: Don't use "any" as type. Try to avoid it + camelCase. "my" is also not a best decission for naming variables
 */
  myflatId: any; // variable that will contain value that will come from our param.id
  /**
 * FIXME💩: Dont use "my" in var names + better to give initial value '' as empty string
 */
  myError: string = null; // variable that will contain value that will come from server(if server returned an error)
  /**
* FIXME💩: Dont use "my" in var names
*/
  myReturnedResident;
  /**
* FIXME💩: JSDocs better than comments in this case
*/
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
  /**
* FIXME💩: JSDocs + Comments with capital letter + multiline comment better to write above, not on side
*/
  source: LocalDataSource = new LocalDataSource(); // fucntionality of our ng2 smart table
  // our constructor calles getFlatList() function to send a request to our backend so he could return us all house objects...
  // then all this returned values will be placed in flatList from FlatService(Array of Flat Objects),and after that...
  // function load() from LocalDataSource class will load all this data to our smart table
  constructor(
    // FIXME💩: Dont use public here. You can avoid it
    public residentService: ResidentService,
    public flatService: FlatService,
    private http: Http, // FIXME💩: Unused 
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private toasterService: ToasterService,
  ) {
    // FIXME💩: camelCase + do you really need it ?
    // + Dont store this info in service variables, you can and should do it in this component since you are not using it anywhere else
    this.residentService.selectedResident = new Resident(this.myflatId);
    this.residentService.ResidentEditForm = null;
    this.residentService.ResidentRegForm = null;
    // FIXME💩: Comment with capital letter
    // first of all we get value from route. We use it to define flat id as a params.id
    // then we use GetFlatResidents, getResidentList and GetOneFlat to get all needed information to load in table
    // and counting all objects
    // FIXME💩: params should be subscribed to in ngOnInit (best practices)
    // TODO: Use take(1) for params. See Discord (angular2 channel) for more info
    this.route.params.take(1).subscribe((params: any) => {
      // FIXME💩: console.logs
      console.log('I am there');
      this.myflatId = params.id;
      console.log(params.id);
      // FIXME💩: Comment with capital letter
      // if route returns params.id as 'all' or it is undefined then
      // programm will load all flats in to the table FIXME💩: Hard to understand next text: that we have in our database on our backend
      if (!params.id || params.id === 'all') {
        this.residentService.getResidentList().subscribe(resident => {
          // FIXME💩: More comments would be lovely + better to do .json() in service
          this.residentService.residentList = resident.json();
          // FIXME💩: Do you really need to store residentList in service if you won't use it ?
          // Better to load just residents
          this.source.load(this.residentService.residentList);
          // FIXME💩: Variable names with camelCase
          this.residentService.TotalResidentsInAllFlats = this.source.count();
          this.flatService.selectedFlat = null;
        });
        // FIXME💩: Comment with capital letter + Some mistakes in comment
        // else (if we have returned param.id as a number(not null or undefined)) it will load to
        // FIXME💩: Some mistakes here: tot the table only those residents,that are located in flat that
        // FIXME💩: Also hard to understand:  id is equal to the value that has param.id
      } else {
        // FIXME💩: Add some comments on why are you doing stuff, like why are you resetting form here and doing other stuff (More comments)
        this.resetForm();
        // FIXME💩: Service method names and variable names as camelCase + params.id you can store in another variable and then reuse
        // FIXME💩: Refactor this whole constructor to make it less complex (divide into separated, logical methods)
        // TODO: Simple RxJs example usage
        // forkJoin(
        //   this.flatService.GetFlatResidents(params.id),
        //   this.residentService.getAllResidentAmount(),
        // ).subscribe(responses => {
        //   this.source.load(responses[0].json());
        //  // And other logic here...
        // });
        this.flatService.GetFlatResidents(params.id).subscribe(resident => {
          // FIXME💩: .json() should be done in service
          // FIXME💩: Use reactive programming (RxJS) advantages (See example above)
          this.flatService.SourtedResidents = resident.json();
          this.source.load(this.flatService.SourtedResidents);
          this.flatService.GetOneFlat(params.id).subscribe(oneFlat => {
            this.flatService.selectedFlat = oneFlat.json();
          });
          this.residentService.getAllResidentAmount().subscribe(resAmount => {
            this.residentService.TotalResidentsInAllFlats = resAmount.json();
            this.residentService.GetResidentAmountInOneFlat(params.id).subscribe(resAmountInOneFlat => {
              this.residentService.TotalResidentsInAdditionalFlat = resAmountInOneFlat.json();
              // FIXME💩: Do you need refresh here?
              this.source.refresh();
            });
          });
        });
      }
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
      this.residentService.TotalResidentsInAllFlats = this.residentService.TotalResidentsInAllFlats - 1;
      this.residentService.TotalResidentsInAdditionalFlat = this.residentService.TotalResidentsInAdditionalFlat - 1;
    });
  }

  // FIXME💩: Types + JSDoc param description should be moved to specific model and it should be described
  // + you dont need "-" after param name. Good example: @param {*} event Event of something
  // + Better to use "ENTER"s between methods
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
    // FIXME💩: camelCase + Not clear what are you doing here, so +comments
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
    // FIXME💩: 💩TSLINT DISABLE! NEVER! USE! THIS! 💩
    // tslint:disable-next-line:max-line-length
    // FIXME💩: This is not your returned resident, it is a ng2-smart-table event, which contains some information (resident, for example)
    this.myReturnedResident = event;
    // FIXME💩: You get max-line-length error because you are adding comment to the side which increases line length,
    // so better to write it above + add some more comments
    this.residentService.selectedResident = Object.assign({}, event.data); // this will send all values that has our object that we want to edit to our form
    this.residentService.ResidentEditForm = 1; // if ResidentEditForm value is not 0, then it will be shown
  }

  // FIXME💩: Hard to understand what is going on. Please rewrite this description
  /**
   * Function will be use on button,when we will click on button,
   * function will send FIXME💩: uss on other page
   * @memberof ResidentTableComponent ResidentTableComponent FIXME💩: This should not be added here:- Have all setting of our resident smart table
   */
  goBack(): void {
    this.location.back();
  }

  // FIXME💩: Hard to understand what is going on. Please rewrite this description
  /**
   * This function is use on a button,when we will press button,it will
   * send uss on a Flat table page,where will be loaded all flats that we have in database
   * @memberof ResidentTableComponent ResidentTableComponent - Have all setting of our resident smart table
   */
  getFullList(): void {
    this.router.navigate(['/pages/resident/resident-table'],
    );
  }

  // FIXME💩: JSDocs are a little wrong (properties). See FIXME above for similar
  /**
   * Function will reset our object values on form
   * @param {NgForm} [form] form-this property will say on what form will be used this function
   * @memberof ResidentTableComponent ResidentTableComponent FIXME💩: Remove:- Have all setting of our resident smart table
   */
  // FIXME💩: Why do you need "?" 💩💩💩 Dont use, if don't know why
  resetForm(form?: NgForm) {
    // FIXME💩: 💩TSLINT DISABLE! NEVER! USE! THIS! 💩
    // tslint:disable-next-line:curly
    this.residentService.selectedResident = new Resident(this.myflatId);
  }

  // FIXME💩: Too much information in description + information about what is going on on server
  // not always is correct and known, so don't describe it. For some tech stuff you can add
  // comments in appropriate places
  /**
   * Function is used on button submit in registration or edit form,if in form our object id is null
   * then when user will click in submit button it will send a post request to server, to create a new object in database,if server
   * will return an error then user will see the message error that will ensure him what did he do wrong.
   * If our object in form has id,then when user will click submit button it will send a put request to our server, to
   * change our object values in database to a new one,if server
   * will return an error then user will see the message error that will ensure him what did he do wrong.
   * @param {NgForm} form form-this property will say on what form will be used this function
   * @memberof ResidentTableComponent ResidentTableComponent FIXME💩: Remove:- Have all setting of our resident smart table
   */
  // FIXME💩: Too much logic in one method. You should divide it
  onSubmit(form: NgForm) {
    if (!form.value.id) {
      this.residentService.postResident(form.value).subscribe(newResident => {
        // FIXME💩: Overall, needed more comments
        this.source.prepend(newResident);
        this.toasterService.popAsync('success', 'Resident was added');
        this.resetForm(form);
        // FIXME💩: .json() should be done in service
        this.residentService.getAllResidentAmount().subscribe(resAmount => {
          this.residentService.TotalResidentsInAllFlats = resAmount.json();
          this.residentService.GetResidentAmountInOneFlat(this.myflatId).subscribe(resAmountInOneFlat => {
            this.residentService.TotalResidentsInAdditionalFlat = resAmountInOneFlat.json();
            // FIXME💩: Do you really need it ? If yes, comment why
            this.source.refresh();
          });
        });
        // FIXME💩: Types
        // TODO: Pass err to error handler and handle errors there
      }, (err) => {
        // FIXME💩: Comment why you cast to "any" and + "any" is bad
        this.myError = <any>err; // .json();
        // FIXME💩: console.log
        console.log('this is my errorito: ' + err.text());
        this.myError = err.text();
        console.log('myerrorito' + this.myError);
        this.toasterService.popAsync('error', 'Custom error in component', this.myError);
      });
    } else {
      this.residentService.putResident(form.value.id, form.value)
        .subscribe(editedResident => {
          this.source.update(this.myReturnedResident.data, editedResident);
          this.toasterService.popAsync('Record updated', 'Resident info was changed');
          this.resetForm(form);
        },
          // FIXME💩: Types
          (err) => {
            this.myError = <any>err; // .json();
            console.log('this is my errorito: ' + err.text());
            this.myError = err.text();
            console.log('myerrorito' + this.myError);
            this.toasterService.popAsync('error', 'Custom error in component', this.myError);
          });
    }
  }

  // FIXME💩: JSDocs are a little wrong (properties). See FIXME above for similar
  /**
  * Function will close registration or edit form in resident table  
  * Used on button in forms
  * @param {NgForm} [form] form-this property will say on what form will be used this function
  * @memberof ResidentTableComponent ResidentTableComponent FIXME💩: Remove: - Have all setting of our resident smart table
  */
  // FIXME💩: Why do you need "?" 💩💩💩 Dont use, if don't know why
  onClose(form?: NgForm): void {
    // FIXME💩: camelCase + comments
    this.residentService.ResidentRegForm = null;
    this.residentService.ResidentEditForm = null;
    this.resetForm(form);
  }
}

