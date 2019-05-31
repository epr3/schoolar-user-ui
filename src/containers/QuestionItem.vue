<template>
  <div class="box">
    <div class="media">
      <div class="media-left">
        <h5 class="is-size-4 has-text-centered">{{ rating }}</h5>
        <font-awesome-icon icon="star" size="lg" />
      </div>
      <div class="media-content">
        <div class="content">
          <p>
            <strong>{{ description }}</strong>
            <br />
            <template v-if="answer">{{ answer.description }}</template>
          </p>
          <answer-form
            v-if="showAnswerForm"
            :question-id="id"
            :id="answer && answer.id"
            @reset:form="resetForm"
          />
        </div>
        <div v-if="isOpen" class="level is-mobile">
          <div class="level-left">
            <template v-if="permitShowVoted">
              <div v-if="!isVoted" class="level-item">
                <font-awesome-icon @click="postRating" icon="thumbs-up"/>
              </div>
              <div v-else class="level-item">
                <font-awesome-icon @click="deleteRating" icon="thumbs-down"/>
              </div>
            </template>
            <template v-if="!showAnswerForm && permitShowAnswerForm">
              <div class="level-item">
                <font-awesome-icon @click="showAnswerForm = !showAnswerForm" icon="edit"/>
              </div>
              <div class="level-item">
                <font-awesome-icon @click="deleteAnswerAction(answer.id)" icon="trash"/>
              </div>
            </template>
            <template v-if="permitShowQuestionActions">
              <div class="level-item">
                <font-awesome-icon @click="openQuestionModal({ question })" icon="edit"/>
              </div>
              <div class="level-item">
                <font-awesome-icon @click="deleteQuestionAction(id)" icon="trash"/>
              </div>
            </template>
          </div>
        </div>
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

import AnswerForm from '../containers/AnswerForm.vue';
import profileQueryMixin from '../mixins/profileQueryMixin';

export default {
  name: 'question-item',
  data() {
    return {
      showAnswerForm: !this.answer && this.isProfessor,
      permitShowAnswerForm: this.isProfessor,
      permitShowVoted: this.isStudent && !this.isOwner,
      permitShowQuestionActions: this.isOwner
    };
  },
  mixins: [profileQueryMixin],
  components: {
    AnswerForm
  },
  props: {
    question: {
      type: Object,
      required: true
    },
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
    },
    isOpen: {
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
            await this.$apollo.mutate({
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
