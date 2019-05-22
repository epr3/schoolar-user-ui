<template>
  <auth-layout>
    <div class="hero">
      <div class="container">
        <h2 class="title">Join test</h2>
        <form>
          <base-input label="Code" :v="$v.code" v-model="code" type="text"/>
          <base-button type="primary" @click="submit">Join test</base-button>
        </form>
      </div>
    </div>
  </auth-layout>
</template>

<script>
import POST_JOIN_QUIZ_SESSION from '../graphql/Quiz/PostJoinQuizSession.gql';

import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';

import AuthLayout from '../layouts/AuthLayout';

import BaseInput from '../components/BaseInput';
import BaseButton from '../components/BaseButton';

export default {
  name: 'join-test',
  data: () => ({
    code: ''
  }),
  mixins: [validationMixin],
  validations: {
    code: {
      required
    }
  },
  components: {
    AuthLayout,
    BaseInput,
    BaseButton
  },
  methods: {
    async submit() {
      if (!this.$v.invalid) {
        try {
          await this.$apollo.mutate({
            mutation: POST_JOIN_QUIZ_SESSION,
            variables: { code: this.code }
          });
          this.$router.push(`/quiz/${this.code}`)
        } catch (e) {
          console.error(e);
        }
      }
    }
  }
};
</script>
