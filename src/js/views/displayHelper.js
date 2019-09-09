import Fraction from 'fraction.js';

/** 
 * Limit each recipe title's length
 * @param {string} title - The recipe title
 * @param {number} limit - Length that prevents title spanning 2 lines 
 * @return {string} - The shortened title
 */
export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    let total = 0;

    if (title.length > limit) {
        for (let word of title.split(' ')) {
            // If the next word in the array doesn't exceed the limit
            // when added to the total length, push to new title array
            if (word.length + total < limit) {
                newTitle.push(word);
                total += word.length;
            } else {
                break;
            }
        }
        return `${newTitle.join(' ')}...`
    }
    return title;
};

export const parseMeasurement = (quantity, measurement) => {

    // Ignore <unit> as a measurement
    if (measurement === '<unit>' || !quantity) return measurement;
    // If the quantity is > 1 and doesn't already end with an 's', make the measurement plural
    else if ((quantity > 1) && measurement.charAt(measurement.length - 1) !== 's') {
        // Add unusual cases here
        switch (measurement) {
            case 'leaf': return 'leaves';
            default: return `${measurement}s`;
        }
        // If the quantity is .5: Eg: 1/2 a cup
    } else if (quantity === 0.5) {
        return `a ${measurement}`;
        // If the quantity < 1: Eg: 1/3 of a cup
    } else if (quantity < 1) {
        return `of a ${measurement}`;
    } else {
        return measurement;
    }
}

export const formatNum = (num, type) => {
    // If type is a weight, use toFixed to .1
    // If type is quantity, use the fraction.js package
    if (type === 'weight') {
        num = parseInt(num).toFixed(1);
        // Remove the decimal if it's 0 
        // 428.0 > 4280 > 0 > 0 === true
        // 428.1 > 4281 > 1 > .1 === false
        if (num * 10 % 10 / 10 === 0) {
            return parseInt(num).toFixed(0);
        } else {
            return parseInt(num, 10);
        }
    } else if (type == 'qty') {
        const fraction = new Fraction(num).simplify(0.001);
        return fraction.toFraction(true);
    }
    return parseInt(num, 10);
};

export const capitalise = word => {
    if(word)
        return word.charAt(0).toUpperCase() + word.slice(1);
};