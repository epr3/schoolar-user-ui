<template>
  <base-modal-content
    :modal-title="`${test ? 'Edit Test' : 'Add new test'}`"
    :modal-close-action="modalClose"
  >
    <template #modal-body>
      <form>
        <base-input label="Title" type="text" :v="$v.title" placeholder="Title" v-model="title"/>
        <base-textarea
          label="Description"
          :v="$v.description"
          placeholder="Describe your test here"
          v-model="description"
        />
        <base-select
          :v="$v.subjectId"
          label="Subject"
          v-model="subjectId"
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
import TESTS_QUERY from '../graphql/Quiz/Tests.gql';
import SUBJECTS_QUERY from '../graphql/Subject/Subjects.gql';

import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';

import BaseModalContent from '../components/BaseModalContent';
import BaseInput from '../components/BaseInput';
import BaseSelect from '../components/BaseSelect';
import BaseTextarea from '../components/BaseTextarea';
import BaseButton from '../components/BaseButton';
import errorHandler from '../utils/errorHandler';

export default {
  name: 'test-form',
  data() {
    return {
      description: '',
      title: '',
      subjectId: null,
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
    description: {
      required
    },
    title: {
      required
    },
    subjectId: {
      required
    }
  },
  props: {
    test: {
      type: Object,
      default: null
    }
  },
  mounted() {
    if (this.test) {
      this.title = this.test.title;
      this.description = this.test.description;
      this.subjectId = this.test.subjectId;
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
    async submitMethod() {
      if (!this.$v.$invalid) {
        if (this.id) {
          try {
            await this.$apollo.mutate({
              mutation: UPDATE_TEST,
              variables: {
                test: {
                  id: this.test.id,
                  title: this.title,
                  description: this.description,
                  subjectId: this.subjectId
                }
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
            errorHandler(e);
          }
        } else {
          try {
            await this.$apollo.mutate({
              mutation: POST_TEST,
              variables: {
                test: {
                  description: this.description,
                  title: this.title,
                  subjectId: this.subjectId
                }
              },
              update: (store, { data: { postTest } }) => {
                const data = store.readQuery({ query: TESTS_QUERY });
                data.tests.push(postTest);
                store.writeQuery({ query: TESTS_QUERY, data });
              }
            });
          } catch (e) {
            errorHandler(e);
          }
        }
        this.modalClose();
      }
    }
  }
};
</script>
