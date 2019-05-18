<template>
  <auth-layout>
    <test-list />
  </auth-layout>
</template>

<script>
import TestList from '../containers/TestList';

import AuthLayout from '../layouts/AuthLayout';

export default {
  name: 'tests',
  components: {
    TestList,
    AuthLayout
  }
};
</script>
