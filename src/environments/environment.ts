/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  housesUrl: 'http://localhost:52414/api/House',
  houseUrl: 'http://localhost:52414/api/House/',
  flatsUrl: 'http://localhost:52414/api/flat',
  flatUrl: 'http://localhost:52414/api/flat/',
  residentsUlr: 'http://localhost:52414/api/Resident',
  residentUlr: 'http://localhost:52414/api/Resident/',
  flatAmountUrl: 'http://localhost:52414/api/flat/FlatsAmount',
  residentAmountUrl: 'http://localhost:52414/api/resident/ResidentsAmount',
};
