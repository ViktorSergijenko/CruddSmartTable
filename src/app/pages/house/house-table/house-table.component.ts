import 'style-loader!angular2-toaster/toaster.css';

import { isNumeric } from 'rxjs/util/isNumeric';
import { Component, OnInit, ElementRef } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { HouseService } from '../house.service';
import { NgForm } from '@angular/forms';
import { House } from '../house.model';
import { ToasterService } from 'angular2-toaster';



@Component({
  selector: 'app-house-table',
  templateUrl: './house-table.component.html',
  styleUrls: ['../house.component.scss'],
})
export class HouseTableComponent implements OnInit {
  /**
   * Error string that came from server
   *
   * @type {string}
   * @memberof HouseTableComponent
   */
  errorFromServer: string;
  spaceForFilter = '   ';
  /**
   * Variable contains a flat object that we want to edit
   * @memberof HouseTableComponent
   */
  houseThatWeWantToChange: any;
  /**
   * Variable that will contain a numeric value that will be our amoint of houses
   * @type {number}
   * @memberof HouseTableComponent
   */
  totalAmountOfHosesInTable: number;
  /**
   * Variable will contain a House object that user will select
   * @type {House}
   * @memberof HouseTableComponent
   */
  selectedHouse: House;
  /**
   * Variable that responds for visability of our registration form
   * @type {boolean}
   * @memberof HouseTableComponent
   */
  registrationHouseFormVisible: boolean;
  /**
   * Variable that responds for visability of our edit form
   * @type {boolean}
   * @memberof HouseTableComponent
   */
  editHouseFormVisible: boolean;
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
  public internationalNumbers = [
    {
      'name': 'Afghanistan',
      'dial_code': '+93',
      'code': 'AF',
    },
    {
      'name': 'Albania',
      'dial_code': '+355',
      'code': 'AL',
    },
    {
      'name': 'Algeria',
      'dial_code': '+213',
      'code': 'DZ',
    },
    {
      'name': 'AmericanSamoa',
      'dial_code': '+1 684',
      'code': 'AS',
    },
    {
      'name': 'Andorra',
      'dial_code': '+376',
      'code': 'AD',
    },
    {
      'name': 'Angola',
      'dial_code': '+244',
      'code': 'AO',
    },
    {
      'name': 'Anguilla',
      'dial_code': '+1 264',
      'code': 'AI',
    },
    {
      'name': 'Antarctica',
      'dial_code': '+672',
      'code': 'AQ',
    },
    {
      'name': 'Antigua and Barbuda',
      'dial_code': '+1268',
      'code': 'AG',
    },
    {
      'name': 'Argentina',
      'dial_code': '+54',
      'code': 'AR',
    },
    {
      'name': 'Armenia',
      'dial_code': '+374',
      'code': 'AM',
    },
    {
      'name': 'Aruba',
      'dial_code': '+297',
      'code': 'AW',
    },
    {
      'name': 'Australia',
      'dial_code': '+61',
      'code': 'AU',
    },
    {
      'name': 'Austria',
      'dial_code': '+43',
      'code': 'AT',
    },
    {
      'name': 'Azerbaijan',
      'dial_code': '+994',
      'code': 'AZ',
    },
    {
      'name': 'Bahamas',
      'dial_code': '+1 242',
      'code': 'BS',
    },
    {
      'name': 'Bahrain',
      'dial_code': '+973',
      'code': 'BH',
    },
    {
      'name': 'Bangladesh',
      'dial_code': '+880',
      'code': 'BD',
    },
    {
      'name': 'Barbados',
      'dial_code': '+1 246',
      'code': 'BB',
    },
    {
      'name': 'Belarus',
      'dial_code': '+375',
      'code': 'BY',
    },
    {
      'name': 'Belgium',
      'dial_code': '+32',
      'code': 'BE',
    },
    {
      'name': 'Belize',
      'dial_code': '+501',
      'code': 'BZ',
    },
    {
      'name': 'Benin',
      'dial_code': '+229',
      'code': 'BJ',
    },
    {
      'name': 'Bermuda',
      'dial_code': '+1 441',
      'code': 'BM',
    },
    {
      'name': 'Bhutan',
      'dial_code': '+975',
      'code': 'BT',
    },
    {
      'name': 'Bolivia, Plurinational State of',
      'dial_code': '+591',
      'code': 'BO',
    },
    {
      'name': 'Bosnia and Herzegovina',
      'dial_code': '+387',
      'code': 'BA',
    },
    {
      'name': 'Botswana',
      'dial_code': '+267',
      'code': 'BW',
    },
    {
      'name': 'Brazil',
      'dial_code': '+55',
      'code': 'BR',
    },
    {
      'name': 'British Indian Ocean Territory',
      'dial_code': '+246',
      'code': 'IO',
    },
    {
      'name': 'Brunei Darussalam',
      'dial_code': '+673',
      'code': 'BN',
    },
    {
      'name': 'Bulgaria',
      'dial_code': '+359',
      'code': 'BG',
    },
    {
      'name': 'Burkina Faso',
      'dial_code': '+226',
      'code': 'BF',
    },
    {
      'name': 'Burundi',
      'dial_code': '+257',
      'code': 'BI',
    },
    {
      'name': 'Cambodia',
      'dial_code': '+855',
      'code': 'KH',
    },
    {
      'name': 'Cameroon',
      'dial_code': '+237',
      'code': 'CM',
    },
    {
      'name': 'Canada',
      'dial_code': '+1',
      'code': 'CA',
    },
    {
      'name': 'Cape Verde',
      'dial_code': '+238',
      'code': 'CV',
    },
    {
      'name': 'Cayman Islands',
      'dial_code': '+ 345',
      'code': 'KY',
    },
    {
      'name': 'Central African Republic',
      'dial_code': '+236',
      'code': 'CF',
    },
    {
      'name': 'Chad',
      'dial_code': '+235',
      'code': 'TD',
    },
    {
      'name': 'Chile',
      'dial_code': '+56',
      'code': 'CL',
    },
    {
      'name': 'China',
      'dial_code': '+86',
      'code': 'CN',
    },
    {
      'name': 'Christmas Island',
      'dial_code': '+61',
      'code': 'CX',
    },
    {
      'name': 'Cocos (Keeling) Islands',
      'dial_code': '+61',
      'code': 'CC',
    },
    {
      'name': 'Colombia',
      'dial_code': '+57',
      'code': 'CO',
    },
    {
      'name': 'Comoros',
      'dial_code': '+269',
      'code': 'KM',
    },
    {
      'name': 'Congo',
      'dial_code': '+242',
      'code': 'CG',
    },
    {
      'name': 'Congo, The Democratic Republic of the',
      'dial_code': '+243',
      'code': 'CD',
    },
    {
      'name': 'Cook Islands',
      'dial_code': '+682',
      'code': 'CK',
    },
    {
      'name': 'Costa Rica',
      'dial_code': '+506',
      'code': 'CR',
    },
    {
      'name': 'Cote d\'Ivoire',
      'dial_code': '+225',
      'code': 'CI',
    },
    {
      'name': 'Croatia',
      'dial_code': '+385',
      'code': 'HR',
    },
    {
      'name': 'Cuba',
      'dial_code': '+53',
      'code': 'CU',
    },
    {
      'name': 'Cyprus',
      'dial_code': '+537',
      'code': 'CY',
    },
    {
      'name': 'Czech Republic',
      'dial_code': '+420',
      'code': 'CZ',
    },
    {
      'name': 'Denmark',
      'dial_code': '+45',
      'code': 'DK',
    },
    {
      'name': 'Djibouti',
      'dial_code': '+253',
      'code': 'DJ',
    },
    {
      'name': 'Dominica',
      'dial_code': '+1 767',
      'code': 'DM',
    },
    {
      'name': 'Dominican Republic',
      'dial_code': '+1 849',
      'code': 'DO',
    },
    {
      'name': 'Ecuador',
      'dial_code': '+593',
      'code': 'EC',
    },
    {
      'name': 'Egypt',
      'dial_code': '+20',
      'code': 'EG',
    },
    {
      'name': 'El Salvador',
      'dial_code': '+503',
      'code': 'SV',
    },
    {
      'name': 'Equatorial Guinea',
      'dial_code': '+240',
      'code': 'GQ',
    },
    {
      'name': 'Eritrea',
      'dial_code': '+291',
      'code': 'ER',
    },
    {
      'name': 'Estonia',
      'dial_code': '+372',
      'code': 'EE',
    },
    {
      'name': 'Ethiopia',
      'dial_code': '+251',
      'code': 'ET',
    },
    {
      'name': 'Falkland Islands (Malvinas)',
      'dial_code': '+500',
      'code': 'FK',
    },
    {
      'name': 'Faroe Islands',
      'dial_code': '+298',
      'code': 'FO',
    },
    {
      'name': 'Fiji',
      'dial_code': '+679',
      'code': 'FJ',
    },
    {
      'name': 'Finland',
      'dial_code': '+358',
      'code': 'FI',
    },
    {
      'name': 'France',
      'dial_code': '+33',
      'code': 'FR',
    },
    {
      'name': 'French Guiana',
      'dial_code': '+594',
      'code': 'GF',
    },
    {
      'name': 'French Polynesia',
      'dial_code': '+689',
      'code': 'PF',
    },
    {
      'name': 'Gabon',
      'dial_code': '+241',
      'code': 'GA',
    },
    {
      'name': 'Gambia',
      'dial_code': '+220',
      'code': 'GM',
    },
    {
      'name': 'Georgia',
      'dial_code': '+995',
      'code': 'GE',
    },
    {
      'name': 'Germany',
      'dial_code': '+49',
      'code': 'DE',
    },
    {
      'name': 'Ghana',
      'dial_code': '+233',
      'code': 'GH',
    },
    {
      'name': 'Gibraltar',
      'dial_code': '+350',
      'code': 'GI',
    },
    {
      'name': 'Greece',
      'dial_code': '+30',
      'code': 'GR',
    },
    {
      'name': 'Greenland',
      'dial_code': '+299',
      'code': 'GL',
    },
    {
      'name': 'Grenada',
      'dial_code': '+1 473',
      'code': 'GD',
    },
    {
      'name': 'Guadeloupe',
      'dial_code': '+590',
      'code': 'GP',
    },
    {
      'name': 'Guam',
      'dial_code': '+1 671',
      'code': 'GU',
    },
    {
      'name': 'Guatemala',
      'dial_code': '+502',
      'code': 'GT',
    },
    {
      'name': 'Guernsey',
      'dial_code': '+44',
      'code': 'GG',
    },
    {
      'name': 'Guinea',
      'dial_code': '+224',
      'code': 'GN',
    },
    {
      'name': 'Guinea-Bissau',
      'dial_code': '+245',
      'code': 'GW',
    },
    {
      'name': 'Guyana',
      'dial_code': '+595',
      'code': 'GY',
    },
    {
      'name': 'Haiti',
      'dial_code': '+509',
      'code': 'HT',
    },
    {
      'name': 'Holy See (Vatican City State)',
      'dial_code': '+379',
      'code': 'VA',
    },
    {
      'name': 'Honduras',
      'dial_code': '+504',
      'code': 'HN',
    },
    {
      'name': 'Hong Kong',
      'dial_code': '+852',
      'code': 'HK',
    },
    {
      'name': 'Hungary',
      'dial_code': '+36',
      'code': 'HU',
    },
    {
      'name': 'Iceland',
      'dial_code': '+354',
      'code': 'IS',
    },
    {
      'name': 'India',
      'dial_code': '+91',
      'code': 'IN',
    },
    {
      'name': 'Indonesia',
      'dial_code': '+62',
      'code': 'ID',
    },
    {
      'name': 'Iran, Islamic Republic of',
      'dial_code': '+98',
      'code': 'IR',
    },
    {
      'name': 'Iraq',
      'dial_code': '+964',
      'code': 'IQ',
    },
    {
      'name': 'Ireland',
      'dial_code': '+353',
      'code': 'IE',
    },
    {
      'name': 'Isle of Man',
      'dial_code': '+44',
      'code': 'IM',
    },
    {
      'name': 'Israel',
      'dial_code': '+972',
      'code': 'IL',
    },
    {
      'name': 'Italy',
      'dial_code': '+39',
      'code': 'IT',
    },
    {
      'name': 'Jamaica',
      'dial_code': '+1 876',
      'code': 'JM',
    },
    {
      'name': 'Japan',
      'dial_code': '+81',
      'code': 'JP',
    },
    {
      'name': 'Jersey',
      'dial_code': '+44',
      'code': 'JE',
    },
    {
      'name': 'Jordan',
      'dial_code': '+962',
      'code': 'JO',
    },
    {
      'name': 'Kazakhstan',
      'dial_code': '+7 7',
      'code': 'KZ',
    },
    {
      'name': 'Kenya',
      'dial_code': '+254',
      'code': 'KE',
    },
    {
      'name': 'Kiribati',
      'dial_code': '+686',
      'code': 'KI',
    },
    {
      'name': 'Korea, Democratic People\'s Republic of',
      'dial_code': '+850',
      'code': 'KP',
    },
    {
      'name': 'Korea, Republic of',
      'dial_code': '+82',
      'code': 'KR',
    },
    {
      'name': 'Kuwait',
      'dial_code': '+965',
      'code': 'KW',
    },
    {
      'name': 'Kyrgyzstan',
      'dial_code': '+996',
      'code': 'KG',
    },
    {
      'name': 'Lao People\'s Democratic Republic',
      'dial_code': '+856',
      'code': 'LA',
    },
    {
      'name': 'Latvia',
      'dial_code': '+371',
      'code': 'LV',
    },
    {
      'name': 'Lebanon',
      'dial_code': '+961',
      'code': 'LB',
    },
    {
      'name': 'Lesotho',
      'dial_code': '+266',
      'code': 'LS',
    },
    {
      'name': 'Liberia',
      'dial_code': '+231',
      'code': 'LR',
    },
    {
      'name': 'Libyan Arab Jamahiriya',
      'dial_code': '+218',
      'code': 'LY',
    },
    {
      'name': 'Liechtenstein',
      'dial_code': '+423',
      'code': 'LI',
    },
    {
      'name': 'Lithuania',
      'dial_code': '+370',
      'code': 'LT',
    },
    {
      'name': 'Luxembourg',
      'dial_code': '+352',
      'code': 'LU',
    },
    {
      'name': 'Macao',
      'dial_code': '+853',
      'code': 'MO',
    },
    {
      'name': 'Macedonia, The Former Yugoslav Republic of',
      'dial_code': '+389',
      'code': 'MK',
    },
    {
      'name': 'Madagascar',
      'dial_code': '+261',
      'code': 'MG',
    },
    {
      'name': 'Malawi',
      'dial_code': '+265',
      'code': 'MW',
    },
    {
      'name': 'Malaysia',
      'dial_code': '+60',
      'code': 'MY',
    },
    {
      'name': 'Maldives',
      'dial_code': '+960',
      'code': 'MV',
    },
    {
      'name': 'Mali',
      'dial_code': '+223',
      'code': 'ML',
    },
    {
      'name': 'Malta',
      'dial_code': '+356',
      'code': 'MT',
    },
    {
      'name': 'Marshall Islands',
      'dial_code': '+692',
      'code': 'MH',
    },
    {
      'name': 'Martinique',
      'dial_code': '+596',
      'code': 'MQ',
    },
    {
      'name': 'Mauritania',
      'dial_code': '+222',
      'code': 'MR',
    },
    {
      'name': 'Mauritius',
      'dial_code': '+230',
      'code': 'MU',
    },
    {
      'name': 'Mayotte',
      'dial_code': '+262',
      'code': 'YT',
    },
    {
      'name': 'Mexico',
      'dial_code': '+52',
      'code': 'MX',
    },
    {
      'name': 'Micronesia, Federated States of',
      'dial_code': '+691',
      'code': 'FM',
    },
    {
      'name': 'Moldova, Republic of',
      'dial_code': '+373',
      'code': 'MD',
    },
    {
      'name': 'Monaco',
      'dial_code': '+377',
      'code': 'MC',
    },
    {
      'name': 'Mongolia',
      'dial_code': '+976',
      'code': 'MN',
    },
    {
      'name': 'Montenegro',
      'dial_code': '+382',
      'code': 'ME',
    },
    {
      'name': 'Montserrat',
      'dial_code': '+1664',
      'code': 'MS',
    },
    {
      'name': 'Morocco',
      'dial_code': '+212',
      'code': 'MA',
    },
    {
      'name': 'Mozambique',
      'dial_code': '+258',
      'code': 'MZ',
    },
    {
      'name': 'Myanmar',
      'dial_code': '+95',
      'code': 'MM',
    },
    {
      'name': 'Namibia',
      'dial_code': '+264',
      'code': 'NA',
    },
    {
      'name': 'Nauru',
      'dial_code': '+674',
      'code': 'NR',
    },
    {
      'name': 'Nepal',
      'dial_code': '+977',
      'code': 'NP',
    },
    {
      'name': 'Netherlands',
      'dial_code': '+31',
      'code': 'NL',
    },
    {
      'name': 'Netherlands Antilles',
      'dial_code': '+599',
      'code': 'AN',
    },
    {
      'name': 'New Caledonia',
      'dial_code': '+687',
      'code': 'NC',
    },
    {
      'name': 'New Zealand',
      'dial_code': '+64',
      'code': 'NZ',
    },
    {
      'name': 'Nicaragua',
      'dial_code': '+505',
      'code': 'NI',
    },
    {
      'name': 'Niger',
      'dial_code': '+227',
      'code': 'NE',
    },
    {
      'name': 'Nigeria',
      'dial_code': '+234',
      'code': 'NG',
    },
    {
      'name': 'Niue',
      'dial_code': '+683',
      'code': 'NU',
    },
    {
      'name': 'Norfolk Island',
      'dial_code': '+672',
      'code': 'NF',
    },
    {
      'name': 'Northern Mariana Islands',
      'dial_code': '+1 670',
      'code': 'MP',
    },
    {
      'name': 'Norway',
      'dial_code': '+47',
      'code': 'NO',
    },
    {
      'name': 'Oman',
      'dial_code': '+968',
      'code': 'OM',
    },
    {
      'name': 'Pakistan',
      'dial_code': '+92',
      'code': 'PK',
    },
    {
      'name': 'Palau',
      'dial_code': '+680',
      'code': 'PW',
    },
    {
      'name': 'Palestinian Territory, Occupied',
      'dial_code': '+970',
      'code': 'PS',
    },
    {
      'name': 'Panama',
      'dial_code': '+507',
      'code': 'PA',
    },
    {
      'name': 'Papua New Guinea',
      'dial_code': '+675',
      'code': 'PG',
    },
    {
      'name': 'Paraguay',
      'dial_code': '+595',
      'code': 'PY',
    },
    {
      'name': 'Peru',
      'dial_code': '+51',
      'code': 'PE',
    },
    {
      'name': 'Philippines',
      'dial_code': '+63',
      'code': 'PH',
    },
    {
      'name': 'Pitcairn',
      'dial_code': '+872',
      'code': 'PN',
    },
    {
      'name': 'Poland',
      'dial_code': '+48',
      'code': 'PL',
    },
    {
      'name': 'Portugal',
      'dial_code': '+351',
      'code': 'PT',
    },
    {
      'name': 'Puerto Rico',
      'dial_code': '+1 939',
      'code': 'PR',
    },
    {
      'name': 'Qatar',
      'dial_code': '+974',
      'code': 'QA',
    },
    {
      'name': 'Romania',
      'dial_code': '+40',
      'code': 'RO',
    },
    {
      'name': 'Russia',
      'dial_code': '+7',
      'code': 'RU',
    },
    {
      'name': 'Rwanda',
      'dial_code': '+250',
      'code': 'RW',
    },
    {
      'name': 'Réunion',
      'dial_code': '+262',
      'code': 'RE',
    },
    {
      'name': 'Saint Barthélemy',
      'dial_code': '+590',
      'code': 'BL',
    },
    {
      'name': 'Saint Helena, Ascension and Tristan Da Cunha',
      'dial_code': '+290',
      'code': 'SH',
    },
    {
      'name': 'Saint Kitts and Nevis',
      'dial_code': '+1 869',
      'code': 'KN',
    },
    {
      'name': 'Saint Lucia',
      'dial_code': '+1 758',
      'code': 'LC',
    },
    {
      'name': 'Saint Martin',
      'dial_code': '+590',
      'code': 'MF',
    },
    {
      'name': 'Saint Pierre and Miquelon',
      'dial_code': '+508',
      'code': 'PM',
    },
    {
      'name': 'Saint Vincent and the Grenadines',
      'dial_code': '+1 784',
      'code': 'VC',
    },
    {
      'name': 'Samoa',
      'dial_code': '+685',
      'code': 'WS',
    },
    {
      'name': 'San Marino',
      'dial_code': '+378',
      'code': 'SM',
    },
    {
      'name': 'Sao Tome and Principe',
      'dial_code': '+239',
      'code': 'ST',
    },
    {
      'name': 'Saudi Arabia',
      'dial_code': '+966',
      'code': 'SA',
    },
    {
      'name': 'Senegal',
      'dial_code': '+221',
      'code': 'SN',
    },
    {
      'name': 'Serbia',
      'dial_code': '+381',
      'code': 'RS',
    },
    {
      'name': 'Seychelles',
      'dial_code': '+248',
      'code': 'SC',
    },
    {
      'name': 'Sierra Leone',
      'dial_code': '+232',
      'code': 'SL',
    },
    {
      'name': 'Singapore',
      'dial_code': '+65',
      'code': 'SG',
    },
    {
      'name': 'Slovakia',
      'dial_code': '+421',
      'code': 'SK',
    },
    {
      'name': 'Slovenia',
      'dial_code': '+386',
      'code': 'SI',
    },
    {
      'name': 'Solomon Islands',
      'dial_code': '+677',
      'code': 'SB',
    },
    {
      'name': 'Somalia',
      'dial_code': '+252',
      'code': 'SO',
    },
    {
      'name': 'South Africa',
      'dial_code': '+27',
      'code': 'ZA',
    },
    {
      'name': 'South Georgia and the South Sandwich Islands',
      'dial_code': '+500',
      'code': 'GS',
    },
    {
      'name': 'Spain',
      'dial_code': '+34',
      'code': 'ES',
    },
    {
      'name': 'Sri Lanka',
      'dial_code': '+94',
      'code': 'LK',
    },
    {
      'name': 'Sudan',
      'dial_code': '+249',
      'code': 'SD',
    },
    {
      'name': 'Suriname',
      'dial_code': '+597',
      'code': 'SR',
    },
    {
      'name': 'Svalbard and Jan Mayen',
      'dial_code': '+47',
      'code': 'SJ',
    },
    {
      'name': 'Swaziland',
      'dial_code': '+268',
      'code': 'SZ',
    },
    {
      'name': 'Sweden',
      'dial_code': '+46',
      'code': 'SE',
    },
    {
      'name': 'Switzerland',
      'dial_code': '+41',
      'code': 'CH',
    },
    {
      'name': 'Syrian Arab Republic',
      'dial_code': '+963',
      'code': 'SY',
    },
    {
      'name': 'Taiwan, Province of China',
      'dial_code': '+886',
      'code': 'TW',
    },
    {
      'name': 'Tajikistan',
      'dial_code': '+992',
      'code': 'TJ',
    },
    {
      'name': 'Tanzania, United Republic of',
      'dial_code': '+255',
      'code': 'TZ',
    },
    {
      'name': 'Thailand',
      'dial_code': '+66',
      'code': 'TH',
    },
    {
      'name': 'Timor-Leste',
      'dial_code': '+670',
      'code': 'TL',
    },
    {
      'name': 'Togo',
      'dial_code': '+228',
      'code': 'TG',
    },
    {
      'name': 'Tokelau',
      'dial_code': '+690',
      'code': 'TK',
    },
    {
      'name': 'Tonga',
      'dial_code': '+676',
      'code': 'TO',
    },
    {
      'name': 'Trinidad and Tobago',
      'dial_code': '+1 868',
      'code': 'TT',
    },
    {
      'name': 'Tunisia',
      'dial_code': '+216',
      'code': 'TN',
    },
    {
      'name': 'Turkey',
      'dial_code': '+90',
      'code': 'TR',
    },
    {
      'name': 'Turkmenistan',
      'dial_code': '+993',
      'code': 'TM',
    },
    {
      'name': 'Turks and Caicos Islands',
      'dial_code': '+1 649',
      'code': 'TC',
    },
    {
      'name': 'Tuvalu',
      'dial_code': '+688',
      'code': 'TV',
    },
    {
      'name': 'Uganda',
      'dial_code': '+256',
      'code': 'UG',
    },
    {
      'name': 'Ukraine',
      'dial_code': '+380',
      'code': 'UA',
    },
    {
      'name': 'United Arab Emirates',
      'dial_code': '+971',
      'code': 'AE',
    },
    {
      'name': 'United Kingdom',
      'dial_code': '+44',
      'code': 'GB',
    },
    {
      'name': 'United States',
      'dial_code': '+1',
      'code': 'US',
    },
    {
      'name': 'Uruguay',
      'dial_code': '+598',
      'code': 'UY',
    },
    {
      'name': 'Uzbekistan',
      'dial_code': '+998',
      'code': 'UZ',
    },
    {
      'name': 'Vanuatu',
      'dial_code': '+678',
      'code': 'VU',
    },
    {
      'name': 'Venezuela, Bolivarian Republic of',
      'dial_code': '+58',
      'code': 'VE',
    },
    {
      'name': 'Viet Nam',
      'dial_code': '+84',
      'code': 'VN',
    },
    {
      'name': 'Virgin Islands, British',
      'dial_code': '+1 284',
      'code': 'VG',
    },
    {
      'name': 'Virgin Islands, U.S.',
      'dial_code': '+1 340',
      'code': 'VI',
    },
    {
      'name': 'Wallis and Futuna',
      'dial_code': '+681',
      'code': 'WF',
    },
    {
      'name': 'Yemen',
      'dial_code': '+967',
      'code': 'YE',
    },
    {
      'name': 'Zambia',
      'dial_code': '+260',
      'code': 'ZM',
    },
    {
      'name': 'Zimbabwe',
      'dial_code': '+263',
      'code': 'ZW',
    },
    {
      'name': 'Åland Islands',
      'dial_code': '+358',
      'code': 'AX',
    },
  ];
  public elementRef;

