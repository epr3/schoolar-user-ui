<template>
  <auth-layout>
    <div class="container">
      <div class="card">
        <div class="card-header">
          <h5 class="card-header-title">
            Pick a faculty to examine its courses
          </h5>
        </div>
        <div class="card-content">
          <div class="columns">
            <div class="column is-8 is-offset-2">
              <ul v-if="faculties.length">
                <li v-for="item in faculties" :key="item.id">
                  <div class="box">
                    <div class="media" :style="{ alignItems: 'center' }">
                      <div class="media-content">
                        <div class="content">{{ item.name }}</div>
                      </div>
                      <div class="media-right">
                        <div class="buttons">
                          <base-button
                            type="primary"
                            @click="$router.push(`/courses/${item.id}`)"
                          >
                            View courses
                          </base-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </auth-layout>
</template>

<script>
import FACULTIES_QUERY from '../graphql/Faculty/Faculties.gql';

import BaseButton from '@/components/BaseButton';

import AuthLayout from '@/layouts/AuthLayout';

export default {
  name: 'courses',
  data: () => ({
    faculties: []
  }),
  apollo: {
    faculties: FACULTIES_QUERY
  },
  components: {
    AuthLayout,
    BaseButton
  }
};
</script>
