import { signupPath, loginPath, surveyPath, surveyResultPath } from './paths'
import { loginParamsSchema, userSchema, errorSchema, surveysSchema, surveyAnswerSchema, surveySchema, addSurveyParamsSchema, signupParamsSchema, SurveyResultSchema } from './schemas'
import { badRequestComponent, forbiddenComponent, serverErrorComponent, unauthorizedErrorComponent, apiKeyAuthComponent } from './components'

export default {
  openapi: '3.0.0',
  info: {
    title: 'CLEAN-TS-API',
    description: "Mangos's course API to make surveys between developers",
    version: '1.0.0'
  },
  servers: [{
    url: '/api',
    description: 'Main Server'
  }],
  paths: {
    '/signup': signupPath,
    '/login': loginPath,
    '/survey': surveyPath,
    '/survey/:surveyId/results': surveyResultPath
  },
  schemas: {
    signupParams: signupParamsSchema,
    loginParams: loginParamsSchema,
    surveyParams: addSurveyParamsSchema,
    user: userSchema,
    survey: surveySchema,
    surveys: surveysSchema,
    surveyAnswer: surveyAnswerSchema,
    surveyResult: SurveyResultSchema,
    error: errorSchema
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthComponent
    },
    forbidden: forbiddenComponent,
    badRequest: badRequestComponent,
    serverError: serverErrorComponent,
    unauthorizedError: unauthorizedErrorComponent
  }
}
