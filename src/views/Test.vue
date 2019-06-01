<template>
  <auth-layout>
    <div class="container">
      <div v-if="test" class="card">
        <div class="card-header">
          <div class="card-header-title">{{ test.title }}</div>
        </div>
        <div class="card-content">
          <div class="content">
            <p>{{ test.description }}</p>
          </div>
          <div class="content">
            <base-button
              type="primary"
              @click="$router.push(`/tests/${$route.params.id}/questions/new`)"
            >
              Add question
            </base-button>
          </div>
          <quiz-question-list
            :questions="test.questions ? test.questions : []"
          />
        </div>
      </div>
    </div>
  </auth-layout>
</template>

<script>
import { mapMutations } from 'vuex';
import gql from 'graphql-tag';
import TEST_QUERY from '../graphql/Quiz/Test.gql';
import DELETE_QUIZ_QUESTION from '../graphql/Quiz/DeleteQuizQuestion.gql';

import AuthLayout from '../layouts/AuthLayout';

import BaseButton from '../components/BaseButton';
import QuizQuestionList from '../components/QuizQuestionList';

export default {
  name: 'test',
  components: {
    AuthLayout,
    QuizQuestionList,
    BaseButton
  },
  data() {
    return {
      test: null,
      routeParam: this.$route.params.id
    };
  },
  apollo: {
    test: {
      query: gql`
        ${TEST_QUERY}
      `,
      variables() {
        return {
          id: this.routeParam
        };
      }
    }
  },
  methods: {
    ...mapMutations({
      openModal: 'Modal/OPEN_MODAL',
      modalClose: 'Modal/CLOSE_MODAL'
    }),
    openConfirmationModal(props) {
      this.openModal({
        component: () => import('@/components/ConfirmationModal.vue'),
        props
      });
    },
    deleteQuizQuestionAction(id) {
      this.openConfirmationModal({
        modalTitle: 'Delete subject',
        modalCloseAction: this.modalClose,
        modalSuccessAction: async () => {
          try {
            await this.$apollo.mutate({
              mutation: DELETE_QUIZ_QUESTION,
              variables: {
                id
              },
              update: store => {
                const data = store.readQuery({
                  query: TEST_QUERY,
                  variables: { id: this.$route.params.id }
                });
                const response = data.test.questions.filter(
                  item => item.id !== id
                );
                store.writeQuery({
                  query: TEST_QUERY,
                  variables: { id: this.$route.params.id },
                  data: {
                    ...data,
                    test: { ...data.test, questions: [...response] }
                  }
                });
              }
            });
            this.modalClose();
          } catch (e) {
            console.error(e);
          }
        }
      });
    }
  }
};
</script>
