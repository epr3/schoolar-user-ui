<template>
  <div class="container">
    <div class="columns">
      <slot name="filter"></slot>
    </div>
    <table class="table">
      <template v-if="items.length">
        <thead>
          <tr>
            <th
              v-for="(item, index) in Object.keys(computedItems[0])"
              :key="index"
            >
              {{ item }}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in computedItems" :key="index">
            <td v-for="(cell, index) in Object.keys(item)" :key="index">
              {{ item[cell] }}
            </td>
            <td>
              <slot name="actions" :item="item" />
            </td>
          </tr>
        </tbody>
      </template>
      <template v-else>
        <tbody>
          <tr>
            <td>No data to show.</td>
          </tr>
        </tbody>
      </template>
    </table>
  </div>
</template>

<style scoped lang="scss">
th td {
  &::first-letter {
    text-transform: capitalize;
  }
}
</style>

<script>
export default {
  name: 'base-table',
  props: {
    items: {
      required: true,
      type: Array
    }
  },
  computed: {
    computedItems() {
      return this.items.map(item => {
        return item;
      });
    }
  }
};
</script>
