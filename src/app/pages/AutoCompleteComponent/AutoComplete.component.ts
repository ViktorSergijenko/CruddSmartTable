import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-autocompletecomponent',
  templateUrl: './AutoCompleteComponent.component.html',
  host: {
    '(document:click)': 'handleClick($event)',
  },

})
export class AutoCompleteComponent {
  public query = '';
  public countries = [
    'Albania', 'Andorra', 'Armenia', 'Austria', 'Azerbaijan', 'Belarus',

    'Belgium', 'Bosnia & Herzegovina', 'Bulgaria', 'Croatia', 'Cyprus',

    'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Georgia',

    'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Italy', 'Kosovo',

    'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Malta',

    'Moldova', 'Monaco', 'Montenegro', 'Netherlands', 'Norway', 'Poland',

    'Portugal', 'Romania', 'Russia', 'San Marino', 'Serbia', 'Slovakia', 'Slovenia',

    'Spain', 'Sweden', 'Switzerland', 'Turkey', 'Ukraine', 'United Kingdom', 'Vatican city'];
  public filteredList = [];
  public elementRef;
  constructor(myElement: ElementRef) {
    this.elementRef = myElement;
  }

  filter() {
    if (this.query !== '') {
      this.filteredList = this.countries.filter(function (el) {
        return el.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
      }.bind(this));
    } else {
      this.filteredList = [];
    }
  }

  select(item) {
    this.query = item;
    this.filteredList = [];
  }
  handleClick(event) {
    let clickedComponent = event.target;
    let inside = false;
    do {
      if (clickedComponent === this.elementRef.nativeElement) {
        inside = true;
      }
      clickedComponent = clickedComponent.parentNode;
    } while (clickedComponent);
    if (!inside) {
      this.filteredList = [];
    }
  }
}
