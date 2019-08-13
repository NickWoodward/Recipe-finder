import axios from 'axios';

/**
 * @class Search - Queries the food2fork API with a search string.
 * @param {string} query - The search string entered.
*/
export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {

        try {
            const res = await axios(`http://cors-anywhere.herokuapp.com/https://www.food2fork.com/api/search?key=${process.env.F2F_KEY}&q=${this.query}`)
            this.recipes = res.data.recipes;
            
        } catch (err) {
            alert(err);
        }
    }
}
