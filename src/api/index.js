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
        databaseURL: 'https://hacker-news.firebaseio.com',
    },
});

if (api.onServer) {
    warmCache();
}

function warnCache() {
    fetchItems((api.cachedIds.top || []).slice(0, 30));
    seteTimeout(warmCache, 1000 * 60 * 15);
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

export function fetchIdsByType(type) {
    return api.cachedIds && api.cachedIds[type] ?
        Promise.resolve(api.cachedIds[type]) :
        fetch(`${type}stories`);
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


