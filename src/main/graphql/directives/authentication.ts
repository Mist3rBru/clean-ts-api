import { makeAuthMiddleware } from '@/main/composers/middlewares'
import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils'
import { ForbiddenError } from 'apollo-server-express'
import { GraphQLSchema } from 'graphql'

export const authDirectiveTransformer = (schema: GraphQLSchema): GraphQLSchema => {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const authDirective = getDirective(schema, fieldConfig, 'auth')
      const authAdminDirective = getDirective(schema, fieldConfig, 'authAdmin')
      const role = authAdminDirective ? 'admin' : null
      if (authDirective || authAdminDirective) {
        const { resolve } = fieldConfig
        fieldConfig.resolve = async (parent, args, context, info) => {
          const request = { authorization: context?.req?.headers?.authorization }
          const httpResponse = await makeAuthMiddleware(role).handle(request)
          if (httpResponse.statusCode === 200) {
            Object.assign(context?.req, httpResponse.body)
            return resolve.call(this, parent, args, context, info)
          } else {
            throw new ForbiddenError(httpResponse.body.message)
          }
        }
      }
      return fieldConfig
    }
  })
}
