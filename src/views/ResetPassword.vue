<template>
  <guest-layout>
    <div class="columns">
      <div class="column is-6">
        <div class="card">
          <div class="card-header">
            <h5 class="card-header-title">Reset password</h5>
          </div>
          <div class="card-content">
            <form>
              <base-input
                label="New Password"
                type="password"
                :v="$v.password"
                v-model="password"
              />
              <base-input
                label="Repeat new password"
                type="password"
                :v="$v.confirmPassword"
                v-model="confirmPassword"
              />
              <base-button type="primary" @click="resetMethod">
                Reset password
              </base-button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </guest-layout>
</template>

<script>
import { mapActions } from 'vuex';
import { validationMixin } from 'vuelidate';
import { required, sameAs } from 'vuelidate/lib/validators';

import GuestLayout from '@/layouts/GuestLayout';

import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';

export default {
  name: 'reset-password',
  data: () => ({
    password: '',
    confirmPassword: ''
  }),
  mixins: [validationMixin],
  components: {
    GuestLayout,
    BaseInput,
    BaseButton
  },
  validations: {
    password: {
      required
    },
    confirmPassword: {
      required,
      sameAsPassword: sameAs('password')
    }
  },
  methods: {
    ...mapActions('Auth', ['resetPassword']),
    resetMethod() {
      if (!this.$v.$invalid && this.$route.query.token) {
        this.resetPassword({
          token: this.$route.query.token,
          password: this.password
        });
      }
    }
  }
};
</script>
