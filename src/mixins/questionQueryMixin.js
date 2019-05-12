import gql from 'graphql-tag';

import QUESTIONS_QUERY from '../graphql/Question/Questions.gql';
import POST_QUESTION_SUBSCRIPTION from '../graphql/Question/PostQuestionSubscription.gql';
import UPDATE_QUESTION_SUBSCRIPTION from '../graphql/Question/UpdateQuestionSubscription.gql';
import DELETE_QUESTION_SUBSCRIPTION from '../graphql/Question/DeleteQuestionSubscription.gql';
import POST_ANSWER_SUBSCRIPTION from '../graphql/Answer/PostAnswerSubscription.gql';
import UPDATE_ANSWER_SUBSCRIPTION from '../graphql/Answer/UpdateAnswerSubscription.gql';
import DELETE_ANSWER_SUBSCRIPTION from '../graphql/Answer/DeleteAnswerSubscription.gql';
import POST_RATING_SUBSCRIPTION from '../graphql/Rating/PostRatingSubscription.gql';
import DELETE_RATING_SUBSCRIPTION from '../graphql/Rating/DeleteRatingSubscription.gql';

export default {
  data() {
    return {
      routeParam: this.$route.params.id,
      questions: []
    };
  },
  apollo: {
    questions: {
      query: gql`
        ${QUESTIONS_QUERY}
      `,
      variables() {
        return {
          sessionId: this.routeParam
        };
      },
      subscribeToMore: [
        {
          document: POST_RATING_SUBSCRIPTION,
          updateQuery: (
            previousData,
            {
              subscriptionData: {
                data: { postRating }
              }
            }
          ) => ({
            ...previousData,
            questions: previousData.questions.map(item => {
              if (item.id === postRating.questionId) {
                item.ratingObj = { ...postRating };
                item.rating++;
                item.isVoted = true;
              }

              return item;
            })
          })
        },
        {
          document: DELETE_RATING_SUBSCRIPTION,
          updateQuery: (
            previousData,
            {
              subscriptionData: {
                data: { deleteRating }
              }
            }
          ) => ({
            ...previousData,
            questions: previousData.questions.map(item => {
              if (item.ratingObj && item.ratingObj.id === deleteRating.id) {
                item.isVoted = false;
                item.ratingObj = null;
              }

              if (deleteRating.questionId === item.id) {
                item.rating--;
              }

              return item;
            })
          })
        },
        {
          document: UPDATE_ANSWER_SUBSCRIPTION,
          updateQuery: (
            previousData,
            {
              subscriptionData: {
                data: { updateAnswer }
              }
            }
          ) => ({
            ...previousData,
            questions: previousData.questions.map(item => {
              if (item.id === updateAnswer.questionId) {
                item.answer = { ...updateAnswer };
              }

              return item;
            })
          })
        },
        {
          document: DELETE_QUESTION_SUBSCRIPTION,
          updateQuery: (
            previousData,
            {
              subscriptionData: {
                data: { deleteQuestion }
              }
            }
          ) => {
            console.log(previousData);
            return {
              ...previousData,
              questions: previousData.questions.filter(
                item => item.id !== deleteQuestion
              )
            };
          }
        },
        {
          document: UPDATE_QUESTION_SUBSCRIPTION,
          updateQuery: (
            previousData,
            {
              subscriptionData: {
                data: { updateQuestion }
              }
            }
          ) => ({
            ...previousData,
            questions: previousData.questions.map(item => {
              if (item.id === updateQuestion.id) {
                return { ...updateQuestion };
              }
              return item;
            })
          })
        },
        {
          document: POST_QUESTION_SUBSCRIPTION,
          updateQuery: (
            previousData,
            {
              subscriptionData: {
                data: { postQuestion }
              }
            }
          ) => ({
            ...previousData,
            questions: previousData.questions.concat(postQuestion)
          })
        },
        {
          document: POST_ANSWER_SUBSCRIPTION,
          updateQuery: (
            previousData,
            {
              subscriptionData: {
                data: { postAnswer }
              }
            }
          ) => ({
            ...previousData,
            questions: previousData.questions.map(item => {
              if (item.id === postAnswer.questionId) {
                item.answer = { ...postAnswer };
              }

              return item;
            })
          })
        },
        {
          document: DELETE_ANSWER_SUBSCRIPTION,
          updateQuery: (
            previousData,
            {
              subscriptionData: {
                data: { deleteAnswer }
              }
            }
          ) => ({
            ...previousData,
            questions: previousData.questions.map(item => {
              if (item.answer.id === deleteAnswer) {
                item.answer = null;
              }
              return item;
            })
          })
        }
      ]
    }
  }
};
