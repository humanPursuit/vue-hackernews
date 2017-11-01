// import * as API from '../api';

// const storiesPageSize = 30;

// const store = {
//     storiesPageSize: storiesPageSize,
//     type: null,
//     list: {
//         /* [type]: [id:number] */
//     },
// };

// if (API.api.onServer) {
//     warnCache();
// }

// function warmCache() {
//     fetchItems((api.cachedIds.top || []).slice(0, 30))
//     setTimeout(warmCache, 1000 * 60 * 15);
// }


// store.fetchStoriesIds = function (type) {
//     store.type = type;
//     if (store.list[type] === undefined) {
//         store.list[type] = [];
//     }
//     return API.fetchIdsByType(type)
//         .then(ids => {
//             store.list[type] = ids;
//         });
// }

// /**
//  * Fetch item data with given id.
//  *  
//  * @param {Number} id
//  * @return {Promise}
//  */
// store.fetchItem = function (id) {
//     return API.fetchItem(id);
// };

// /**
//  * Fetch the given list of items.
//  * 
//  * @param {Array<Number>} ids
//  * @return {Promise}
//  */
// store.fetchItems = function (ids) {
//     return Promise.all(ids.map(id => store.fetchItem(id)));
// };

// /**
//  * Fetch items for the given page
//  * 
//  * @param {Number} page
//  * @return {Promise}
//  */
// store.fetchItemsByPage = function (page) {
//     var start = (page - 1) * storiesPageSize;
//     var list = this.list[this.type];
//     var end = page * storiesPageSize;
//     var ids = list.slice(start, end);
//     return API.fetchItems(ids);
// };

// export default store;

import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex)

export function createStore() {
    return new Vuex.Store({
        state: {
            activeType: null,
            itemsPerPage: 20,
            items: {/* [id: number]: Item */ },
            users: {/* [id: number]: User */ },
            lists: {
                top: [/* number */],
                new: [],
                show: [],
                ask: [],
                job: [],
            }
        },
        actions,
        mutations,
        getters,
    });
}