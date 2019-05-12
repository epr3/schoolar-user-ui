import PROFILE_QUERY from '../graphql/Auth/Profile.gql';

export default {
  data: () => ({
    profile: null
  }),
  apollo: {
    profile: PROFILE_QUERY
  }
};
