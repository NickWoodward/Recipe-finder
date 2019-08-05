import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {

        try {
            const res = await axios(`https://www.food2fork.com/api/search?key=${process.env.F2F_KEY}&q=${this.query}`)
            this.recipes = res.data.recipes;
            
        } catch (err) {
            alert(err);
        }
    }
}
