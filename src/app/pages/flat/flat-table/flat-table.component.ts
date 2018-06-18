import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { FlatService } from '../flat.service';
import { DataSource } from '../../../../../node_modules/ng2-smart-table/lib/data-source/data-source';
import { SmartTableService } from '../../../@core/data/smart-table.service';
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
  // vesj html(kak vigljadjat i nazivajutsja nawi polja i td,vsja eta infa sazovivaetsja v peremennuju "settings")
  settings = {
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
      houseid: {
        title: 'HouseId',
        type: 'html',
        editor: {
          type: 'list',
          config: {
            list: this.flatService.flatHouseIdList,
          },
        },
      },
    },
  };
  // source nasleduet nowij object klassa LocalDataSource,tem samim nasleduja vesj funkcional(budu ispolzovatj funkciju "load")...
  // dlja togo wtobi zagruzaitj svoi dannie v tablicu/
  source: LocalDataSource = new LocalDataSource();
  // v konstruktore ja sozdaju peremennuju kotoraja nasleduet klass HouseService(vesj Restfull Funkcional imenno tut)...
  constructor(private flatService: FlatService) {
    // vipolnjaet funkciju getFlatList iz klassa FlatService,subskrajbit dlja togo wtobi snachala prowli...
    // vse dannie po zaprosu "GET" i kak tolko vse dannie prijdut,liw togda programma nachnot zasovivatj...
    // vse eti dannie(massiv tipa Flat),v peremennuju flatList
    this.flatService.getFlatList().subscribe(resp => {
      this.flatService.flatList = resp.json();
      this.source.load(flatService.flatList);
    });
    const options = [];
    this.flatService.getHouseIds().subscribe(resp => {
      this.flatService.houseList = resp.json();


      for (let index = 0; index < this.flatService.houseList.length; index++) {
        this.flatService.flatHouseIdList.push(this.flatService.houseList[index].id);

        options.push({ value: this.flatService.houseList[index].id, title: this.flatService.houseList[index].id });

        this.settings.columns.houseid.editor.config.list = options;
        this.settings = Object.assign({}, this.settings);
      }

      console.log(options);
    });

  }
  /**
  *If user will confirm that he wants to delete additional resident,
  *then this function will call "deleteResident" fucntion that will make a delete request
  *
  * @param {*} event - event-Object, consist of:
 data: Object - original row data
 newData: Object - edited data
 source: DataSource - table data source
 confirm: Deferred - Deferred object with resolve(newData: Object) and reject() methods
  * @memberof ResidentTableComponent ResidentTableComponent - Have all setting of our resident smart table
  */
  onDeleteConfirm(event): void {
    this.flatService.deleteFlat(event);
  }
  /**
   *If user will confirm that he wants to add a new resident,function will call
   *"postResident" function that will make a post request to other localhost
   * @param {*} event event-Object, consist of:
  data: Object - original row data
  newData: Object - edited data
  source: DataSource - table data source
  confirm: Deferred - Deferred object with resolve(newData: Object) and reject() methods
   * @memberof ResidentTableComponent ResidentTableComponent - Have all setting of our resident smart table
   */
  onCreateConfirm(event): void {
    const data = {
      'id': event.newData.id = 0,
      'number': event.newData.number,
      'totalarea': event.newData.totalarea,
      'livingspace': event.newData.livingspace,
      'phone': event.newData.phone,
      'houseid': event.newData.houseid,
    };
    this.flatService.postFlat(event, data);
  }
  /**
  *If user will confirm that he wants to change information about additional resident
  * function will call other function called "putResident",that will send put request to our backend
  * @param {*} event event-Object, consist of:
  data: Object - original row data
  newData: Object - edited data
  source: DataSource - table data source
  confirm: Deferred - Deferred object with resolve(newData: Object) and reject() methods
  * @memberof ResidentTableComponent ResidentTableComponent - Have all setting of our resident smart table
  */
  onSaveConfirm(event): void {
    const data = {
      'id': event.newData.id,
      'number': event.newData.number,
      'totalarea': event.newData.totalarea,
      'livingspace': event.newData.livingspace,
      'phone': event.newData.phone,
      'houseid': event.newData.houseid,
    };
    this.flatService.putFlat(event, data);
  }
}

