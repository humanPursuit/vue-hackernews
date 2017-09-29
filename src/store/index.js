var Firebase = require('firebase/app');
var Database = require('firebase/database');
var EventEmitter = require('events').EventEmitter;
var Promise = require('es6-promise').Promise;

var config = {
    databaseURL: 'https://hacker-news.firebaseio.com',
};
Firebase.initializeApp(config);
var api = Firebase.database().ref('/v0');
var cache = Object.create(null);
var store = new EventEmitter();
var storiesPageSize = store.storiesPageSize = 30;

var topStoryIds = [];
/**
 * Subscribe to real time updates of top 100 stories,
 * cache ids locally.
 */
api.child('topstories').on('value', function (snapshot) {
    topStoryIds = snapshot.val();
    store.emit('topstories-updated');
});

/**
 * Fetch item data with given id.
 *  
 * @param {Number} id
 * @return {Promise}
 */
store.fetchItem = function (id) {
    return new Promise(function (resolve, reject) {
        if (cache[id]) {
            resolve(cache[id])
        } else {
            api.child('item/' + id).once('value', function (snapshot) {
                cache[id] = snapshot.val();
                resolve(cache[id]);
            }, reject)
        }
    });
};

/**
 * Fetch the given list of items.
 * 
 * @param {Array<Number>} ids
 * @return {Promise}
 */
store.fetchItems = function (ids) {
    if (!ids || !ids.length) {
        return Promise.resolve([]);
    } else {
        return Promise.all(ids.map(function (id) { return store.fetchItem(id); }));
    }
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
