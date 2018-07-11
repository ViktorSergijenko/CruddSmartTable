import { NbMenuService } from '@nebular/theme';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ngx-not-found',
  styleUrls: ['./not-found.component.scss'],
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent {

  constructor(private menuService:
    NbMenuService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  goToHome() {
    this.router.navigate(['/pages/house/house-table'], { relativeTo: this.route });
  }
}
