<template>
  <base-modal-content
    modal-title="Add new test session"
    :modal-close-action="modalClose"
  >
    <template #modal-body>
      <form>
        <base-input
          label="Duration(min)"
          type="number"
          :v="$v.duration"
          placeholder="1"
          v-model="duration"
        />
        <base-input
          label="Score"
          type="number"
          :v="$v.score"
          placeholder="1"
          v-model="score"
        />
        <div class="field is-grouped">
          <base-select
            label="Event"
            :v="$v.eventId"
            v-model="eventId"
            :options="eventsSelect"
          />
          <base-select
            label="Test"
            :v="$v.testId"
            v-model="testId"
            :options="testsSelect"
          />
        </div>
        <base-date-time-picker
          label="Start period"
          :v="$v.startPeriod"
          v-model="startPeriod"
          type="datetime"
          format="DD-MM-YYYY HH:mm"
        />
        <base-date-time-picker
          label="End period"
          :v="$v.endPeriod"
          v-model="endPeriod"
          type="datetime"
          format="DD-MM-YYYY HH:mm"
        />
      </form>
    </template>
    <template #modal-footer>
      <base-button @click="submitMethod" type="primary">Submit</base-button>
    </template>
  </base-modal-content>
</template>

<script>
import gql from 'graphql-tag';
import { mapState, mapMutations } from 'vuex';

import { DateTime } from 'luxon';

import POST_SESSION from '../graphql/Quiz/PostQuizSession.gql';
import SESSIONS_QUERY from '../graphql/Quiz/QuizSessions.gql';
import EVENTS_QUERY from '../graphql/Event/ProfessorEvents.gql';
import TESTS_QUERY from '../graphql/Quiz/Tests.gql';

import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import profileQueryMixin from '../mixins/profileQueryMixin';

import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseSelect from '@/components/BaseSelect.vue';
import BaseDateTimePicker from '@/components/BaseDatetimePicker.vue';
import BaseModalContent from '@/components/BaseModalContent.vue';

export default {
  name: 'quiz-session-modal',
  data() {
    return {
      duration: 0,
      score: 0,
      eventId: null,
      startPeriod: '',
      endPeriod: '',
      testId: null,
      events: [],
      tests: []
    };
  },
  async mounted() {
    const query = {};
    let queryName = '';
    if (this.profile && this.profile.professor) {
      query.professorId = this.profile.professor.id;
      queryName = gql`
        ${EVENTS_QUERY}
      `;
    }
    const eventsResponse = await this.$apollo.query({
      query: queryName,
      variables: {
        ...query
      }
    });
    this.events = [...eventsResponse.data.events];
  },
  apollo: {
    tests: TESTS_QUERY
  },
  mixins: [validationMixin, profileQueryMixin],
  computed: {
    ...mapState('Modal', ['modalOpen']),
    eventsSelect() {
      return this.events.length
        ? this.events.map(item => ({
            label: `${item.subject.name}-${item.eventType.type}`,
            value: item.id
          }))
        : [];
    },
    testsSelect() {
      return this.tests.length
        ? this.tests.map(item => ({
            label: item.title,
            value: item.id
          }))
        : [];
    }
  },
  methods: {
    ...mapMutations({
      modalClose: 'Modal/CLOSE_MODAL'
    }),
    modalCloseAction() {
      this.modalClose();
    },
    submitMethod() {
      if (!this.$v.$invalid) {
        try {
          this.$apollo.mutate({
            mutation: POST_SESSION,
            variables: {
              session: {
                duration: parseInt(this.duration),
                score: parseInt(this.score),
                eventId: this.eventId,
                startPeriod: DateTime.fromJSDate(this.startPeriod).toISODate(),
                endPeriod: DateTime.fromJSDate(this.endPeriod).toISODate(),
                testId: this.testId
              }
            },
            update: (store, { data: { postQuizSession } }) => {
              const data = store.readQuery({ query: SESSIONS_QUERY });
              data.sessions.push(postQuizSession);
              store.writeQuery({ query: SESSIONS_QUERY, data });
            }
          });
        } catch (e) {
          console.error(e);
        }
      }
      this.modalClose();
    }
  },
  components: {
    BaseModalContent,
    BaseButton,
    BaseInput,
    BaseSelect,
    BaseDateTimePicker
  },
  validations: {
    duration: { required },
    score: { required },
    eventId: { required },
    startPeriod: { required },
    endPeriod: { required },
    testId: { required }
  }
};
</script>
