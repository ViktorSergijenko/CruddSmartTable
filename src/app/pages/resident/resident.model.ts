/**
 * FIXME💩: JSDOCS
 */

export class Resident {
    constructor(myFlatId: number) {
        /**
         * FIXME💩: Comments
         */
        if (myFlatId) {
            this.flatid = myFlatId;
        }
    }
    /**
     * Creats a new flat
     */
    id: number;
    firstname: string;
    lastname: string;
    postcode: string;
    phone: string;
    email: string;
    flatid: number;
}
