import Vue from 'vue';
import Router from 'vue-router';
import { domain, fromNow } from './filters';
import App from './components/App.vue';
// import NewsView from './components/NewsView.vue';
// import UserView from './components/UserView.vue';
// import ItemView from './components/ItemView.vue';

Vue.use(Router);

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

// router.beforeEach(function () {
//     window.scrollTo(0, 0)
// });

// router.redirect({
//     '*': '/news/1'
// });

var Foo = {
    template: '<div class="foo">' +
    '<h2>This is Foo</h2>' +
    '<router-view></router-view>' +
    '</div>',
}

router.map({
    '/foo': {
        component: Foo,
        subRoutes: {
            '/*username/bar':
            {
                component: {
                    template: '<p>Default sub view for Foo</p>' + 
                    '<p>router path: {{$route.path}}</p>' + 
                    '<p>router params: {{$route.params | json}}</p>',
                }
            },
        }
    }
})

router.start(App, '#app')
