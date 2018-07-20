import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { FlatService } from '../flat.service';
import { HouseService } from '../../house/house.service';
import { Location } from '@angular/common';
import { HouseComponent } from '../../house/house.component';
import { HouseTableComponent } from '../../house/house-table/house-table.component';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Flat } from '../flat.model';
import { NgForm } from '@angular/forms';
import { Toast, ToasterService } from '../../../../../node_modules/angular2-toaster';
@Component({
  selector: 'app-flat-table',
  templateUrl: './flat-table.component.html',
  styles: [`
  nb-card {
    transform: translate3d(0, 0, 0);
  }
`],
})
export class FlatTableComponent {
  houseId: any = null; // variable that will contain value that will come from our param.id
  myError: string = null; // variable that will contain value that will come from server(if server returned an error)
  myReturnedFlat;
  settings = { // setting of our smart table (buttons,columns,names......)
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

  source: LocalDataSource = new LocalDataSource(); // fucntionality of our ng2 smart table
  // our constructor calles getFlatList() function to send a request to our backend so he could return us all flat objects...
  // then all this returned values will be placed in flatList(Array of Flat Objects) from FlatService,and after that...
  // function load() from LocalDataSource class will load all this data to our smart table
  constructor(
    public flatService: FlatService,
    public houseService: HouseService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private toasterService: ToasterService,
  ) {
    // first of all we get value from route,we use it to define house id as a params.id
    // then we use GetHouseFlats , getFlatList and GetOneHouse to get all needed information to load in table
    // and counting all objects
    this.flatService.FlatEditForm = null;
    this.flatService.FlatRegForm = null;
    this.flatService.selectedFlat = new Flat(this.houseId);
    this.route.params.subscribe((params: any) => {
      this.houseService.SourtedFlatList = [];
      this.houseId = params.id; // giving houseId value of params.id
      // this.flatService.selectedFlat.houseid = this.houseId;
      // if route returns params.id as 'all' or it is undefined then
      // programm will load all flats in to the table that we have in our database on our backend
      if (!params.id || params.id === 'all') {

        this.flatService.getFlatList().subscribe(resp => {
          this.flatService.flatList = resp.json();
          this.source.load(this.flatService.flatList);
          this.flatService.TotalFlatsInTable = this.source.count();
          this.houseService.selectedHouse = null;
        });
        // else (if we have returned param.id as a number) it will load to
        // the table all flats that include house with id that have === param.id
      } else {
        this.resetTheFuckingForm();
        this.houseService.GetHouseFlats(params.id).subscribe(flats => {
          this.houseService.SourtedFlatList = flats.json();
          this.source.load(this.houseService.SourtedFlatList);
          this.flatService.TotalFlatsInAdditionalHouse = this.source.count();
          this.flatService.getAllFlatAmount().subscribe(Amount => {
            this.flatService.TotalFlatsInTable = Amount.json();
            this.source.refresh();
            this.houseService.GetOneHouse(params.id).subscribe(house => {
              this.houseService.selectedHouse = house.json();
            });
          });
        });
      }
    });

  }
  /**
  * If user will confirm that he wants to delete additional resident,
  * then this function will call "deleteFlat" fucntion that will make a delete request
  *
  * @param {*} event - event-Object, consist of:
  * data: Object - original row data
  * newData: Object - edited data
  * source: DataSource - table data source
  * confirm: Deferred - Deferred object with resolve(newData: Object) and reject() methods
  * @memberof FlatTableComponent FlatTableComponent - Have all setting of our resident smart table
  */
  onDeleteConfirm(event): void {
    this.flatService.deleteFlat(event).subscribe(res => {
      console.log(res);
      this.source.remove(event.data);
      if (this.houseId) {
        this.flatService.GetFlatAmountInOneHouse(this.houseId).subscribe(Amount => {
          this.flatService.TotalFlatsInAdditionalHouse = Amount.json();
          this.flatService.getAllFlatAmount().subscribe(allAmount => {
            this.flatService.TotalFlatsInTable = allAmount.json();
          });
        });
      } else {
        this.flatService.getAllFlatAmount().subscribe(Amount => {
          this.flatService.TotalFlatsInTable = Amount.json();
        });
      }
    });
  }
  /**
   * If user will click on 'Plus' button it will open registration form
   * @param {*} event event-Object, consist of:
   * data: Object - original row data
   * newData: Object - edited data
   * source: DataSource - table data source
   * confirm: Deferred - Deferred object with resolve(newData: Object) and reject() methods
   * @memberof FlatTableComponent FlatTableComponent - Have all setting of our resident smart table
   */
  onCreateConfirm(event): void {
    this.flatService.FlatRegForm = 1;
  }
  /**
  * If user will click on 'pencil' button, it will open edit form
  * @param {*} event event-Object, consist of:
  * data: Object - original row data
  * newData: Object - edited data
  * source: DataSource - table data source
  * confirm: Deferred - Deferred object with resolve(newData: Object) and reject() methods
  * @memberof FlatTableComponent FlatTableComponent - Have all setting of our resident smart table
  */
  onSaveConfirm(event): void {
    this.myReturnedFlat = event;
    this.flatService.selectedFlat = Object.assign({}, event.data); // this will send all values that has our object that we want to edit to our form
    this.flatService.FlatEditForm = 1; // if FlatEditForm value is not 0, then it will be shown
  }
  /**
   * Function will be use on button,when we will click on button,
   * function will send uss on other page
   * @memberof FlatTableComponent FlatTableComponent - Have all setting of our resident smart table
   */
  goBack(): void {
    this.location.back();
  }
  /**
   * give us posability to click on a row
   * as a result it will give us all values of this row as an event
   * and after that it will route uss to '/pages/resident/resident-table/ id'
   * @param {*} event event- in our case it is a click event on a row
   * @memberof FlatTableComponent FlatTableComponent - Have all setting of our resident smart table
   */
  onUserRowSelect(event) {
    console.log('user row select: ', event.data.id);
    this.router.navigate(['/pages/resident/resident-table/' + event.data.id], { relativeTo: this.route });
  }
  /**
   * This function is use on a button,when we will press button,it will
   * send uss on a House table page,where will be loaded all Houses that we have in database
   * @memberof FlatTableComponent FlatTableComponent - Have all setting of our resident smart table
   */
  getFullList(): void {
    this.router.navigate(['/pages/flat/flat-table'],
    );
  }
  /**
   * Function resets all form values(edit and registration)
   * to a values that are in this function
   * @param {NgForm} [form] form-this property will say on what form will be used this function
   * @memberof FlatTableComponent FlatTableComponent - Have all setting of our resident smart table
   */
  resetTheFuckingForm(form?: NgForm) {
    this.flatService.selectedFlat = new Flat(this.houseId);
  }
  /**
   * Function is used on button submit in registration or edit form,if in form our object id is null
   * then when user will click in submit button it will send a post request to server, to create a new object in database,if server
   * will return an error then user will see the message error that will ensure him what did he do wrong.
   * If our object in form has id,then when user will click submit button it will send a put request to our server, to
   * change our object values in database to a new one,if server
   * will return an error then user will see the message error that will ensure him what did he do wrong.
   * @param {NgForm} form form-this property will say on what form will be used this function
   * @memberof FlatTableComponent FlatTableComponent - Have all setting of our resident smart table
   */
  onSubmit(form: NgForm) {
    if (!form.value.id) {
      this.flatService.postFlat(form.value).subscribe(newFlat => {
        this.source.prepend(newFlat);
        this.toasterService.popAsync('success', 'Flat was added');
        this.resetTheFuckingForm(form);
        this.flatService.GetFlatAmountInOneHouse(this.houseId).subscribe(flatAmountInOneHouse => {
          this.flatService.TotalFlatsInAdditionalHouse = flatAmountInOneHouse.json();
          this.flatService.getAllFlatAmount().subscribe(allAmount => {
            this.flatService.TotalFlatsInTable = allAmount.json();
          });
        });
      },
        (err) => {
          this.myError = <any>err; // .json();
          console.log('this is my errorito: ' + err.text());
          this.myError = err.text();
          console.log('myerrorito' + this.myError);
          this.toasterService.popAsync('error', 'Custom error in component', this.myError);
        },
      );
    } else {
      this.flatService.putFlat(form.value.id, form.value)
        .subscribe(editedFlat => {
          this.source.update(this.myReturnedFlat.data, editedFlat.json());
          this.resetTheFuckingForm(form);
          this.toasterService.popAsync('Record updated', 'Flat info was changed');
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
   * Function will close registration or edit form in house table
   * Used on button in forms
   * @param {NgForm} [form] form-this property will say on what form will be used this function
   * @memberof FlatTableComponent FlatTableComponent - Have all setting of our resident smart table
   */
  onClose(form?: NgForm): void {
    this.flatService.FlatEditForm = null;
    this.flatService.FlatRegForm = null;
    this.resetTheFuckingForm(form);
  }
}

