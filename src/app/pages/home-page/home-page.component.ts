import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  rediretToHouseTable() {
    this.router.navigate(['./pages/house/house-table']);
  }
  rediretToFlatTable() {
    this.router.navigate(['./pages/flat/flat-table']);
  }
  rediretToResidentTable() {
    this.router.navigate(['./pages/resident/resident-table']);
  }

}
