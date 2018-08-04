import { Flat } from '../flat/flat.model';

/**
 * Class(model) that describes house object,  
 * used in crud fucntions.
 * @export
 * @class House
 */
export class House {
    /**
     * Primary key field with unique value for house object.
     * @type {number} 
     * @memberof House
     * @
     */
    id: number;
    /**
     * Street on that this house is located.
     * @type {string}
     * @memberof House
     */
    street: string;
    /**
     * House number.
     * @type {number}
     * @memberof House
     */
    number: number;
    /**
     * Infromation about amount of floors in house.
     * @type {number}
     * @memberof House
     */
    floors: number;
    /**
     * city that this house is located.
     * @type {string}
     * @memberof House
     */
    city: string;
    /**
     * Country in that this house is located.
     * @type {string}
     * @memberof House
     */
    country: string;
    /**
     * Post index.
     * @type {string}
     * @memberof House
     */
    postIndex: string;
    /**
     * Flat amount in house.
     * @type {number}
     * @memberof House
     */
    flatAmount: number = 0;
    /**
     * Array with flats.
     * @type {Flat[]}
     * @memberof House
     */
    flats: Flat[];
}