  /**
   * Ng2 smart table settings.
   * @memberof HouseTableComponent
   */
  settings = {
    mode: 'external',
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      create: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: false,
    },
    columns: {
      street: {
        title: 'Street Name',
        type: 'string',
      },
      number: {
        title: 'House Number',
        type: 'number',
      },
      floors: {
        title: 'Floors',
        type: 'number',
      },
      city: {
        title: 'city',
        type: 'string',
      },
      country: {
        title: 'Country',
        type: 'string',
      },
      postIndex: {
        title: 'P.Index',
        type: 'string',
      },
      flatAmount: {
        editable: false,
        addable: false,
        title: 'Flat Amount',
        type: 'Flat',
      },
      actions:
      {
        filter: false,
        addable: false,
        editable: false,
        title: 'House Details',
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return `<a title ="See Detail House" href="#/pages/flat/flat-table/${row.id}"><i class=""material-icons">Details</i></a>`;
        },
        id: {
          title: 'ID',
          type: 'number',
        },
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  /**
   * Creates an instance of HouseTableComponent new House Object,  
   * Then constructor sends a get request to the server,loads all objects that we get in to our table and counts it amount
   * @param {HouseService} houseService - Includes all variables and functions to make crud requests on server
   * @param {ActivatedRoute} route  Activated aka current route
   * @param {ToasterService} toasterService - Notification service (toasts)
   * @memberof HouseTableComponent
   */
  constructor(
    myElement: ElementRef,
    private houseService: HouseService,

    private toasterService: ToasterService,
  ) {
    this.selectedHouse = new House();
    this.elementRef = myElement;
  }

  ngOnInit() {

    // Getting all houses from server and loading them in to the table and count their amount
    this.houseService.getHouseList().subscribe(Houses => {
      // Loading house objects in to ng2 smart table.
      this.source.load(Houses);
      // Counting amount of houses in table.
      this.totalAmountOfHosesInTable = this.source.count();
    });

  }
  /**
   * Function deletes a house Object.
   * @param {*} event  event- Ng2 Smart table event object which contains row data
   * @memberof HouseTableComponent
   */
  deleteHouseFromTable(event): void {
    this.houseService.deleteHouse(event).subscribe(() => {
      this.source.remove(event.data);
      this.totalAmountOfHosesInTable--;
    });
  }
  /**
   * Method opens new house registration form
   * @memberof HouseTableComponent
   */
  openHouseRegistrationForm(): void {
    // If user will click on 'Plus' button it will open registration form
    this.registrationHouseFormVisible = true; // If RegistrationHouseForm value is true, then it will be shown
  }
  /**
  * Method opens a House edit form.
  * @param {*} event event- Ng2 Smart table event object which contains row data
  * @memberof HouseTableComponent
  */
  openHouseEditForm(event): void {
    this.houseThatWeWantToChange = event;

    this.selectedHouse = Object.assign({}, event.data); // This will send all values that has our object that we want to edit to our form
    // If user will click on 'pencil' button, it will open edit form
    this.query = this.selectedHouse.country;
    this.editHouseFormVisible = true; // If EditHouseForm value is not 0, then it will be shown
  }

  /**
   * Function will close registration or edit form in house table,  
   * Used on button in forms
   * @param {NgForm} [form]  Property says on what form will be used this function
   * @memberof HouseTableComponent
   */

  closeHouseRegistrationOrEditForm(form: NgForm): void {
    this.resetForm(form);
    this.registrationHouseFormVisible = false;
    this.editHouseFormVisible = false;
  }

  /**
   * Function  resets House object values in form
   * @param {NgForm} [form] Form-this property will say on what form will be used this function
   * @memberof HouseTableComponent
   */

  resetForm(form: NgForm) {
    if (form !== null) {
      form.reset();
      this.query = '';
      this.selectedHouse = new House();
    }
  }
  /**
   * Method adds a new house,or edits house vaules,depends in what from you are working.
   * @param {NgForm} form form - paramater that will be our form that we use
   * @memberof HouseTableComponent
   */
  onSubmit(form: NgForm) {
    if (!form.value.id) {
      this.submitToAddNewHouse(form);
    } else {
      this.submitToEditHouseValues(form);
    }

  }
  /**
   * Clicking on submit button in Registration form, function edits a house object
   * @param {NgForm} form Form values
   * @memberof HouseTableComponent
   */

  submitToEditHouseValues(form: NgForm) {
    this.houseService.editHouse(form.value.id, form.value)
      .subscribe(editedHouse => { // Sending a put request to edit a house values in server
        this.source.update(this.houseThatWeWantToChange.data, editedHouse); // Modifying our  house object values in table
        this.resetForm(form); // Reseting form values
        this.toasterService.popAsync('Record updated', 'House info was changed');
      }, (err) => { // If we reaceave an error from server
        console.log(err);
        console.log(err.text());

        this.errorFromServer = err.text(); // We will put a message from error to our local variable 'errorFromServer'
        // And toastr will notify user with this error message
        this.toasterService.popAsync('error', 'Custom error in component', this.errorFromServer);
      },
    );
  }
  /**
   * Clicking on submit button in Edit form, function adds a new house
   * @param {NgForm} form Form values.
   * @memberof HouseTableComponent
   */

  submitToAddNewHouse(form: NgForm) {
    this.houseService.addHouse(form.value).subscribe(newHouse => { // Sending a post request to add a new house in server
      this.source.prepend(newHouse); // Adding new house in our table
      this.resetForm(form); // Reseting form values
      this.totalAmountOfHosesInTable = this.source.count(); // Counting amount of houses in our table.
      this.toasterService.popAsync('success', 'House was added'); // If house was successfully added,then user will reaceave a toastr message
    }, (err) => { // If we reaceave an error from server
      console.log(err);
      console.log(err.text());
      this.errorFromServer = err.text(); // We will put a message from error to our local variable 'errorFromServer'
      // And toastr will notify user with this error message
      this.toasterService.popAsync('error', 'Custom error in component', this.errorFromServer);
    });
  }
  filter() {
    if (this.query !== '') {
      if (isNumeric(this.query) === true) {
        this.filteredList = this.internationalNumbers.filter(function (el) {
          return el.dial_code.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
        }.bind(this));
        console.log('Number' + this.filteredList);
      } else {
        this.filteredList = this.internationalNumbers.filter(function (el) {
          return el.name.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
        }.bind(this));
        console.log('nonumber' + this.filteredList);
      }

    } else {
      this.filteredList = [];
    }
  }

  select(item) {
    this.query = item.dial_code;
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


