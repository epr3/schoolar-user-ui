import Vue from 'vue';
import VueMq from 'vue-mq';

Vue.use(VueMq, {
  breakpoints: {
    sm: 768,
    md: 1024,
    lg: 1215,
    xl: 1407,
    hd: Infinity
  }
});
