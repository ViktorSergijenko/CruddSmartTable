

/**
 * Class(model) that stores all needed properties of resident information,
 * used in crud functions.
 * @export
 * @class Resident
 */
export class Resident {
    /**
     * Creates an instance of Resident, where our additionalFlatId param will give our flatid property his value,if it has any.
     * @param {number} additionalFlatId
     * @memberof Resident
     */
    constructor(additionalFlatId: number) {
        if (additionalFlatId) {
            this.flatid = additionalFlatId;
        }
    }
    /**
     * Primary key field with unique value for resident object.
     * @type {number}
     * @memberof Resident
     */
    id: number;
    /**
     * Property that will store Resident Firstname.
     * @type {string}
     * @memberof Resident
     */
    firstname: string;
    /**
     * Property that will store Resident Firstname.
     * @type {string}
     * @memberof Resident
     */
    lastname: string;
    /**
     * Property that will store Resident Postcode.
     * @type {string}
     * @memberof Resident
     */
    postcode: string;
    /**
     * Property that will store Resident phone number.
     * @type {string}
     * @memberof Resident
     */
    phone: string;
    /**
     * Property that will store Resident Email.
     * @type {string}
     * @memberof Resident
     */
    email: string;
    /**
     * Property that will store Flat id, in which the residents live.
     * @type {number}
     * @memberof Resident
     */
    flatid: number;
}
