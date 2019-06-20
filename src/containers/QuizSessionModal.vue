<template>
  <base-modal-content modal-title="Add new test session" :modal-close-action="modalClose">
    <template #modal-body>
      <form>
        <base-input
          label="Duration(min)"
          type="number"
          :v="$v.duration"
          placeholder="1"
          v-model="duration"
        />
        <base-select label="Event" :v="$v.eventId" v-model="eventId" :options="eventsSelect"/>
        <base-select label="Test" :v="$v.testId" v-model="testId" :options="testsSelect"/>
        <div class="field is-grouped">
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
        </div>
      </form>
    </template>
    <template #modal-footer>
      <base-button @click="submitMethod" type="primary" :disabled="loading">Submit</base-button>
    </template>
  </base-modal-content>
</template>

<style lang="scss" scoped>
.modal-card {
  overflow: visible;
  /deep/ .modal-card-body {
    overflow: visible;
  }
}
</style>

<script>
import gql from 'graphql-tag';
import { mapState, mapMutations } from 'vuex';

import { DateTime } from 'luxon';

import loadingMixin from '../mixins/loadingMixin';

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
import errorHandler from '../utils/errorHandler';

export default {
  name: 'quiz-session-modal',
  data() {
    return {
      duration: 0,
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
      query.userId = this.profile.user.id;
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
  mixins: [validationMixin, profileQueryMixin, loadingMixin],
  computed: {
    ...mapState('Modal', ['modalOpen']),
    eventsSelect() {
      return this.events.length
        ? this.events.map(item => ({
            label: `${item.subject.name}-${item.eventType.type}-${
              item.group.number
            }`,
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
    async submitMethod() {
      if (!this.$v.$invalid) {
        this.loading = true;
        try {
          await this.$apollo.mutate({
            mutation: POST_SESSION,
            variables: {
              session: {
                duration: parseInt(this.duration),
                eventId: this.eventId,
                startPeriod: DateTime.fromJSDate(this.startPeriod).toISO(),
                endPeriod: DateTime.fromJSDate(this.endPeriod).toISO(),
                testId: this.testId
              }
            },
            update: (store, { data: { postQuizSession } }) => {
              const data = store.readQuery({ query: SESSIONS_QUERY });
              data.quizSessions.push(postQuizSession);
              store.writeQuery({ query: SESSIONS_QUERY, data });
            }
          });
          this.modalClose();
        } catch (e) {
          errorHandler(e);
        }
        this.loading = false;
      }
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
    eventId: { required },
    startPeriod: { required },
    endPeriod: { required },
    testId: { required }
  }
};
</script>
