import { Flat } from '../flat/flat.model';

/**
 * Class(model) that stores all needed properties of house information,
 * used in crud fucntions.
 * @export
 * @class House
 */
export class House {

    /**
     *Creates an instance of House,where flatamount will be equal to zero.
     * @memberof House
     */
    constructor() {
        this.flatamount = 0;
    }
    /**
     * @property {id} - Primary key field with unique value for house object.
     * @type {number} 
     * @memberof House
     * @
     */
    id: number;
    /**
     * @property {street} - Property that will store information about street
     * @type {string}
     * @memberof House
     */
    street: string;
    /**
     * @property {number} - Property that will store information about house number.
     * @type {number}
     * @memberof House
     */
    number: number;
    /**
     * @property {floors} - Property that will store infromation about amount of floors in house.
     * @type {number}
     * @memberof House
     */
    floors: number;
    /**
     * @property {city} - Property that will store information about city that this house is located.
     * @type {string}
     * @memberof House
     */
    city: string;
    /**
     * @property {country} - Property that will store information about country that this house is located.
     * @type {string}
     * @memberof House
     */
    country: string;
    /**
     * @property {postindex} - Property that will store information about Post index.
     * @type {string}
     * @memberof House
     */
    postindex: string;
    /**
     * @property {flatamount} - Property that will store information about flat amount in house.
     * @type {number}
     * @memberof House
     */
    flatamount: number;
    flats: Flat[];
}
