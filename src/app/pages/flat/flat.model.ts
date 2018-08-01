import { Resident } from '../resident/resident.model';
import { House } from '../house/house.model';

/**
 * Class(model) that describes Flat object,
 * used in crud functions.
 * @export
 * @class Flat
 */
export class Flat {
    /**
     * Creates an instance of Flat, where our specificHouseId param will give our houseId property his value.
     * @param {number} specificHouseId 
     * @memberof Flat
     */
    constructor(specificHouseId: number) {
        if (specificHouseId) {
            this.houseid = specificHouseId;
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
     *  Information about floor that flat is located.
     * @type {number}
     * @memberof Flat
     */
    floor: number;
    /**
     *  Information about flat number.
     * @type {number}
     * @memberof Flat
     */
    number: number;
    /**
     *  Information about Total area of flat.
     * @type {number}
     * @memberof Flat
     */
    totalarea: number;
    /**
     *  Information about Living space area.
     * @type {number}
     * @memberof Flat
     */
    livingspace: number;
    /**
     *  Information about amount of residents that lives in this flat.
     * @type {number}
     * @memberof Flat
     */
    residentamount: number;
    /**
     * Array with residents objects.
     * @type {Resident[]}
     * @memberof Flat
     */
    residents: Resident[];
    /**
     *  Information about house id in that this flat is located.
     * @type {number}
     * @memberof Flat
     */
    houseid: number;
    house: House;
}
