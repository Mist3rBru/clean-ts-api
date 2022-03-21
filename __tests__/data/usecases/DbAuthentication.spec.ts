import { DbAuthentication } from '@/data/usecases'
import { FindUserByEmailRepository, HashComparator, Encrypter } from '@/data/protocols'
import { AuthenticationParams } from '@/domain/usecases'
import { mockEncrypter, mockHashComparator, mockFindUserByEmailRepository } from '@/tests/data/mocks'

type SutTypes = {
  sut: DbAuthentication
  findUserByEmailRepositorySpy: FindUserByEmailRepository
  hashComparatorSpy: HashComparator
  encrypterSpy: Encrypter
}

const makeSut = (): SutTypes => {
  const encrypterSpy = mockEncrypter()
  const hashComparatorSpy = mockHashComparator()
  const findUserByEmailRepositorySpy = mockFindUserByEmailRepository()
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

const makeCredentials = (): AuthenticationParams => ({
  email: 'any-email',
  password: 'any-password'
})

describe('DbAuthentication', () => {
  it('should call FindUserByEmailRepository with correct email', async () => {
    const { sut, findUserByEmailRepositorySpy } = makeSut()
    const findSpy = jest.spyOn(findUserByEmailRepositorySpy, 'findByEmail')
    await sut.auth(makeCredentials())
    expect(findSpy).toBeCalledWith('any-email')
  })

  it('should call HashComparator with correct values', async () => {
    const { sut, hashComparatorSpy } = makeSut()
    const findSpy = jest.spyOn(hashComparatorSpy, 'compare')
    await sut.auth(makeCredentials())
    expect(findSpy).toBeCalledWith('any-password', 'hashed-password')
  })

  it('should return null if no user is found', async () => {
    const { sut, findUserByEmailRepositorySpy } = makeSut()
    jest
      .spyOn(findUserByEmailRepositorySpy, 'findByEmail')
      .mockReturnValueOnce(null)
    const token = await sut.auth(makeCredentials())
    expect(token).toBeNull()
  })

  it('should return null if password is invalid', async () => {
    const { sut, hashComparatorSpy } = makeSut()
    jest
      .spyOn(hashComparatorSpy, 'compare')
      .mockImplementationOnce(async () => false)
    const token = await sut.auth(makeCredentials())
    expect(token).toBeNull()
  })

  it('should call Encrypter with correct value', async () => {
    const { sut, encrypterSpy } = makeSut()
    const generateSpy = jest.spyOn(encrypterSpy, 'encrypt')
    await sut.auth(makeCredentials())
    expect(generateSpy).toBeCalledWith('any-id')
  })

  it('should return token valid credentials are provided', async () => {
    const { sut } = makeSut()
    const token = await sut.auth(makeCredentials())
    expect(token).toBe('any-token')
  })

  it('should throw if any dependency throws', async () => {
    const findUserByEmailRepository = mockFindUserByEmailRepository()
    const hashComparator = mockHashComparator()
    const encrypter = mockEncrypter()
    const suts = [].concat(
      new DbAuthentication(
        {
          findByEmail () {
            throw new Error()
          }
        },
        hashComparator,
        encrypter
      ),
      new DbAuthentication(
        findUserByEmailRepository,
        {
          compare () {
            throw new Error()
          }
        },
        encrypter
      ),
      new DbAuthentication(findUserByEmailRepository, hashComparator, {
        encrypt () {
          throw new Error()
        }
      })
    )
    for (const sut of suts) {
      const promise = sut.auth(makeCredentials())
      void expect(promise).rejects.toThrow()
    }
  })
})
