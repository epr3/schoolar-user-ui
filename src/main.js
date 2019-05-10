import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import './plugins/portal-vue';
import './plugins/vue-fontawesome';

import 'bulma/css/bulma.min.css';
import { createProvider } from './plugins/vue-apollo';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  apolloProvider: createProvider(),
  render: h => h(App)
}).$mount('#app');
