import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">House editor by some dude, that does not know what he is doing d^_^b
    <br><b>Made without Jquery,sms and registration.</b></span>
    <div class="socials">
      <a href="https://github.com/ViktorSergijenko/CruddSmartTable" target="_blank" class="ion ion-social-github"></a>
    </div>
  `,
})
export class FooterComponent {
}
