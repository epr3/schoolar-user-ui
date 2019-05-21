<template>
  <guest-layout>
    <div class="columns">
      <div class="column is-6 is-offset-3">
        <div class="card card__login">
          <div class="card-header">
            <h5 class="card-header-title">Login</h5>
          </div>
          <div class="card-content">
            <form>
              <base-input
                label="Email"
                type="email"
                :v="$v.email"
                placeholder="test@test.com"
                v-model="email"
              />
              <base-input
                label="Password"
                type="password"
                :v="$v.password"
                v-model="password"
              />
              <base-button type="primary" @click="loginMethod">
                Login
              </base-button>
              <div class="field">
                <router-link to="/forgot-password">
                  Forgot your password?
                </router-link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </guest-layout>
</template>

<style lang="scss">
.card__login {
  margin-top: 50%;
}
</style>

<script>
import LOGIN from '../graphql/Auth/Login.gql';
import { onLogin } from '../plugins/vue-apollo.js';

import { validationMixin } from 'vuelidate';
import { required, email } from 'vuelidate/lib/validators';

import GuestLayout from '@/layouts/GuestLayout.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';

export default {
  name: 'login',
  data: () => ({
    email: '',
    password: ''
  }),
  components: {
    BaseInput,
    GuestLayout,
    BaseButton
  },
  methods: {
    async loginMethod() {
      if (!this.$v.$invalid) {
        try {
          this.$apollo.mutate({
            mutation: LOGIN,
            variables: {
              email: this.email,
              password: this.password
            },
            update: (_, { data: { login } }) => {
              onLogin(
                this.$apolloProvider.defaultClient,
                login.accessToken,
                login.refreshToken
              );
              this.$router.replace('/');
            }
          });
        } catch (e) {
          console.error(e);
        }
      }
    }
  },
  mixins: [validationMixin],
  validations: {
    email: {
      required,
      email
    },
    password: {
      required
    }
  }
};
</script>
