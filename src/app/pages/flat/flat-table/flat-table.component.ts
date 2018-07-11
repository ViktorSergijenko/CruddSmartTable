import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { FlatService } from '../flat.service';
import { DataSource } from '../../../../../node_modules/ng2-smart-table/lib/data-source/data-source';
import { SmartTableService } from '../../../@core/data/smart-table.service';
import { HouseService } from '../../house/House.service';
import { Location } from '@angular/common';
import { HouseComponent } from '../../house/house.component';
import { HouseTableComponent } from '../../house/house-table/house-table.component';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Flat } from '../flat.module';
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
  houseId: any;
  // vesj html(kak vigljadjat i nazivajutsja nawi polja i td,vsja eta infa sazovivaetsja v peremennuju "settings")
  settings = { // setting of our smart table (buttons,columns,names......)
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
        title: 'FLat Number',
        type: 'number',
      },
      totalarea: {
        title: 'TotalArea',
        type: 'number',
      },
      livingspace: {
        title: 'LivingSpace',
        type: 'number',
      },
      residentamount: {
        editable: false,
        addable: false,
        title: 'ResidentAmount',
        type: 'number',
      },
      houseid: {
        editable: false,
        title: 'HouseId',
        type: 'html',
        editor: {
          type: 'list',
          config: {
            list: [],
          },
        },
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
    this.flatService.selectedFlat = new Flat;
    this.route.params.subscribe((params: any) => {
      this.houseService.SourtedFlatList = [];
      console.log('I am there');
      this.houseId = params.id;
      console.log(this.houseId);
      this.houseService.GetHouseFlats(params.id).subscribe(myFlats => {
        this.houseService.SourtedFlatList = myFlats.json();
        this.flatService.getFlatList().subscribe(flat => {
          this.flatService.flatList = flat.json();
          this.houseService.GetOneHouse(params.id).subscribe(myHouse => {
            this.houseService.selectedHouse = myHouse.json();
            this.flatService.TotalFlatsInTable = this.flatService.flatList.length;
          });
        });
      });
      // if route returns params.id as 'all' or it is undefined then
      // programm will load all flats in to the table that we have in our database on our backend
      if (!params.id || params.id === 'all') {
        console.log(this.houseId);
        this.flatService.getFlatList().subscribe(resp => {
          this.flatService.flatList = resp.json();
          this.source.load(this.flatService.flatList);
          this.flatService.TotalFlatsInTable = this.source.count();
          this.houseService.selectedHouse = null;
        });
        // else (if we have returned param.id as a number) it will load to
        // the table all flats that include house with id that have === param.id
      } else {
        this.houseService.GetHouseFlats(params.id).subscribe(flats => {
          this.houseService.SourtedFlatList = flats.json();
          this.source.load(this.houseService.SourtedFlatList);
          this.flatService.TotalFlatsInAdditionalHouse = this.source.count();
          this.source.refresh();
          this.houseService.SourtedFlatList = [];
        });
      }

      this.source.refresh();
    });

    const options = [];
    this.flatService.getHouseIds().subscribe(resp => {
      this.flatService.houseList = resp.json();
      this.flatService.houseList.map(house => {
        const myTest = { value: house.id, title: 'Street: ' + house.street + ' Number: ' + house.number + '  City: ' + house.city };
        options.push(myTest);
      });
      this.settings.columns.houseid.editor.config.list = options;
      this.settings = Object.assign({}, this.settings);
      console.log(options);
      this.source.refresh();
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
    this.flatService.deleteFlat(event);
    this.flatService.TotalFlatsInTable = this.flatService.TotalFlatsInTable - 1;
    this.flatService.TotalFlatsInAdditionalHouse = this.flatService.TotalFlatsInAdditionalHouse - 1;
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
    const data = { // values of our data that we will work with
      'id': event.newData.id = 0,
      'number': event.newData.number,
      'totalarea': event.newData.totalarea,
      'livingspace': event.newData.livingspace,
      'phone': event.newData.phone,
      'houseid': event.newData.houseid,
    };
    this.flatService.postFlat(event, data);
    this.flatService.TotalFlatsInTable = this.flatService.TotalFlatsInTable + 1;
    this.flatService.TotalFlatsInAdditionalHouse = this.flatService.TotalFlatsInAdditionalHouse + 1;
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
    const data = { // values of our data that we will work with
      'id': event.newData.id,
      'number': event.newData.number,
      'totalarea': event.newData.totalarea,
      'livingspace': event.newData.livingspace,
      'phone': event.newData.phone,
      'houseid': event.newData.houseid,
    };
    this.flatService.putFlat(event, data);
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
}

