<template>
  <guest-layout>
    <div class="columns">
      <div class="column is-6 is-offset-3">
        <div class="card">
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
              <base-button type="primary" @click="loginMethod" :disabled="loading">
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

<script>
import LOGIN from '../graphql/Auth/Login.gql';
import { onLogin } from '../plugins/vue-apollo.js';

import loadingMixin from '../mixins/loadingMixin';
import { validationMixin } from 'vuelidate';
import { required, email } from 'vuelidate/lib/validators';

import GuestLayout from '@/layouts/GuestLayout.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';
import errorHandler from '../utils/errorHandler';

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
        this.loading = true;
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
          errorHandler(e);
        }
        this.loading = false;
      }
    }
  },
  mixins: [validationMixin, loadingMixin],
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
