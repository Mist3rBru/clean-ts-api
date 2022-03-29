import { DbAuthentication } from '@/data/usecases'
import { AuthenticationParams } from '@/domain/usecases'
import { EncrypterSpy, HashComparatorSpy, FindUserByEmailRepositorySpy } from '@/tests/data/mocks'
import faker from '@faker-js/faker'

type SutTypes = {
  sut: DbAuthentication
  findUserByEmailRepositorySpy: FindUserByEmailRepositorySpy
  hashComparatorSpy: HashComparatorSpy
  encrypterSpy: EncrypterSpy
}

const makeSut = (): SutTypes => {
  const encrypterSpy = new EncrypterSpy()
  const hashComparatorSpy = new HashComparatorSpy()
  const findUserByEmailRepositorySpy = new FindUserByEmailRepositorySpy()
  const sut = new DbAuthentication(
    findUserByEmailRepositorySpy,
    hashComparatorSpy,
    encrypterSpy
  )
  return {
    sut,
    findUserByEmailRepositorySpy,
    hashComparatorSpy,
    encrypterSpy
  }
}

const mockCredentials = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})

describe('DbAuthentication', () => {
  it('should call FindUserByEmailRepository with correct email', async () => {
    const { sut, findUserByEmailRepositorySpy } = makeSut()
    const credentials = mockCredentials()
    await sut.auth(credentials)
    expect(findUserByEmailRepositorySpy.email).toBe(credentials.email)
  })

  it('should call HashComparator with correct values', async () => {
    const { sut, hashComparatorSpy, findUserByEmailRepositorySpy } = makeSut()
    const credentials = mockCredentials()
    await sut.auth(credentials)
    expect(hashComparatorSpy.value).toBe(credentials.password)
    expect(hashComparatorSpy.hash).toBe(findUserByEmailRepositorySpy.user.password)
  })

  it('should return null if no user is found', async () => {
    const { sut, findUserByEmailRepositorySpy } = makeSut()
    findUserByEmailRepositorySpy.user = null
    const token = await sut.auth(mockCredentials())
    expect(token).toBeNull()
  })

  it('should return null if password is invalid', async () => {
    const { sut, hashComparatorSpy } = makeSut()
    hashComparatorSpy.isValid = false
    const token = await sut.auth(mockCredentials())
    expect(token).toBeNull()
  })

  it('should call Encrypter with correct value', async () => {
    const { sut, encrypterSpy, findUserByEmailRepositorySpy } = makeSut()
    await sut.auth(mockCredentials())
    expect(encrypterSpy.value).toBe(findUserByEmailRepositorySpy.user.id)
  })

  it('should return token valid credentials are provided', async () => {
    const { sut, encrypterSpy, findUserByEmailRepositorySpy } = makeSut()
    const authModel = await sut.auth(mockCredentials())
    expect(authModel).toEqual({
      accessToken: encrypterSpy.token,
      userName: findUserByEmailRepositorySpy.user.name
    })
  })

  it('should throw if any dependency throws', async () => {
    const findUserByEmailRepositorySpy = new FindUserByEmailRepositorySpy()
    const hashComparatorSpy = new HashComparatorSpy()
    const encrypterSpy = new EncrypterSpy()
    const suts = [].concat(
      new DbAuthentication(
        { findByEmail () { throw new Error() } },
        hashComparatorSpy,
        encrypterSpy
      ),
      new DbAuthentication(
        findUserByEmailRepositorySpy,
        { compare () { throw new Error() } },
        encrypterSpy
      ),
      new DbAuthentication(
        findUserByEmailRepositorySpy,
        hashComparatorSpy,
        { encrypt () { throw new Error() } }
      )
    )
    for (const sut of suts) {
      const promise = sut.auth(mockCredentials())
      await expect(promise).rejects.toThrow()
    }
  })
})
