<template>
  <portal to="modal">
    <div
      class="modal"
      v-if="modalOpen"
      @click="modalClose"
      :class="{ 'is-active': modalOpen }"
    >
      <div class="modal-background"></div>
      <component :is="modalComponent" v-bind="modalProps" />
    </div>
  </portal>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'modal-container',
  computed: {
    ...mapState('Modal', ['modalOpen', 'modalComponent', 'modalProps'])
  },
  methods: {
    ...mapMutations({
      modalClose: 'Modal/CLOSE_MODAL'
    })
  }
};
</script>
