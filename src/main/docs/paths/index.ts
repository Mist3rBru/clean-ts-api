import { loginPath } from './login'
import { signupPath } from './signup'
import { surveyPath } from './survey'
import { surveyResultPath } from './survey-result'

export default {
  '/signup': signupPath,
  '/login': loginPath,
  '/survey': surveyPath,
  '/survey/:surveyId/results': surveyResultPath
}
