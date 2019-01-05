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
  {
    title: 'Flat',
    icon: 'nb-roller-shades',
    children: [
      {
        title: 'Flat',
        link: '/pages/flat/flat-table',
      },
    ],
  },
  {
    title: 'Resident',
    icon: 'nb-person',
    children: [
      {
        title: 'Resident',
        link: '/pages/resident/resident-table',
      },
    ],
  },
];
