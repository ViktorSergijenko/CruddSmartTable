import { isNumeric } from 'rxjs/util/isNumeric';
import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ResidentService } from '../resident.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FlatService } from '../../flat/flat.service';
import { Resident } from '../resident.model';
import { NgForm, FormGroup } from '@angular/forms';
import 'rxjs/add/operator/take';


import { ToasterService } from 'angular2-toaster';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-resident-table',
  templateUrl: './resident-table.component.html',
  styleUrls: ['./resident-table.component.scss'],
})
export class ResidentTableComponent implements OnInit {
  public query = '';
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

  /**
   * Variable that will contain one of Id's of a flat,that will come with params from route.
   * @type {number}
   * @memberof ResidentTableComponent
   */
  additionalFlatId: any = null;
  /**
   * Variable that contains an error text.
   * @type {string}
   * @memberof ResidentTableComponent
   */
  errorFromServer: string = '';

  /**
   * Variable that will contain a Resident object that we want to change.
   * @memberof ResidentTableComponent
   */
  residentThatWeWantToChange;
  /**
   * Variable that will contain a Resident object that we selected.
   * @type {Resident}
   * @memberof ResidentTableComponent
   */
  selectedResident: Resident;
  /**
   * Property that will contain amount of all flats as numeric value.
   * @type {number}
   * @memberof ResidentTableComponent
   */
  totalResidentsInAllFlats: number;
  /**
   * Property that will contain amount of a specific flat as numeric value.
   * @type {number}
   * @memberof ResidentTableComponent
   */
  totalResidentsInAdditionalFlat: number;
  /**
   * Array that will contain a specific residents objects.
   * @type {Resident[]}
   * @memberof ResidentTableComponent
   */
  sourtedResidents: Resident[] = [];
  /**
   * Property(variable) that responds for Registration form visability.
   * @type {boolean}
   * @memberof ResidentTableComponent
   */
  residentRegFormVisable: boolean;
  /**
   * Property(variable) that responds for Edit form visability.
   * @type {boolean}
   * @memberof ResidentTableComponent
   */
  residentEditFormVisable: boolean;
  selectedFlat: number;
  /**
   * Settings is a ng2 smart table property where we can set all needed setings for our table(columns names,actions.....)
   * @memberof ResidentTableComponent
   */
  settings = {
    mode: 'external',
    noDataMessage: 'Sorry, but there is no Residents in this house,if you want to watch all Residents,Press GO TO RESIDENT LIST button ',
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
      firstName: {
        title: 'First Name',
        type: 'string',
      },
      lastName: {
        title: 'Last Name',
        type: 'string',
      },
      postCode: {
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
    },
  };


  source: LocalDataSource = new LocalDataSource();

  constructor(
    private residentService: ResidentService,
    private flatService: FlatService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,

    private toasterService: ToasterService,
  ) {
    document.addEventListener('click', (evt) => {
      const flyoutElement = document.getElementById('interPhones');
      let targetElement = evt.srcElement;

      do {
        if (targetElement === flyoutElement) {
          this.filter();
          return;
        }
        // Go up the DOMs
        targetElement = targetElement.parentElement;
      } while (targetElement);

      // This is a click outside.
      this.filteredList = [];
    });
    this.residentEditFormVisable = null; // Using this in constructor,to make Edit form Invisible at the beggining.
    this.residentRegFormVisable = null;  // Using this in constructor,to make Registration form Invisible at the beggining.
  }
  ngOnInit() {
    this.gettingFlatIdFromRoute(); // First we get a flat id,to ensure that we will load exactly those residents that we want to load.
    // Also there can be  cases when there can be no flat id in our Route.
    if (!this.additionalFlatId || this.additionalFlatId === 'all') { // If we dont have flat id.
      this.loadAllResidentsInTableAndCountThem(); // Then we will load all residents in to our table.
    } else { // If we have flat id.
      this.loadAdditionalHouseFlatsAndCountThem(); // Then we will load only those resdients,that are located ...
      // In flat that id is equal to "additionalFlatId" value.
    }
  }

  /**
   * Function gets Flat id value from route params.
   * @memberof ResidentTableComponent
   */
  gettingFlatIdFromRoute() {
    // Getting a route param from our routing.
    this.route.params.subscribe((params: any) => {
      this.additionalFlatId = params.id; // Putting this route param in to our locate variable "additionalFlatId".
      this.selectedResident = new Resident(this.additionalFlatId); // Using additionalFlatId variable in Resident object constructor.
      this.sourtedResidents = []; // To avoid problems with table loading, we clear all that could be in our sourtedResidents array.
    });
  }

  /**
   * Function will load all existing residents to our table,and count their amount.
   * @memberof ResidentTableComponent
   */
  loadAllResidentsInTableAndCountThem() {
    // Getting all residents from server.
    if (!this.additionalFlatId || this.additionalFlatId === 'all') {
      this.residentService.getResidentList().subscribe(residents => {
        this.source.load(residents); // Loading this residents in to our table.
        this.totalResidentsInAllFlats = this.source.count(); // Counting amount of residents that was laoded in to our table.
        this.selectedFlat = null; // So,because we have loaded all residents,then we dont need flat info.
        // Flat information is used only in those cases,when we are loading residents from additional flat.
      });
    } else {
      return null;
    }
  }
  /**
   * Function will load to our table only those residents, that are located in additional flat,and count their amount.
   * @memberof ResidentTableComponent
   */
  loadAdditionalHouseFlatsAndCountThem() {
    if (this.additionalFlatId) {
      forkJoin(
        // Getting residents that are located in flat, that has id equal to "additionalFlatId" value.
        this.flatService.getFlatResidents(this.additionalFlatId),
        // Getting Info about flat, where our residents are living.
        this.flatService.getOneFlat(this.additionalFlatId),
      ).subscribe(flatAndItsResidents => {
        // Loading this residents to our table.
        this.source.load(flatAndItsResidents[0]);
        // Counting amount of loaded residents.
        this.totalResidentsInAdditionalFlat = this.source.count();
        // Putting our flat in to selectedFlat variable,to get flat info later.
        this.selectedFlat = flatAndItsResidents[1][0];
      });
    } else {
      return null;
    }
  }

