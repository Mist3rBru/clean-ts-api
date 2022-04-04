import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    surveys: [Survey!]! @auth
  }

  extend type Mutation {
    survey (question: String!, answers: [SurveyAnswerParams!]!): Null @authAdmin
  }

  input SurveyAnswerParams {
    image: String
    answer: String!
  }

  type Survey {
    id: ID!
    question: String!
    answers: [SurveyAnswer!]!
    date: DateTime!
  }

  type SurveyAnswer {
    image: String
    answer: String!
  }
`
