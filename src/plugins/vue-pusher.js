import Vue from 'vue';
import VuePusher from 'vue-pusher';

Vue.use(VuePusher, {
  api_key: process.env.VUE_APP_PUSHER_APP_ID,
  options: {
    cluster: 'eu'
  }
});
