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
export class FlatTableComponent  {
// vesj html(kak vigljadjat i nazivajutsja nawi polja i td,vsja eta infa sazovivaetsja v peremennuju "settings")
settings = {
  add: {
    addButtonContent: '<i class="nb-plus"></i>',
    createButtonContent: '<i class="nb-checkmark"></i>',
    cancelButtonContent: '<i class="nb-close"></i>',
  },
  edit: {
    editButtonContent: '<i class="nb-edit"></i>',
    saveButtonContent: '<i class="nb-checkmark"></i>',
    cancelButtonContent: '<i class="nb-close"></i>',
  },
  delete: {
    deleteButtonContent: '<i class="nb-trash"></i>',
    confirmDelete: true,
  },
  columns: {
    id: {
      title: 'ID',
      type: 'number',
    },
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
      type: 'number',
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
    console.log(resp.json());
    this.flatService.flatList = resp.json();
    this.source.load(flatService.flatList);
    })

  }
  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
}
