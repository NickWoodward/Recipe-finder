export default class Likes {
    constructor() {
        this.likes = [];
    };

    addLike(id, title, author, img) {
        const item = {
            id,
            title,
            author,
            img
        };

        this.likes.push(item);

        return item;
    };

    removeLike(id) {
        const index = this.likes.findIndex(item => item.id === id);
        this.likes.splice(index, 1);
    };

    isLiked(id) {
        return this.likes.findIndex(item => item.id === id) !== -1;
    };

    getNumLikes() {
        return this.likes.length;
    };
}