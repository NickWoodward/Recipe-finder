import { elements } from './base';

export const renderItem = item => {
    const markup = `
        <li class="shopping__item" data-itemid=${item.id}>
            <div class="shopping__count">
                <input type="number" value="${item.qty}" step="${item.qtyPerServing}" class="shopping__count-value">
                <p>${item.unit}</p>
            </div>
            <p class="shopping__description">${item.food}</p>
            <button class="shopping__delete btn-tiny">
                <svg>
                    <use href="#icons_icon-circle-with-cross"></use>
                </svg>
            </button>
        </li>
    `;

    elements.shoppingList.insertAdjacentHTML('beforeend', markup);
};

export const deleteItem = id => {
    const item = document.querySelector(`[date-itemid]=""${id}`);
    item.parentElement.removeChild(item);
}
