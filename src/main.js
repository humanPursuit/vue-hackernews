import Vue from 'vue';
import VueRouter from 'vue-router';
import { domain, fromNow } from './filters';
import App from './components/App.vue';
import NewsView from './components/NewsView.vue';
// import UserView from './components/UserView.vue';
// import ItemView from './components/ItemView.vue';

// Vue.use(Router);

Vue.filter('fromNow', fromNow);
Vue.filter('domain', domain);

var router = new Router();

// router.map({
//     '/news/:page': {
//         component: NewsView
//     },
//     '/user/:id': {
//         component: UserView
//     },
//     '/item/:id': {
//         component: ItemView
//     },
// });

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
