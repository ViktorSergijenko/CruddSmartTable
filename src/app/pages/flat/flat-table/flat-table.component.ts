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
        title: 'ResidentAmount',
        type: 'number',
      },
      houseid: {
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
    private flatService: FlatService,
    private houseService: HouseService,
    private location: Location,
    private route: ActivatedRoute,
    // private houseTable: HouseTableComponent,
  ) {
    this.route.params.subscribe((params: any) => {
      console.log('I am there');
      console.log(params.id);
      this.houseService.GetHouseFlats(params.id).subscribe(myFlats => {
        this.houseService.SourtedFlatList = myFlats.json();
      });
      if (!params.id) {
        this.flatService.getFlatList().subscribe(resp => {
          this.flatService.flatList = resp.json();
          this.source.load(this.flatService.flatList);
          this.flatService.TotalFlatsInTable = this.source.count();
        });
      } else {
        this.houseService.GetHouseFlats(params.id).subscribe(flats => {
          this.houseService.SourtedFlatList = flats.json();
          this.source.load(this.houseService.SourtedFlatList);
          this.source.refresh();
          this.houseService.SourtedFlatList = [];
        });
      }
      this.source.refresh();
    });

    // houseService.mysubject.subscribe((value) => {
    //  console.log('value from Flat Controller' + value);
    // });
    const options = [];
    this.flatService.getHouseIds().subscribe(resp => {
      this.flatService.houseList = resp.json();
      this.flatService.houseList.map(house => {
        const myTest = { value: house.id, title: house.street };
        options.push(myTest);
      });
      this.settings.columns.houseid.editor.config.list = options;
      this.settings = Object.assign({}, this.settings);
      console.log(options);
      this.source.refresh();
    });
  }
  /**
  *If user will confirm that he wants to delete additional resident,
  *then this function will call "deleteFlat" fucntion that will make a delete request
  *
  * @param {*} event - event-Object, consist of:
  *data: Object - original row data
  *newData: Object - edited data
  *source: DataSource - table data source
  *confirm: Deferred - Deferred object with resolve(newData: Object) and reject() methods
  * @memberof FlatTableComponent FlatTableComponent - Have all setting of our resident smart table
  */
  onDeleteConfirm(event): void {
    this.flatService.deleteFlat(event);
    this.flatService.TotalFlatsInTable = this.flatService.TotalFlatsInTable - 1;
  }
  /**
   *If user will confirm that he wants to add a new flat,function will call
   *"postFlat" function that will make a post request to other localhost
   * @param {*} event event-Object, consist of:
   *data: Object - original row data
   *newData: Object - edited data
   *source: DataSource - table data source
   *confirm: Deferred - Deferred object with resolve(newData: Object) and reject() methods
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
  }
  /**
  *If user will confirm that he wants to change information about additional resident
  * function will call other function called "putFlat",that will send put request to our backend
  * @param {*} event event-Object, consist of:
  *data: Object - original row data
  *newData: Object - edited data
  *source: DataSource - table data source
  *confirm: Deferred - Deferred object with resolve(newData: Object) and reject() methods
  * @memberof ResidentTableComponent ResidentTableComponent - Have all setting of our resident smart table
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
  goBack(): void {
    this.location.back();
  }
  onUserRowSelect(event) {
    console.log('user row select: ', event.data.id);
    this.flatService.GetFlatResidents(event.data.id);

  }
  getFullList(): void {
    this.source.empty();
    this.source.load(this.flatService.flatList);
    this.flatService.TotalFlatsInTable = this.source.count();
    this.source.refresh();
  }
  loadLogic(id: number) {
    if (this.houseService.SourtedFlatList.length === 0 ||
      this.houseService.SourtedFlatList.length === null ||
      this.houseService.SourtedFlatList === []) {
      this.flatService.getFlatList().subscribe(resp => {
        this.flatService.flatList = resp.json();
        this.source.load(this.flatService.flatList);
        this.flatService.TotalFlatsInTable = this.source.count();
      });
    } else {
      this.source.load(this.houseService.SourtedFlatList);
      this.source.refresh();
    }
  }
}

