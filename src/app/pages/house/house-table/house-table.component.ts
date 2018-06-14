import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { HouseService } from '../House.service';
import { DataSource } from '../../../../../node_modules/ng2-smart-table/lib/data-source/data-source';
import { SmartTableService } from '../../../@core/data/smart-table.service';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { House } from '../house.module';

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
      deleteButtonContent: '<i class="nb-trash" (click)="justGettingHouses()"></i>',
      confirmDelete: true,
    },
    columns: {
      id: {
        title: 'ID',
        type: 'number',
      },
      street: {
        title: 'Street Name',
        type: 'string',
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
    },
  };
  data: any = [];
  source: LocalDataSource = new LocalDataSource();
  constructor(private houseService: HouseService, private http: Http) {
    this.houseService.getHouseList().subscribe(resp => {
      console.log(resp.json());
      this.houseService.houseList = resp.json();
      this.source.load(resp.json());
    });

    // var data = houseService.houseList; // data = undefined ;(
    // var data = houseService.GetHouse(); // same
    // this.source.load(data); // problem with this
    // this.source.load(houseService.houseList); // problem with this
    // this.source.load(data); // problem with this
  }
  onDelete(id: number) {
    this.houseService.deleteHouse(id)
      .subscribe(x => {
        this.houseService.getHouseList();
      })
  }
  justGettingHouses() {
    this.houseService.getHouseList();
  }
  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }


}
