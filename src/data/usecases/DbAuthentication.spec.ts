import { DbAuthentication } from '@/data/usecases'
import { FindUserByEmailRepository, HashCompare, TokenGenerator } from '@/data/protocols'
import { AuthenticationModel } from '@/domain/usecases'
import { token, UserModel } from '@/domain/models'

interface SutTypes {
  sut: DbAuthentication
  findUserByEmailRepositorySpy: FindUserByEmailRepository
  hashCompareSpy: HashCompare
  tokenGeneratorSpy: TokenGenerator
}

const makeSut = (): SutTypes => {
  const tokenGeneratorSpy = new TokenGeneratorSpy()
  const hashCompareSpy = new HashCompareSpy()
  const findUserByEmailRepositorySpy = new FindUserByEmailRepositorySpy()
  const sut = new DbAuthentication(
    findUserByEmailRepositorySpy,
    hashCompareSpy,
    tokenGeneratorSpy
  )
  return {
    sut,
    findUserByEmailRepositorySpy,
    hashCompareSpy,
    tokenGeneratorSpy
  }
}

class FindUserByEmailRepositorySpy implements FindUserByEmailRepository {
  async find (email: string): Promise<UserModel> {
    return {
      id: 'any-id',
      name: 'any-name',
      email: email,
      password: 'hashed-password'
    }
  }
}

class HashCompareSpy implements HashCompare {
  async compare (value: string, hash: string): Promise<boolean> {
    return new Promise(resolve => resolve(true))
  }
}

class TokenGeneratorSpy implements TokenGenerator {
  async generate (value: string): Promise<token> {
    return new Promise(resolve => resolve('any-token'))
  }
}

const makeFakeCredentials = (): AuthenticationModel => ({
  email: 'any-email',
  password: 'any-password'
})

describe('DbAuthentication', () => {
  it('should call FindUserByEmailRepository with correct email', async () => {
    const { sut, findUserByEmailRepositorySpy } = makeSut()
    const findSpy = jest.spyOn(findUserByEmailRepositorySpy, 'find')
    const credentials = makeFakeCredentials()
    await sut.auth(credentials)
    expect(findSpy).toBeCalledWith('any-email')
  })
  
  it('should call HashCompare with correct values', async () => {
    const { sut, hashCompareSpy } = makeSut()
    const findSpy = jest.spyOn(hashCompareSpy, 'compare')
    const credentials = makeFakeCredentials()
    await sut.auth(credentials)
    expect(findSpy).toBeCalledWith('any-password', 'hashed-password')
  })
  
  it('should return null if no user is found', async () => {
    const { sut, findUserByEmailRepositorySpy } = makeSut()
    jest.spyOn(findUserByEmailRepositorySpy, 'find').mockReturnValueOnce(null)
    const credentials = makeFakeCredentials()
    const token = await sut.auth(credentials)
    expect(token).toBeNull()
  })
  
  it('should return null if password is invalid', async () => {
    const { sut, hashCompareSpy } = makeSut()
    jest.spyOn(hashCompareSpy, 'compare').mockImplementationOnce(
      async () => { return new Promise(resolve => resolve(false)) }
    )
    const credentials = makeFakeCredentials()
    const token = await sut.auth(credentials)
    expect(token).toBeNull()
  })
  
  it('should call TokenGenerator with correct value', async () => {
    const { sut, tokenGeneratorSpy } = makeSut()
    const generateSpy = jest.spyOn(tokenGeneratorSpy, 'generate')
    const credentials = makeFakeCredentials()
    await sut.auth(credentials)
    expect(generateSpy).toBeCalledWith('any-id')
  })
  
  it('should return token valid credentials are provided', async () => {
    const { sut } = makeSut()
    const credentials = makeFakeCredentials()
    const token = await sut.auth(credentials)
    expect(token).toBe('any-token')
  })

  it('should throw if any dependency throws', async () => {
    const findUserByEmailRepository = new FindUserByEmailRepositorySpy()
    const hashCompare = new HashCompareSpy()
    const tokenGenerator = new TokenGeneratorSpy()
    const suts = [].concat(
      new DbAuthentication(
        { find () { throw new Error() } },
        hashCompare,
        tokenGenerator
      ),
      new DbAuthentication(
        findUserByEmailRepository,
        { compare () { throw new Error() } },
        tokenGenerator
      ),
      new DbAuthentication(
        findUserByEmailRepository,
        hashCompare,
        { generate () { throw new Error() } }
      )
    )
    for (const sut of suts) {
      const credentials = makeFakeCredentials()
      const promise = sut.auth(credentials)
      void expect(promise).rejects.toThrow()
    }
  })
})
