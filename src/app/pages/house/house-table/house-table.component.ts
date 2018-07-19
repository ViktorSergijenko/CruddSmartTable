import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { HouseService } from '../house.service';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { House } from '../house.model';
import { error } from '@angular/compiler/src/util';
import { Observable } from 'rxjs';

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
  // our constructor calles getHouseList() function to send a request to our backend so he could rewturn us all house objects...
  // then all this returned values will be placed in houseList from HouseService(Array of House Objects),and after that...
  // function load() from LocalDataSource class will load all this data to our smart table
  constructor(
    public houseService: HouseService, private http: Http, private router: Router, private route: ActivatedRoute,
  ) {
    this.houseService.RegistrationHouseForm = null;
    this.houseService.EditHouseForm = null;
    // this.houseService.houseForForm = new House();
    // houseService.mysubject.next('My favourite value');
    this.houseService.selectedHouse = new House();
    this.houseService.getHouseList().subscribe(resp => {
      console.log(resp.json());
      this.houseService.houseList = resp.json();
      this.source.load(this.houseService.houseList);
      this.houseService.TotalAmountOfHosesInTable = this.source.count();
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
   * If user will confirm that he wants to add a new resident,function will call
   * "postResident" function that will make a post request to other localhost
   * @param {*} event event-Object, consist of:
   * data: Object - original row data
   * newData: Object - edited data
   * source: DataSource - table data source
   * confirm: Deferred - Deferred object with resolve(newData: Object) and reject() methods
   * @memberof HouseTableComponent HouseTableComponent - Have all setting of our resident smart table
   */
  onCreateConfirm(): void {
    this.houseService.RegistrationHouseForm = 1;
    console.log('HEYHEY');
  }
  /**
  * If user will confirm that he wants to change information about additional resident
  * function will call other function called "putResident",that will send put request to our backend
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
    this.houseService.selectedHouse = Object.assign({}, event.data);
    this.houseService.EditHouseForm = 1;
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
  onClose(form?: NgForm): void {
    this.resetForm(form);
    this.houseService.RegistrationHouseForm = null;
    this.houseService.EditHouseForm = null;
  }
  resetForm(form?: NgForm) {
    // tslint:disable-next-line:curly
    if (form != null)
      form.reset();
    this.houseService.selectedHouse = {
      id: null,
      street: '',
      number: null,
      floors: null,
      flatamount: null,
      city: '',
      country: '',
      postindex: '',
      flats: null,
    };
  }
  /**
  * Function is used on submit button, if form value "id" is null,then function will use post request
  * else will use put request,to send a requests on our server
  * @param {NgForm} form form - paramater that will be our form that we use
  * @memberof HouseTableComponent HouseTableComponent - Have all setting of our resident smart table
  */
  onSubmit(form: NgForm) {
    if (!form.value.id) {
      this.houseService.postHouse(form.value).subscribe(data => {
        this.source.prepend(form.value);
        this.resetForm(form);
        this.houseService.TotalAmountOfHosesInTable = this.source.count();
        // this.toastr.success('New Record Added', 'House registered');
      }, (error) => {
        this.myError = error.json();
        console.log('this is my errorito: ' + this.myError);
        this.handleError(error);
      },
      );
    } else {
      this.houseService.putHouse(form.value.id, form.value)
        .subscribe(data => {
          this.resetForm(form);
          this.source.empty();
          this.houseService.getHouseList().subscribe(houses => {
            this.houseService.houseList = houses.json();
            this.source.load(this.houseService.houseList);
          });
          // this.toastr.info('Record updated', 'Flat info was changed');
        });
    }
  }
  private handleError(error: any) {
    const errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.log('Messegito' + errMsg);
    return Observable.throw(error);
  }
}

