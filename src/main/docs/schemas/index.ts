import { errorSchema } from './errors'
import { signupParamsSchema, loginParamsSchema, addSurveyParamsSchema } from './params'
import { SurveyResultAnswerSchema, SurveyResultSchema } from './survey-result'
import { surveySchema, surveysSchema, surveyAnswerSchema } from './surveys'
import { userSchema } from './users'

export default {
  signupParams: signupParamsSchema,
  loginParams: loginParamsSchema,
  surveyParams: addSurveyParamsSchema,
  user: userSchema,
  survey: surveySchema,
  surveys: surveysSchema,
  surveyAnswer: surveyAnswerSchema,
  surveyResult: SurveyResultSchema,
  surveyResultAnswer: SurveyResultAnswerSchema,
  error: errorSchema
}
