<template>
  <base-modal-content modal-title="Add new test session" :modal-close-action="modalClose">
    <template #modal-body>
      <form>
        <div class="field is-grouped">
          <base-input
            label="Duration(min)"
            type="number"
            :v="$v.duration"
            placeholder="1"
            v-model="duration"
          />
          <base-input label="Room" type="text" :v="$v.room" placeholder="2000" v-model="room"/>
        </div>
        <div class="field is-grouped">
          <base-select label="Event" :v="$v.eventId" v-model="eventId" :options="eventsSelect"/>
          <base-select
            label="Event Type"
            :v="$v.eventTypeId"
            v-model="eventTypeId"
            :options="eventTypesSelect"
          />
        </div>
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
import EVENT_TYPES_QUERY from '../graphql/EventType/EventTypes.gql';
import TESTS_QUERY from '../graphql/Quiz/Tests.gql';

import { validationMixin } from 'vuelidate';
import { required, numeric, minValue } from 'vuelidate/lib/validators';
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
      room: '',
      duration: 0,
      eventId: null,
      startPeriod: '',
      endPeriod: '',
      testId: null,
      eventTypeId: null,
      events: [],
      tests: [],
      eventTypes: []
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
    tests: TESTS_QUERY,
    eventTypes: {
      query: gql`
        ${EVENT_TYPES_QUERY}
      `,
      variables: {
        isTest: 1
      }
    }
  },
  mixins: [validationMixin, profileQueryMixin, loadingMixin],
  computed: {
    ...mapState('Modal', ['modalOpen']),
    eventTypesSelect() {
      const nullObj = { id: 'rdgfewar', value: null, label: 'None' };
      return this.eventTypes.length
        ? [
            nullObj,
            ...this.eventTypes
              .filter(item => item.isTest)
              .map(item => ({
                label: item.type,
                value: item.id
              }))
          ]
        : [nullObj];
    },
    eventsSelect() {
      const nullObj = { id: '43ui5hhi2t', value: null, label: 'None' };
      return this.events.length
        ? [
            nullObj,
            ...this.events
              .filter(item => !item.eventType.isTest)
              .map(item => ({
                label: `${item.subject.name}-${item.eventType.type}-${
                  item.group.number
                }`,
                value: item.id
              }))
          ]
        : [nullObj];
    },
    testsSelect() {
      const nullObj = { id: '3264ytet', value: null, label: 'None' };
      return this.tests.length
        ? [
            nullObj,
            ...this.tests.map(item => ({
              label: item.title,
              value: item.id
            }))
          ]
        : [nullObj];
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
                eventTypeId: this.eventTypeId,
                startPeriod: DateTime.fromJSDate(this.startPeriod).toISO(),
                endPeriod: DateTime.fromJSDate(this.endPeriod).toISO(),
                testId: this.testId,
                room: this.room
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
    duration: { required, numeric, minValue: minValue(0) },
    eventId: { required },
    startPeriod: { required },
    endPeriod: { required },
    testId: { required },
    eventTypeId: { required },
    room: { required }
  }
};
</script>
