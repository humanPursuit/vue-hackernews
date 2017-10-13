import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// const ItemView = () => System.import('../views/ItemView.vue');
// const UserView = () => System.import('../views/UserView.vue');
const createListView = id => () => System.import('../views/CreateListView').then(m => m.default(id));

export function createRouter() {
    return new Router({
        mode: 'hash',
        fallback: false,
        scrollBehavior: () => ({ y: 0 }),
        routes: [
            { path: '/new/:page(\\d+)?', component: createListView('new') },
            // { path: '/item/:id(\\d+)?', component: ItemView },
            // { path: '/user/:id', component: UserView },
            { path: '/', redirect: 'new' },
        ]
    });
}