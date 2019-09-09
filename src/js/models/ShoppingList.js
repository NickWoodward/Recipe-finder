import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }

    addItem(servings, qtyPerServing, weightPerServing, qty, unit, food, weight) {
        const item = {
            id: uniqid(),
            // qtyPer and weightPer used for increment steps in the view
            qtyPerServing,
            weightPerServing,
            qty,
            unit,
            food,
            weight
        }
        this.items.push(item);
        return item;
    }
 

    removeItem(id) {
        const index = this.items.findIndex(item => item.id === id);
        this.items.splice(index, 1)
    }

    updateWeight(id, newAmount) {
        const item = this.items.find(item => item.id === id);
        if(item) item.weight = newAmount;
        console.log('finish update amount');
    }
}