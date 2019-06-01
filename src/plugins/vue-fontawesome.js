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
  faStar,
  faQuestionCircle,
  faSearch
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
  faStar,
  faQuestionCircle,
  faSearch
);

Vue.component('font-awesome-icon', FontAwesomeIcon);
