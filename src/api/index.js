import Firebase from 'firebase/app';
import 'firebase/database';
import { Promise } from 'es6-promise';

function createAPI({ config, version }) {
    Firebase.initializeApp(config);
    return Firebase.database().ref(version);
}

const logRequests = !!process.env.DEBUG_API;

const api = createAPI({
    version: '/v0',
    config: {
        databaseURL: 'https://hacker-news.firebaseio.com'
    },
});

if (api.onServer) {
    warnCache();
}

function warmCache() {
    fetchItems((api.cachedIds.top || []).slice(0, 30))
    setTimeout(warmCache, 1000 * 60 * 15);
}

function fetch(child) {
    logRequests && console.log(`fetching ${child}...`)
    const cache = api.cachedItems;
    if (cache && cache.has(child)) {
        logRequests && console.log('cache hit for ${child}.')
        return Promise.resolve(cache.get(child))
    } else {
        return new Promise((resolve, reject) => {
            api.child(child).once('value', snapshot => {
                const val = snapshot.val();
                if (val) val.__lastUpdated = Date.now();
                cache && cache.set(child, val);
                logRequests && console.log(`fetched ${child}.`)
                resolve(val)
            }, reject);
        });
    }
}

const pageSize = 30;

export const store = {
    pageSize,
    type: null,
    list: {
        /* [id:number] */
        new: [],
    }
};

export function fetchIdsByType(type) {
    store.type = type;
    return api.cachedIds && api.cachedIds[type] ?
        Promise.resolve(api.cachedIds[type]) :
        fetch(`${type}stories`).then(data => {
            store.list[type] = data;
        });
}

export function fetchItemsByPage(page) {
    var start = (page - 1) * pageSize;
    var list = store.list[store.type];
    var end = page * pageSize;
    var ids = list.slice(start, end);
    return fetchItems(ids);
}

export function fetchItem(id) {
    return fetch(`item/${id}`)
}

export function fetchItems(ids) {
    return Promise.all(ids.map(id => fetchItem(id)))
}

export function fetchUser(id) {
    return fetch(`user/${id}`)
}

export function watchList(type, cb) {
    let first = true;
    const ref = api.child(`${type}stories`);
    const handler = snapshot => {
        if (first) {
            first = false;
        } else {
            cb(snapshot.val());
        }
    };
    ref.on('value', handler);
    return () => {
        ref.off('value', handler);
    }
}


