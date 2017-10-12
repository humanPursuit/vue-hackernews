import Vue from 'vue';
import VueRouter from 'vue-router';

import * as filters from './util/filters';
import titleMixin from './util/title';

import App from './App.vue';
// import { createStore } from './store'
import { createRouter } from './router'

// register all Global filters
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});

Vue.mixin(titleMixin);

function createApp() {
    // const store = createStore();
    const router = createRouter();

    const app = new Vue({
        router,
        render: h => h(App),
    });

    return { app, router };
}


import ProgressBar from './components/ProgressBar.vue';
const bar = Vue.prototype.$bar = new Vue(ProgressBar).$mount();
document.body.appendChild(bar.$el);

const { app, router } = createApp();

app.$mount('#app');