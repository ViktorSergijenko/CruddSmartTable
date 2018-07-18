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
  houseId: any = null;
  // vesj html(kak vigljadjat i nazivajutsja nawi polja i td,vsja eta infa sazovivaetsja v peremennuju "settings")
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
    },
  };

  source: LocalDataSource = new LocalDataSource(); // fucntionality of our ng2 smart table
  // our constructor calles getFlatList() function to send a request to our backend so he could return us all house objects...
  // then all this returned values will be placed in flatList from FlatService(Array of Flat Objects),and after that...
  // function load() from LocalDataSource class will load all this data to our smart table
  constructor(
    public flatService: FlatService,
    public houseService: HouseService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    // first of all we get value from route,we use it to define house id as a params.id
    // then we use GetHouseFlats , getFlatList and GetOneHouse to get all needed information to load in table
    // and counting all objects
    this.flatService.FlatEditForm = null;
    this.flatService.FlatRegForm = null;
    const myHouseId: number = null;
    this.flatService.selectedFlat = new Flat();
    this.route.params.subscribe((params: any) => {
      this.houseService.SourtedFlatList = [];

      this.houseId = params.id; // giving houseId value of params.id
      this.flatService.selectedFlat.houseid = this.houseId;

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
        // this.resetTheFuckingForm();
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
   * If user will confirm that he wants to add a new flat,function will call
   * "postFlat" function that will make a post request to other localhost
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
  * If user will confirm that he wants to change information about additional resident
  * function will call other function called "putFlat",that will send put request to our backend
  * @param {*} event event-Object, consist of:
  * data: Object - original row data
  * newData: Object - edited data
  * source: DataSource - table data source
  * confirm: Deferred - Deferred object with resolve(newData: Object) and reject() methods
  * @memberof FlatTableComponent FlatTableComponent - Have all setting of our resident smart table
  */
  onSaveConfirm(event): void {
    this.flatService.selectedFlat = Object.assign({}, event.data);
    this.flatService.FlatEditForm = 1;
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
   * @param {NgForm} [form]
   * @memberof FlatTableComponent
   */
  resetTheFuckingForm(form?: NgForm) {
    // if (form != null) {
    // form.reset();
    // form.value.houseid = this.houseId;
    this.flatService.selectedFlat = new Flat(this.houseId);
    // this.flatService.selectedFlat.houseid = this.houseId;

    // this.flatService.selectedFlat = {
    //   id: null,
    //   floor: null,
    //   number: null,
    //   totalarea: null,
    //   livingspace: null,
    //   residentamount: null,
    //   houseid: this.houseId,
    //   residents: null,
    // };
    // }

  }
  /**
   * Function is used on submit button, if form value "id" is null,then function will use post request
   * else will use put request,to send a requests on our server
   * @param {NgForm} form
   * @memberof FlatTableComponent
   */
  onSubmit(form: NgForm) {
    if (!form.value.id) {
      this.flatService.postFlat(form.value).subscribe(data => {
        this.source.prepend(form.value);

        this.resetTheFuckingForm(form);


        this.flatService.GetFlatAmountInOneHouse(this.houseId).subscribe(flatAmountInOneHouse => {
          this.flatService.TotalFlatsInAdditionalHouse = flatAmountInOneHouse.json();
          this.flatService.getAllFlatAmount().subscribe(allAmount => {
            this.flatService.TotalFlatsInTable = allAmount.json();
          });
        });
        // this.toastr.success('New Record Added', 'House registered');
      });
    } else {
      this.flatService.putFlat(form.value.id, form.value)
        .subscribe(data => {
          this.resetTheFuckingForm(form);
          // this.toastr.info('Record updated', 'Flat info was changed');
        });
    }
  }
  /**
   * Function will close registration or edit form in house table
   * Used on button in forms
   * @param {NgForm} [form]
   * @memberof FlatTableComponent
   */
  onClose(form?: NgForm): void {
    this.flatService.FlatEditForm = null;
    this.flatService.FlatRegForm = null;
    this.resetTheFuckingForm(form);
  }
}

