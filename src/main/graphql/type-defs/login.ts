import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    login (email: String!, password: String!): AuthenticationModel!
  }

  extend type Mutation {
    signUp (name: String!, email: String!, password: String!, passwordConfirmation: String!): AuthenticationModel!
  }

  type AuthenticationModel {
    accessToken: String!
    userName: String!
  }
`
