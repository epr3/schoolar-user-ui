<template>
  <portal to="modal">
    <div
      class="modal"
      v-if="modalOpen"
      @click="modalClose"
      :class="{ fade: modalOpen, show: modalOpen }"
    >
      <div @click.stop class="modal-dialog">
        <component :is="modalComponent" v-bind="modalProps" />
      </div>
    </div>
  </portal>
</template>

<style lang="scss">
.modal {
  &.show {
    display: block;
    background-color: rgba(0, 0, 0, 0.6);
  }
}
</style>

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
