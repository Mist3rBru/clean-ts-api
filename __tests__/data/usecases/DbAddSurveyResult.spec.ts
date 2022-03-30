import { DbAddSurveyResult } from '@/data/usecases'
import { mockAddSurveyResultParams } from '@/tests/domain/mocks'
import { LoadSurveyResultRepositorySpy, AddSurveyResultRepositorySpy } from '@/tests/data/mocks'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbAddSurveyResult
  addSurveyResultRepositorySpy: AddSurveyResultRepositorySpy
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy()
  const addSurveyResultRepositorySpy = new AddSurveyResultRepositorySpy()
  const sut = new DbAddSurveyResult(addSurveyResultRepositorySpy, loadSurveyResultRepositorySpy)
  return {
    sut,
    addSurveyResultRepositorySpy,
    loadSurveyResultRepositorySpy
  }
}

describe('DbSaveSurveyResult', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
  })

  afterAll(async () => {
    MockDate.reset()
  })

  it('should call SaveSurveyResultRepository with correct value', async () => {
    const { sut, addSurveyResultRepositorySpy } = makeSut()
    const model = mockAddSurveyResultParams()
    await sut.add(model)
    expect(addSurveyResultRepositorySpy.data).toEqual(model)
  })

  it('should return survey on success', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    const model = mockAddSurveyResultParams()
    const survey = await sut.add(model)
    expect(survey.surveyId).toBe(loadSurveyResultRepositorySpy.surveyResult.surveyId)
    expect(survey.answers[0].answer).toBe(loadSurveyResultRepositorySpy.surveyResult.answers[0].answer)
  })

  it('should throw if any dependency throws', async () => {
    const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy()
    const addSurveyResultRepositorySpy = new AddSurveyResultRepositorySpy()
    const suts = [].concat(
      new DbAddSurveyResult(
        { add () { throw new Error() } },
        loadSurveyResultRepositorySpy
      ),
      new DbAddSurveyResult(
        addSurveyResultRepositorySpy,
        { load () { throw new Error() } }
      )
    )
    for (const sut of suts) {
      const promise = sut.add(mockAddSurveyResultParams())
      await expect(promise).rejects.toThrow()
    }
  })
})
