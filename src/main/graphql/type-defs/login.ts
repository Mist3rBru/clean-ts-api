import { gql } from 'apollo-server-express'

export default gql`
  type Query {
    login (email: String!, password: String!): AuthenticationModel!
  }

  type AuthenticationModel {
    accessToken: String!
    userName: String!
  }
`
