import { TokenValidator } from '@/data/protocols'
import { DbFindUserByToken } from '@/data/usecases'

interface SutTypes {
  sut: DbFindUserByToken
  tokenValidatorSpy: TokenValidator
}

const makeSut = (): SutTypes => {
  const tokenValidatorSpy = new TokenValidatorSpy()
  const sut = new DbFindUserByToken(
    tokenValidatorSpy
  )
  return {
    sut,
    tokenValidatorSpy
  }
}

class TokenValidatorSpy implements TokenValidator {
  async validate (token: string): Promise<string> {
    return 'any-id'
  }
}

describe('DbFindUserByToken', () => {
  it('should call TokenValidator with correct value', async () => {
    const { sut, tokenValidatorSpy } = makeSut()
    const validateSpy = jest.spyOn(tokenValidatorSpy, 'validate')
    await sut.find('any-token')
    expect(validateSpy).toBeCalledWith('any-token')
  })
})
