import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faEdit,
  faTrash,
  faCalendar,
  faUserGraduate,
  faSpinner,
  faClock,
  faBuilding,
  faUsers,
  faUserTie,
  faThumbsUp,
  faThumbsDown,
  faStar
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(
  faEdit,
  faTrash,
  faCalendar,
  faUserGraduate,
  faSpinner,
  faClock,
  faBuilding,
  faUsers,
  faUserTie,
  faThumbsUp,
  faThumbsDown,
  faStar
);

Vue.component('font-awesome-icon', FontAwesomeIcon);
