import { Resident } from '../resident/resident.model';

export class Flat {
    constructor(houseId: number) {
        if (houseId) {
            this.houseid = houseId;
        }
    }
    /**
     * Creats a new flat
     */
    id: number;
    floor: number;
    number: number;
    totalarea: number;
    livingspace: number;
    residentamount: number;
    residents: Resident[];
    houseid: number;
}
