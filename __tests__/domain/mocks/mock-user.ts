import { UserModel } from '@/domain/models'
import { AddUserParams } from '@/domain/usecases'

export const mockUserModel = (role: string = null): UserModel => ({
  id: 'any-id',
  name: 'any-name',
  email: 'any-email',
  password: 'hashed-password',
  role: role
})

export const mockAddUserParams = (role: string = null): AddUserParams => ({
  name: 'any-name',
  email: 'any-email',
  password: 'any-password',
  role: role
})
