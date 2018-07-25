

/**
 * Class(model) that stores all needed properties of resident information,
 * used in crud functions.
 * @export
 * @class Resident
 */
export class Resident {
    /**
     *Creates an instance of Resident, where our additionalFlatId param will give our flatid property his value,if it has any.
     * @param {number} additionalFlatId
     * @memberof Resident
     */
    constructor(additionalFlatId: number) {
        if (additionalFlatId) {
            this.flatid = additionalFlatId;
        }
    }
    id: number;
    firstname: string;
    lastname: string;
    postcode: string;
    phone: string;
    email: string;
    flatid: number;
}
