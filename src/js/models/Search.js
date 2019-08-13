import axios from 'axios';

/**
 * @class Search - Queries the EDAMAM API with a search string.
 * @param {string} query - The search string entered.
*/
export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {

        try {
            const res = await axios(`${process.env.EDAMAM_URL}?q=${this.query}&from=0&to=50&app_id=${process.env.EDAMAM_ID}&app_key=${process.env.EDAMAM_KEY}`)
            // Change result structure [{Recipe, ...},{Recipe, ...},{Recipe, ...}] => [Recipe, Recipe, Recipe]
            this.recipes = res.data.hits.map(item => item.recipe);
        } catch (err) {
            alert(err);
        }
    }
}
