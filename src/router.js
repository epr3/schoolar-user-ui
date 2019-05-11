import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Login from './views/Login.vue';
import ResetPassword from './views/ResetPassword.vue';

Vue.use(Router);

const router = new Router({
  base: process.env.BASE_URL,
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        guest: true
      }
    },
    {
      path: '/sessions/:id',
      name: 'session',
      component: () =>
        import(/* webpackChunkName: "session" */ './views/Session.vue'),
      meta: {
        auth: true
      }
    },
    {
      path: '/schedule/:id',
      name: 'eventQA',
      component: () =>
        import(/* webpackChunkName: "eventQA" */ './views/EventQA.vue'),
      meta: {
        auth: true
      }
    },
    {
      path: '/schedule',
      name: 'schedule',
      component: () =>
        import(/* webpackChunkName: "schedule" */ './views/Schedule.vue'),
      meta: {
        auth: true
      }
    },
    {
      path: '/reset-password',
      name: 'resetPassword',
      component: ResetPassword,
      meta: {
        guest: true
      }
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        auth: true
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.auth)) {
    if (
      localStorage.getItem(process.env.VUE_APP_ACCESS_TOKEN) &&
      localStorage.getItem(process.env.VUE_APP_REFRESH_TOKEN)
    ) {
      next();
    } else {
      next({
        path: '/login',
        params: { nextUrl: to.fullPath }
      });
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (localStorage.getItem(process.env.VUE_APP_ACCESS_TOKEN) === null) {
      next();
    } else {
      next({ name: 'home' });
    }
  } else {
    next();
  }
});

export default router;
