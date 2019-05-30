import store from '../store';
import router from '../router';

export default ({ networkError, graphQLErrors }) => {
  store.commit('Error/CLEAR_ERROR');
  if (networkError) {
    store.commit('Error/SET_ERROR', 'Oops! We have encountered an error!');
  }

  graphQLErrors.forEach(async item => {
    if (
      item.extensions.code === 'UNAUTHENTICATED' ||
      item.extensions.code === 'FORBIDDEN'
    ) {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(process.env.VUE_APP_ACCESS_TOKEN);
        localStorage.removeItem(process.env.VUE_APP_REFRESH_TOKEN);
      }
      router.replace('/login');
      store.commit('Error/SET_ERROR', item.message);
      return;
    }
    store.commit('Error/SET_ERROR', item.message);
  });
  setTimeout(() => {
    store.commit('Error/CLEAR_ERROR');
  }, 5000);
};
