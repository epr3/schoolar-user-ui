<template>
  <ul v-if="questions.length && profile">
    <li v-for="item in sortedQuestions" :key="item.id">
      <question-item
        :id="item.id"
        :answer="item.answer"
        :description="item.description"
        :rating="item.rating"
        :rating-obj="item.ratingObj"
        :is-voted="item.isVoted"
        :is-professor="!!profile.professor"
        :is-student="!!profile.student"
        :is-owner="profile.user.id === item.userId"
      />
    </li>
  </ul>
  <div v-else class="notification">No questions to show.</div>
</template>

<script>
import questionQueryMixin from '../mixins/questionQueryMixin';
import profileQueryMixin from '../mixins/profileQueryMixin';

import QuestionItem from './QuestionItem.vue';

export default {
  name: 'question-list',
  mixins: [profileQueryMixin, questionQueryMixin],
  components: {
    QuestionItem
  },
  computed: {
    sortedQuestions() {
      return this.questions.length
        ? this.questions
            .map(item => item)
            .sort((a, b) => (a.rating <= b.rating ? 1 : -1))
        : [];
    }
  }
};
</script>
