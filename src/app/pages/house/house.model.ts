import { Flat } from '../flat/flat.model';

/**
 * Class(model) that stores all needed properties of house information,
 * used in crud fucntions.
 * @export
 * @class House
 */
export class House {

    /**
     * Creates an instance of House,where flatamount will be equal to zero.
     * @memberof House
     */
    constructor() {
        this.flatamount = 0;
    }
    /**
     * Primary key field with unique value for house object.
     * @type {number} 
     * @memberof House
     * @
     */
    id: number;
    /**
     * Property that will store information about street.
     * @type {string}
     * @memberof House
     */
    street: string;
    /**
     * Property that will store information about house number.
     * @type {number}
     * @memberof House
     */
    number: number;
    /**
     * Property that will store infromation about amount of floors in house.
     * @type {number}
     * @memberof House
     */
    floors: number;
    /**
     * Property that will store information about city that this house is located.
     * @type {string}
     * @memberof House
     */
    city: string;
    /**
     * Property that will store information about country that this house is located.
     * @type {string}
     * @memberof House
     */
    country: string;
    /**
     * Property that will store information about Post index.
     * @type {string}
     * @memberof House
     */
    postindex: string;
    /**
     * Property that will store information about flat amount in house.
     * @type {number}
     * @memberof House
     */
    flatamount: number;
    /**
     * Array,that will store flats that are located in this house.
     * @type {Flat[]}
     * @memberof House
     */
    flats: Flat[];
}
