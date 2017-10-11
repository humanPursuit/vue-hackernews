import * as API from '../api';

const storiesPageSize = store.storiesPageSize = 30;

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
    var end = page * storiesPageSize;
    var ids = topStoryIds.slice(start, end);
    return store.fetchItems(ids);
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
