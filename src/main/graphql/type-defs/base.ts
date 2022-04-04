import { gql } from 'apollo-server-express'

export default gql`
  scalar DateTime
  scalar Null

  directive @auth on FIELD_DEFINITION
  directive @authAdmin on FIELD_DEFINITION
  
  type Query {
    _: String
  }

  type Mutation {
    _: String
  }
`
