import { DbAuthentication } from '@/data/usecases'
import {
  FindUserByEmailRepository,
  HashComparator,
  token,
  Encrypter,
} from '@/data/protocols'
import { AuthenticationParams } from '@/domain/usecases'
import { UserModel } from '@/domain/models'

type SutTypes = {
  sut: DbAuthentication
  findUserByEmailRepositorySpy: FindUserByEmailRepository
  hashComparatorSpy: HashComparator
  encrypterSpy: Encrypter
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
    encrypterSpy,
  }
}

class FindUserByEmailRepositorySpy implements FindUserByEmailRepository {
  async findByEmail(email: string): Promise<UserModel> {
    return {
      id: 'any-id',
      name: 'any-name',
      email: email,
      password: 'hashed-password',
    }
  }
}

class HashComparatorSpy implements HashComparator {
  async compare(value: string, hash: string): Promise<boolean> {
    return new Promise((resolve) => resolve(true))
  }
}

class EncrypterSpy implements Encrypter {
  async encrypt(value: string): Promise<token> {
    return new Promise((resolve) => resolve('any-token'))
  }
}

const makeFakeCredentials = (): AuthenticationParams => ({
  email: 'any-email',
  password: 'any-password',
})

describe('DbAuthentication', () => {
  it('should call FindUserByEmailRepository with correct email', async () => {
    const { sut, findUserByEmailRepositorySpy } = makeSut()
    const findSpy = jest.spyOn(findUserByEmailRepositorySpy, 'findByEmail')
    const credentials = makeFakeCredentials()
    await sut.auth(credentials)
    expect(findSpy).toBeCalledWith('any-email')
  })

  it('should call HashComparator with correct values', async () => {
    const { sut, hashComparatorSpy } = makeSut()
    const findSpy = jest.spyOn(hashComparatorSpy, 'compare')
    const credentials = makeFakeCredentials()
    await sut.auth(credentials)
    expect(findSpy).toBeCalledWith('any-password', 'hashed-password')
  })

  it('should return null if no user is found', async () => {
    const { sut, findUserByEmailRepositorySpy } = makeSut()
    jest
      .spyOn(findUserByEmailRepositorySpy, 'findByEmail')
      .mockReturnValueOnce(null)
    const credentials = makeFakeCredentials()
    const token = await sut.auth(credentials)
    expect(token).toBeNull()
  })

  it('should return null if password is invalid', async () => {
    const { sut, hashComparatorSpy } = makeSut()
    jest
      .spyOn(hashComparatorSpy, 'compare')
      .mockImplementationOnce(async () => false)
    const credentials = makeFakeCredentials()
    const token = await sut.auth(credentials)
    expect(token).toBeNull()
  })

  it('should call Encrypter with correct value', async () => {
    const { sut, encrypterSpy } = makeSut()
    const generateSpy = jest.spyOn(encrypterSpy, 'encrypt')
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
    const hashComparator = new HashComparatorSpy()
    const encrypter = new EncrypterSpy()
    const suts = [].concat(
      new DbAuthentication(
        {
          findByEmail() {
            throw new Error()
          },
        },
        hashComparator,
        encrypter
      ),
      new DbAuthentication(
        findUserByEmailRepository,
        {
          compare() {
            throw new Error()
          },
        },
        encrypter
      ),
      new DbAuthentication(findUserByEmailRepository, hashComparator, {
        encrypt() {
          throw new Error()
        },
      })
    )
    for (const sut of suts) {
      const credentials = makeFakeCredentials()
      const promise = sut.auth(credentials)
      void expect(promise).rejects.toThrow()
    }
  })
})
