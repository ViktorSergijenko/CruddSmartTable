import { Flat } from '../flat/flat.model';

export class House {
    /**
     * Creats a new house
     */
    id: number;
    street: string;
    number: number;
    floors: number;
    city: string;
    country: string;
    postindex: string;
    flatamount: number;
    flats: Flat[];
}
