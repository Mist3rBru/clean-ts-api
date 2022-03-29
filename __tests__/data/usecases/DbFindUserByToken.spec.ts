import { DbFindUserByToken } from '@/data/usecases'
import { DecrypterSpy, FindUserByIdRepositorySpy } from '@/tests/data/mocks'

type SutTypes = {
  sut: DbFindUserByToken
  decrypterSpy: DecrypterSpy
  findUserByIdRepositorySpy: FindUserByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const findUserByIdRepositorySpy = new FindUserByIdRepositorySpy()
  const decrypterSpy = new DecrypterSpy()
  const sut = new DbFindUserByToken(decrypterSpy, findUserByIdRepositorySpy)
  return {
    sut,
    decrypterSpy,
    findUserByIdRepositorySpy
  }
}

describe('DbFindUserByToken', () => {
  it('should call Decrypter with correct value', async () => {
    const { sut, decrypterSpy } = makeSut()
    await sut.findByToken('any-token')
    expect(decrypterSpy.token).toBe('any-token')
  })

  it('should return null if Decrypter returns null', async () => {
    const { sut, decrypterSpy } = makeSut()
    decrypterSpy.payload = null
    const user = await sut.findByToken('any-token')
    expect(user).toBeNull()
  })

  it('should call FindUserByIdRepository with correct value', async () => {
    const { sut, findUserByIdRepositorySpy, decrypterSpy } = makeSut()
    await sut.findByToken('any-token')
    expect(findUserByIdRepositorySpy.id).toBe(decrypterSpy.payload)
  })

  it('should return null if FindUserByIdRepository returns null', async () => {
    const { sut, findUserByIdRepositorySpy } = makeSut()
    findUserByIdRepositorySpy.user = null
    const user = await sut.findByToken('any-token')
    expect(user).toBeNull()
  })

  it('should return null if user role is different from param role', async () => {
    const { sut, findUserByIdRepositorySpy } = makeSut()
    findUserByIdRepositorySpy.user.role = 'different-role'
    const user = await sut.findByToken('any-token', 'any-role')
    expect(user).toBeNull()
  })

  it('should return user if user role is equal param role', async () => {
    const { sut, findUserByIdRepositorySpy } = makeSut()
    const user = await sut.findByToken('any-token', 'any-role')
    expect(user).toEqual(findUserByIdRepositorySpy.user)
  })

  it('should return user if no param role is provided', async () => {
    const { sut, findUserByIdRepositorySpy } = makeSut()
    const user = await sut.findByToken('any-token')
    expect(user).toEqual(findUserByIdRepositorySpy.user)
  })

  it('should throw if any dependency throws', async () => {
    const findUserByIdRepositorySpy = new FindUserByIdRepositorySpy()
    const decrypterSpy = new DecrypterSpy()
    const suts = [].concat(
      new DbFindUserByToken(
        { decrypt () { throw new Error() } },
        findUserByIdRepositorySpy
      ),
      new DbFindUserByToken(
        decrypterSpy,
        { findById () { throw new Error() } }
      )
    )
    for (const sut of suts) {
      const promise = sut.findByToken('any-token')
      await expect(promise).rejects.toThrow()
    }
  })
})
