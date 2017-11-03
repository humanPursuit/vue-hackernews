import Vue from 'vue';
import VueRouter from 'vue-router';
import { sync } from 'vuex-router-sync'

import * as filters from './util/filters';
import titleMixin from './util/title';

import App from './App.vue';
import { createStore } from './store'
import { createRouter } from './router'

// register all Global filters
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});

Vue.mixin(titleMixin);


function createApp() {
    const store = createStore();
    const router = createRouter();

    // sync the router and router instances
    sync(store, router)

    const app = new Vue({
        router,
        store,
        render: h => h(App),
    });

    return { app, router, store };
}

import 'es6-promise/auto'
import ProgressBar from './components/ProgressBar.vue';
const bar = Vue.prototype.$bar = new Vue(ProgressBar).$mount();
document.body.appendChild(bar.$el);

// a global mixin that calls `async Data` when a route component's params change
Vue.mixin({
    beforeRouteUpdate(to, from, next) {
        const { asyncData } = this.$options;
        if (asyncData) {
            asyncData({
                store: this.$store,
                route: to,
            }).then(next).catch(next)
        } else {
            next();
        }
    }
})

const { app, router, store } = createApp();

// wait until router has resolved all async before hooks
// and async components...
// router.onReady(() => {
    // add router hook for handling asyncData.
    // doing it after inital route is resolved so that we don't double-fetch the data that we already have
    router.beforeResolve((to, from, next) => {
        const matched = router.getMatchedComponents(to)
        const prevMatched = router.getMatchedComponents(from);
        let diffed = false;
        const activated = matched.filter((c, i) => {
            return diffed || (diffed = (prevMatched[i] !== c))
        })
        const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _);
        if (!asyncDataHooks.length) {
            return next()
        }

        bar.start()
        Promise.all(asyncDataHooks.map(hook => hook({ store, router: to })))
            .then(() => {
                bar.finish();
                next()
            })
            .catch(next);
    });

    app.$mount('#app');
// })


