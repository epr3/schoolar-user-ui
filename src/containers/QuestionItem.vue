<template>
  <div class="card">
    <div class="card-header">
      <span class="card-header-title">Rating: {{ rating }}</span>
      <div class="buttons" v-if="permitShowVoted && !permitShowQuestionActions">
        <base-button v-if="!isVoted" type="primary" @click="postRating">
          Vote
        </base-button>
        <base-button type="danger" v-else @click="deleteRating">
          Unvote
        </base-button>
      </div>
    </div>
    <div class="card-content">
      <p class="title">{{ description }}</p>
      <p v-if="answer" class="subtitle">{{ answer.description }}</p>
      <answer-form
        v-if="showAnswerForm"
        :question-id="id"
        :id="answer && answer.id"
        @reset:form="resetForm"
      />
    </div>
    <div v-if="!showAnswerForm && permitShowAnswerForm" class="card-footer">
      <div class="card-footer-item" @click="showAnswerForm = !showAnswerForm">
        Edit answer
      </div>
      <div class="card-footer-item" @click="deleteAnswerAction(answer.id)">
        Delete answer
      </div>
    </div>
    <div v-if="permitShowQuestionActions" class="card-footer">
      <div class="card-footer-item" @click="openQuestionModal({ id })">
        Edit question
      </div>
      <div class="card-footer-item" @click="deleteQuestionAction(id)">
        Delete question
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

import POST_RATING from '../graphql/Rating/PostRating.gql';
import DELETE_RATING from '../graphql/Rating/DeleteRating.gql';
import DELETE_ANSWER from '../graphql/Answer/DeleteAnswer.gql';
import DELETE_QUESTION from '../graphql/Question/DeleteQuestion.gql';

import BaseButton from '../components/BaseButton.vue';

import AnswerForm from '../containers/AnswerForm.vue';
import profileQueryMixin from '../mixins/profileQueryMixin';

export default {
  name: 'question-item',
  data() {
    return {
      showAnswerForm: !this.answer && this.isProfessor,
      permitShowAnswerForm: this.isProfessor,
      permitShowVoted: this.isStudent,
      permitShowQuestionActions: this.isOwner
    };
  },
  mixins: [profileQueryMixin],
  components: {
    AnswerForm,
    BaseButton
  },
  props: {
    id: {
      type: String,
      require: true
    },
    description: {
      type: String,
      required: true
    },
    answer: {
      type: Object,
      default: null
    },
    isProfessor: {
      type: Boolean,
      default: false
    },
    isOwner: {
      type: Boolean,
      default: false
    },
    isStudent: {
      type: Boolean,
      default: false
    },
    rating: {
      type: Number,
      required: true
    },
    ratingObj: {
      type: Object,
      default: null
    },
    isVoted: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    ...mapMutations({
      openModal: 'Modal/OPEN_MODAL',
      modalClose: 'Modal/CLOSE_MODAL'
    }),
    resetForm() {
      this.showAnswerForm = false;
    },
    openQuestionModal(props) {
      this.openModal({
        component: () => import('@/containers/QuestionModal.vue'),
        props
      });
    },
    openConfirmationModal(props) {
      this.openModal({
        component: () => import('@/components/ConfirmationModal.vue'),
        props
      });
    },
    postRating() {
      try {
        this.$apollo.mutate({
          mutation: POST_RATING,
          variables: {
            rating: {
              userId: this.profile.user.id,
              questionId: this.id
            }
          }
        });
        this.modalClose();
      } catch (e) {
        console.error(e);
      }
    },
    deleteRating() {
      try {
        this.$apollo.mutate({
          mutation: DELETE_RATING,
          variables: {
            id: this.ratingObj.id
          }
        });
        this.modalClose();
      } catch (e) {
        console.error(e);
      }
    },
    deleteQuestionAction(id) {
      this.openConfirmationModal({
        modalTitle: 'Delete question',
        modalCloseAction: this.modalClose,
        modalSuccessAction: async () => {
          try {
            this.$apollo.mutate({
              mutation: DELETE_QUESTION,
              variables: {
                id
              }
            });
            this.modalClose();
          } catch (e) {
            console.error(e);
          }
        }
      });
    },
    deleteAnswerAction(id) {
      this.openConfirmationModal({
        modalTitle: 'Delete answer',
        modalCloseAction: this.modalClose,
        modalSuccessAction: async () => {
          try {
            this.$apollo.mutate({
              mutation: DELETE_ANSWER,
              variables: {
                id
              }
            });
            this.modalClose();
            this.showAnswerForm = true;
          } catch (e) {
            console.error(e);
          }
        }
      });
    }
  }
};
</script>
