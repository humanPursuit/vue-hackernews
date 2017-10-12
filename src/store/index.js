import * as API from '../api';

const storiesPageSize = 30;

const store = {
    storiesPageSize: storiesPageSize,
    type: null,
    list: {
        /* [id:number] */
        news: [],
    }
};


store.fetchStoriesIds = function (type) {
    store.type = type;
    return API.fetchIdsByType(type)
        .then(ids => {
            store.list[type] = ids;
        });
}

/**
 * Fetch item data with given id.
 *  
 * @param {Number} id
 * @return {Promise}
 */
store.fetchItem = function (id) {
    return API.fetchItem(id);
};

/**
 * Fetch the given list of items.
 * 
 * @param {Array<Number>} ids
 * @return {Promise}
 */
store.fetchItems = function (ids) {
    return Promise.all(ids.map(id => store.fetchItem(id)));
};

/**
 * Fetch items for the given page
 * 
 * @param {Number} page
 * @return {Promise}
 */
store.fetchItemsByPage = function (page) {
    var start = (page - 1) * storiesPageSize;
    var list = this.list[this.type];
    var end = page * storiesPageSize;
    var ids = list.slice(start, end);
    return API.fetchItems(ids);
};

/**
 * Fetch a user data with given id.
 * 
 * @param {Number} id
 * @return {Promise}
 */
store.fetchUser = function (id) {
    return new Promise(function (resolve, reject) {
        api.child('/user/' + id).once('value', function (snapshot) {
            var user = snapshot.val();
            resolve(user);
        }, reject)
    });
};

module.exports = store;
