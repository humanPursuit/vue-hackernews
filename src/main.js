import Vue from 'vue';
import VueRouter from 'vue-router';

import * as filters from './util/filters';
import titleMixin from './util/title';

import App from './components/App.vue';
import NewsView from './components/NewsView.vue';
// import UserView from './components/UserView.vue';
// import ItemView from './components/ItemView.vue';

// register all Global filters
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});

Vue.mixin(titleMixin);

var routes = [{
    path: '/news/:page',
    component: NewsView,
    // }, {
    //     path: '/user/:id',
    //     component: UserView,
    // }, {
    //     path: '/item/:id',
    //     component: ItemView,
}, {
    path: '*',
    redirect: '/news/1'
}];

var router = new VueRouter({
    routes,
});

router.beforeEach(function () {
    window.scrollTo(0, 0)
});


// router.start(App, '#app')
const app = new Vue({
    router
}).$mount('#app');
