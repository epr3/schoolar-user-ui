<template>
  <div class="box">
    <article class="media">
      <div class="media-content">
        <div>
          <strong>{{ title }}</strong>
          <p>{{ description }}</p>
          <small>@{{ subject }}</small>
        </div>
        <div class="level">
          <div class="level-left">
            <div class="level-item" v-if="numberOfQuestions > 0">
              <base-button type="primary" @click="openSessionModal">Create session</base-button>
            </div>
            <div class="level-item">
              <base-button type="info" @click="$router.push(`/tests/${id}`)">Manage questions</base-button>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              <font-awesome-icon icon="question-circle"/>
              {{ numberOfQuestions }}
            </div>
            <div class="level-item" @click="editTestAction(id)">
              <font-awesome-icon icon="edit"/>
            </div>
            <div class="level-item" @click="deleteTestAction(id)">
              <font-awesome-icon icon="trash"/>
            </div>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<script>
import TESTS_QUERY from '../graphql/Quiz/Tests.gql';
import DELETE_TEST from '../graphql/Quiz/DeleteTest.gql';
import { mapMutations } from 'vuex';

import BaseButton from './BaseButton';

export default {
  name: 'test-item',
  components: {
    BaseButton
  },
  props: {
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    numberOfQuestions: {
      type: Number,
      required: true
    },
    subject: {
      type: String,
      required: true
    }
  },
  methods: {
    ...mapMutations({
      openModal: 'Modal/OPEN_MODAL'
    }),
    openModalAction(props) {
      this.openModal({
        component: () => import('@/containers/TestModal.vue'),
        props
      });
    },
    openSessionModal(props) {
      this.openModal({
        component: () => import('@/containers/QuizSessionModal.vue'),
        props
      });
    },
    editTestAction(id) {
      this.openModalAction({ id });
    },
    async deleteTestAction(id) {
      try {
        await this.$apollo.mutate({
          mutation: DELETE_TEST,
          variables: {
            id
          },
          update: store => {
            const data = store.readQuery({ query: TESTS_QUERY });
            store.writeQuery({
              query: TESTS_QUERY,
              data: {
                ...data,
                tests: data.tests.filter(item => item.id !== id)
              }
            });
          }
        });
      } catch (e) {
        console.error(e);
      }
    }
  }
};
</script>
