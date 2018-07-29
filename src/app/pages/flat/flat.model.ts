import { Resident } from '../resident/resident.model';

/**
 * Class(model) that stores all needed properties of flat information,
 * used in crud functions.
 * @export
 * @class Flat
 */
export class Flat {
    /**
     * Creates an instance of Flat, where our additionalHouseId param will give our houseId property his value.
     * @param {number} additionalHouseId 
     * @memberof Flat
     */
    constructor(additionalHouseId: number) {
        if (additionalHouseId) {
            this.houseid = additionalHouseId;
        }
    }
    /**
     *
     * Primary key field with unique value for house object.
     * @type {number} 
     * @memberof Flat
     */
    id: number;
    /**
     * Property that will will store information about floor that flat is located.
     * @type {number}
     * @memberof Flat
     */
    floor: number;
    /**
     * Property that will will store information about flat number.
     * @type {number}
     * @memberof Flat
     */
    number: number;
    /**
     * Property that will will store information about Total area of flat.
     * @type {number}
     * @memberof Flat
     */
    totalarea: number;
    /**
     * Property that will will store information about Living space area.
     * @type {number}
     * @memberof Flat
     */
    livingspace: number;
    /**
     * Property that will will store information about amount of residents that lives in this flat.
     * @type {number}
     * @memberof Flat
     */
    residentamount: number;
    /**
     * This array will contain all residents that live in this flat.
     * @type {Resident[]}
     * @memberof Flat
     */
    residents: Resident[];
    /**
     * Property that will will store information about house id that this flat is located.
     * @type {number}
     * @memberof Flat
     */
    houseid: number;
}
