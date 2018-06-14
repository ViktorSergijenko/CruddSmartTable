import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ResidentService } from '../resident.service';
import { DataSource } from '../../../../../node_modules/ng2-smart-table/lib/data-source/data-source';
import { SmartTableService } from '../../../@core/data/smart-table.service';
import { Resident } from '../resident.module';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
@Component({
  selector: 'app-resident-table',
  templateUrl: './resident-table.component.html',
  styles: [`
  nb-card {
    transform: translate3d(0, 0, 0);
  }
`],
})
export class ResidentTableComponent {
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
      flatid: {
        title: 'FlatId',
        type: 'number',
      },
    },
  };
  // source nasleduet nowij object klassa LocalDataSource,tem samim nasleduja vesj funkcional(budu ispolzovatj funkciju "load")...
  // dlja togo wtobi zagruzaitj svoi dannie v tablicu/
  source: LocalDataSource = new LocalDataSource();
  // v konstruktore ja sozdaju peremennuju kotoraja nasleduet klass HouseService(vesj Restfull Funkcional imenno tut)...
  constructor(private residentService: ResidentService, private http: Http) {
    // vipolnjaet funkciju getFlatList iz klassa FlatService,subskrajbit dlja togo wtobi snachala prowli...
    // vse dannie po zaprosu "GET" i kak tolko vse dannie prijdut,liw togda programma nachnot zasovivatj...
    // vse eti dannie(massiv tipa Flat),v peremennuju flatList
    this.residentService.getResidentList().subscribe((resp) => {
      this.residentService.residentList = resp.json();
      this.source.load(residentService.residentList);
    });
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      console.log(event.data);
      this.http.delete('http://localhost:52414/api/Resident/' + event.data.id).subscribe(res => {
      console.log(res);
      event.confirm.resolve(event.source.data);
    });
    } else {
      event.confirm.reject();
    }
  }
  onCreateConfirm(event): void {
    const data = {
      'id' : event.newData.id = 0,
      'firstname' : event.newData.firstname,
      'lastname' : event.newData.lastname,
      'postcode' :  event.newData.postcode,
      'phone' : event.newData.phone,
      'email' : event.newData.email,
      'flatid' : event.newData.flatid,
    };
    if (window.confirm('Are you sure you want to add a resident?')) {
    this.http.post('http://localhost:52414/api/Resident', data).subscribe(res => {
      console.log(res);
      event.confirm.resolve(event.newData);
    });
    } else {
      event.confirm.reject();
    }
  }
  onSaveConfirm(event): void {
    const data = {
      'id' : event.newData.id,
      'firstname' : event.newData.firstname,
      'lastname' : event.newData.lastname,
      'postcode' :  event.newData.postcode,
      'phone' : event.newData.phone,
      'email' : event.newData.email,
      'flatid' : event.newData.flatid,
    };
    if (window.confirm('Are you sure you want to update info about a resident?')) {
      this.http.put('http://localhost:52414/api/Resident/' + event.newData.id, data).subscribe(res => {
        console.log(res);
        event.confirm.resolve(event.newData);
      });
      } else {
        event.confirm.reject();
      }
  }
}

