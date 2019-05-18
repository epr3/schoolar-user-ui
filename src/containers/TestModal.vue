<template>
  <base-modal-content
    :modal-title="`${id ? 'Edit Test' : 'Add new test'}`"
    :modal-close-action="modalClose"
  >
    <template #modal-body>
      <form>
        <base-input
          label="Title"
          type="test"
          :v="$v.test.title"
          placeholder="Title"
          v-model="test.title"
        />
        <base-textarea
          label="Description"
          :v="$v.test.description"
          placeholder="Describe your test here"
          v-model="test.description"
        />
        <base-select
          :v="$v.test.subjectId"
          label="Subject"
          v-model="test.subjectId"
          :options="subjectSelect"
        />
      </form>
    </template>
    <template #modal-footer>
      <base-button @click="submitMethod" type="primary">Submit</base-button>
    </template>
  </base-modal-content>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

import POST_TEST from '../graphql/Quiz/PostTest.gql';
import UPDATE_TEST from '../graphql/Quiz/UpdateTest.gql';
import TEST_QUERY from '../graphql/Quiz/Test.gql';
import TESTS_QUERY from '../graphql/Quiz/Tests.gql';
import SUBJECTS_QUERY from '../graphql/Subject/Subjects.gql';

import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';

import BaseModalContent from '../components/BaseModalContent';
import BaseInput from '../components/BaseInput';
import BaseSelect from '../components/BaseSelect';
import BaseTextarea from '../components/BaseTextarea';
import BaseButton from '../components/BaseButton';

export default {
  name: 'test-form',
  data() {
    return {
      test: {
        description: '',
        title: '',
        subjectId: null
      },
      subjects: []
    };
  },
  apollo: {
    subjects: SUBJECTS_QUERY
  },
  mixins: [validationMixin],
  components: {
    BaseTextarea,
    BaseInput,
    BaseButton,
    BaseSelect,
    BaseModalContent
  },
  validations: {
    test: {
      description: {
        required
      },
      title: {
        required
      },
      subjectId: {
        required
      }
    }
  },
  props: {
    id: {
      type: String
    }
  },
  async mounted() {
    if (this.id) {
      const response = await this.$apollo.query({
        query: TEST_QUERY,
        variables: { id: this.id }
      });
      this.test.title = response.data.test.title;
      this.test.description = response.data.test.description;
      this.test.subjectId = response.data.test.subject.id;
    }
  },
  computed: {
    ...mapState('Modal', ['modalOpen', 'modalComponent']),
    subjectSelect() {
      return this.subjects.length
        ? this.subjects.map(item => ({
            id: item.id,
            label: item.name,
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
        if (this.id) {
          try {
            this.$apollo.mutate({
              mutation: UPDATE_TEST,
              variables: {
                test: { id: this.id, ...this.test }
              },
              update: (store, { data: { updateTest } }) => {
                const data = store.readQuery({ query: TESTS_QUERY });
                const itemIndex = data.tests.findIndex(
                  item => item.id === updateTest.id
                );
                store.writeQuery({
                  query: TESTS_QUERY,
                  data: {
                    ...data,
                    tests: data.tests.map((item, index) => {
                      if (index !== itemIndex) {
                        return item;
                      }

                      return { ...item, ...updateTest };
                    })
                  }
                });
              }
            });
          } catch (e) {
            console.error(e);
          }
        } else {
          try {
            this.$apollo.mutate({
              mutation: POST_TEST,
              variables: {
                test: this.test
              },
              update: (store, { data: { postTest } }) => {
                const data = store.readQuery({ query: TESTS_QUERY });
                data.tests.push(postTest);
                store.writeQuery({ query: TESTS_QUERY, data });
              }
            });
          } catch (e) {
            console.error(e);
          }
        }
        this.modalClose();
      }
    }
  }
};
</script>
