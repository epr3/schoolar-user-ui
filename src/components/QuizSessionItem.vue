<template>
  <div class="box">
    <article class="media">
      <div class="media-content">
        <div>
          <strong>{{ code }}</strong>
          <p>
            <font-awesome-icon icon="clock"/>
            {{ duration }} minutes
          </p>
          <p>
            <small>@{{ subject }}</small>
          </p>
          <small>
            <font-awesome-icon icon="calendar"/>
            {{ startPeriod | humanDate }} - {{ endPeriod | humanDate}}
          </small>
        </div>
        <div class="level">
          <div class="level-left">
            <div class="level-item" @click="$router.push(`/quiz-sessions/${id}`)">
              <font-awesome-icon icon="search"/>Test overview
            </div>
            <div class="level-item" @click="deleteSessionAction(id)">
              <font-awesome-icon icon="trash"/>Delete
            </div>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<script>
import { DateTime } from 'luxon';

import SESSIONS_QUERY from '../graphql/Quiz/QuizSessions.gql';
import DELETE_QUIZ_SESSION from '../graphql/Quiz/DeleteQuizSession.gql';

export default {
  name: 'test-item',
  filters: {
    humanDate(value) {
      return DateTime.fromISO(value).toFormat('dd MMM yyyy HH:mm');
    }
  },
  props: {
    id: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      required: true
    },
    startPeriod: {
      type: String,
      required: true
    },
    endPeriod: {
      type: String,
      required: true
    },
    subject: {
      type: String,
      required: true
    }
  },
  methods: {
    deleteSessionAction(id) {
      this.$apollo.mutate({
        mutation: DELETE_QUIZ_SESSION,
        variables: {
          id
        },
        update: store => {
          const data = store.readQuery({ query: SESSIONS_QUERY });
          store.writeQuery({
            query: SESSIONS_QUERY,
            data: {
              ...data,
              quizSessions: data.quizSessions.filter(item => item.id !== id)
            }
          });
        }
      });
    }
  }
};
</script>
