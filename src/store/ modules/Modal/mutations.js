import * as constants from './constants';

export default {
  [constants.OPEN_MODAL](state, payload) {
    state.modalOpen = true;
    state.modalComponent = payload.component;
    state.modalProps = payload.props;
  },
  [constants.CLOSE_MODAL](state) {
    state.modalOpen = false;
    state.modalComponent = null;
    state.modalProps = null;
  }
};
