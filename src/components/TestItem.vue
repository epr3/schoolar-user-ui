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
            <div
              class="level-item"
              @click="$router.push(`/tests/${id}`)"
            ># of questions: {{ numberOfQuestions }}</div>
            <div class="level-item" @click="editTestAction(id)">Edit</div>
            <div class="level-item" @click="deleteTestAction(id)">Delete</div>
            <div
              class="level-item"
              v-if="numberOfQuestions > 0"
              @click="openSessionModal"
            >Create session</div>
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

export default {
  name: 'test-item',
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
    deleteTestAction(id) {
      this.$apollo.mutate({
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
    }
  }
};
</script>
