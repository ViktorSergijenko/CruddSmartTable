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
     * Creates an instance of Flat, where our specifichouseId param will give our houseId property his value.
     * @param {number} specifichouseId 
     * @memberof Flat
     */
    constructor(specifichouseId: number) {
        if (specifichouseId) {
            this.houseId = specifichouseId;
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
    totalArea: number;
    /**
     *  Information about Living space area.
     * @type {number}
     * @memberof Flat
     */
    livingSpace: number;
    /**
     *  Information about amount of residents that lives in this flat.
     * @type {number}
     * @memberof Flat
     */
    residentAmount: number;
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
    houseId: number;
    house: House;
}