  /**
   * Function will delete a resident.
   * @param {*} event  event-Resident Object
   * @memberof ResidentTableComponent ResidentTableComponent - Have all setting of our resident smart table
   */
  deleteResidentFromTable(event): void {
    this.residentService.deleteResident(event).subscribe(res => {
      console.log(res);
      this.source.remove(event.data);
      this.totalResidentsInAllFlats = this.totalResidentsInAllFlats - 1;
      this.totalResidentsInAdditionalFlat = this.totalResidentsInAdditionalFlat - 1;
    });
  }


  /**
   * If user will click on 'Plus' button it will open registration form.
   * @memberof ResidentTableComponent
   */
  openResidentRegistrationForm(): void {
    this.residentRegFormVisable = true; // If residentRegFormVisable value is not 0, then Registration form will be shown.
  }

  /**
   * If user will click on 'pencil' button, it will open edit form.
   * @param {*} event event-Resident Object,
   * @memberof ResidentTableComponent
   */
  openResidentEditForm(event): void {
    this.residentThatWeWantToChange = event;
    this.selectedResident = Object.assign({}, event.data); // This will send all values that has our object that we want to edit to our form.
    this.query = this.selectedResident.phone;
    this.residentEditFormVisable = true; // If residentEditFormVisable value is not 0, then it will be shown.
  }

  /**
   * Function will be use on button,when we will click on button,
   * function will send uss on previous page.
   * @memberof ResidentTableComponent
   */
  navigateToPreviousPage(): void {
    this.location.back();
  }

  /**
  * This function is used on a button,when we will press button,it will
  * send uss on a House table page, where we will be able to see all houses that exists.
  * @memberof ResidentTableComponent
  */
  getFullList(): void {
    this.router.navigate(['/pages/resident/resident-table'],
    );
  }

  /**
   * Function resets all form values(edit and registration)
   * to a default values.
   * @param {NgForm} [form] form - Form that we want to reset.
   * @memberof ResidentTableComponent
   */
  resetResidentForm(form?: NgForm) {
    if (form !== null) {
      form.reset();
      this.query = '';
      this.selectedResident = new Resident(this.additionalFlatId);
    }

  }

  /**
   * 
   * @param {NgForm} form Form -  Property will say on what form will be used this function
   * @memberof ResidentTableComponent
   */
  onSubmit(form: NgForm) {
    if (!form.value.id) {
      this.submitToAddNewResident(form);
    } else {
      this.submitToEditResident(form);
    }
  }
  /**
   * Function will add a new Resident.
   * @param {NgForm} form
   * @memberof ResidentTableComponent
   */
  submitToAddNewResident(form: NgForm) {
    forkJoin(
      // Adding new resident
      this.residentService.addResident(form.value),
      // Updating our resident amount value in flat, by requesting a new value
      this.residentService.getresidentAmountInOneFlat(this.additionalFlatId),
    ).subscribe(newResidentAndresidentAmount => {
      // Addint new resident in our smart table list
      this.source.prepend(newResidentAndresidentAmount[0]);
      // If it was successfull the this message will appear
      this.toasterService.popAsync('success', 'Resident was added');
      // Reseting our registration form
      this.resetResidentForm(form);
      // Updating our resident amount value
      this.totalResidentsInAdditionalFlat = newResidentAndresidentAmount[1];
      // If there was an error
    }, (err) => {
      this.errorFromServer = err.text();
      // This message will appaer
      this.toasterService.popAsync('error', this.errorFromServer);
    });
  }
  /**
   * Function will edit a resident info.
   * @param {NgForm} form
   * @memberof ResidentTableComponent
   */
  submitToEditResident(form: NgForm) {
    this.residentService.editResident(form.value.id, form.value)
      .subscribe(editedResident => {
        this.source.update(this.residentThatWeWantToChange.data, editedResident);
        this.toasterService.popAsync('Record updated', 'Resident info was changed');
        this.resetResidentForm(form);
      },
        (err) => {
          this.errorFromServer = err.text();
          this.toasterService.popAsync('error', this.errorFromServer);
        });
  }

  /**
  * Function will close registration or edit form in resident table  
  * Used on button in forms
  * @param {NgForm} [form] form-this property will say on what form will be used this function
  * because it will also reset the form.
  * @memberof ResidentTableComponent
  */
  closeResidentRegistrationOrEditForm(form?: NgForm): void {

    this.residentRegFormVisable = false;
    this.residentEditFormVisable = false;
    this.resetResidentForm(form);
  }
  filter() {
    // If our query is epmty, then it will drop list with all international numbers
    if (this.query === '') {
      this.filteredList = this.internationalNumbers;
    } else {
      // If our query has only digits, then drop down will be filtered by digits
      if (isNumeric(this.query)) {
        this.filteredList = this.internationalNumbers.filter(function (el) {
          return el.dial_code.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
        }.bind(this));
        console.log('Number' + this.filteredList);
        // If our query has chars, then filter will work with chars
      } else {
        this.filteredList = this.internationalNumbers.filter(function (el) {
          return el.name.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
        }.bind(this));
        console.log('nonumber' + this.filteredList);
      }
    }
  }

  select(item) {
    this.query = item.dial_code;
    this.filteredList = [];
  }

}

