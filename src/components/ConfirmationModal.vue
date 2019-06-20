<template>
  <base-modal-content
    :modal-title="modalTitle"
    :modal-close-action="modalCloseAction"
  >
    <template #modal-footer>
      <base-button type="success" @click="modalSuccess" :disabled="loading">Yes</base-button>
      <base-button type="danger" @click="modalCloseAction" :disabled="loading">No</base-button>
    </template>
  </base-modal-content>
</template>

<script>
import loadingMixin from '../mixins/loadingMixin';

import BaseModalContent from './BaseModalContent.vue';
import BaseButton from './BaseButton.vue';

export default {
  name: 'confirmation-modal',
  components: {
    BaseModalContent,
    BaseButton
  },
  mixins: [loadingMixin],
  props: {
    modalTitle: {
      required: true,
      type: String
    },
    modalCloseAction: {
      required: true,
      type: Function
    },
    modalSuccessAction: {
      required: true,
      type: Function
    }
  },
  methods: {
    async modalSuccess() {
      this.loading = true;
      await this.modalSuccessAction();
      this.loading = false;
    }
  }
};
</script>
