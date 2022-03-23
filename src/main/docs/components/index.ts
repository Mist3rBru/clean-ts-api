import { badRequestComponent } from './bad-request'
import { forbiddenComponent } from './forbidden'
import { apiKeyAuthComponent } from './security'
import { serverErrorComponent } from './server-error'
import { unauthorizedErrorComponent } from './unauthorized-error'

export default {
  securitySchemes: {
    apiKeyAuth: apiKeyAuthComponent
  },
  forbidden: forbiddenComponent,
  badRequest: badRequestComponent,
  serverError: serverErrorComponent,
  unauthorizedError: unauthorizedErrorComponent
}
