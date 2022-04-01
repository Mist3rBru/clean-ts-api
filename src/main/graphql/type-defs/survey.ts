import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    survey: [Survey!]! @auth
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
