import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [

  {
    title: 'FEATURES',
    group: true,
  },

  {
    title: 'House',
    icon: 'nb-home',
    children: [
      {
        title: 'House',
        link: '/pages/house/house-table',
      },
    ],
  },

];
