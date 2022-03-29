import { Decrypter, Encrypter, HashComparator, HashGenerator } from '@/data/protocols'
import faker from '@faker-js/faker'

export class HashGeneratorSpy implements HashGenerator {
  value: string
  hashedValue = faker.datatype.uuid()
  async generate (value: string): Promise<string> {
    this.value = value
    return this.hashedValue
  }
}

export class HashComparatorSpy implements HashComparator {
  value: string
  hash: string
  isValid = true
  async compare (value: string, hash: string): Promise<boolean> {
    this.value = value
    this.hash = hash
    return this.isValid
  }
}

export class EncrypterSpy implements Encrypter {
  value: string
  token = faker.datatype.uuid()
  async encrypt (value: string): Promise<string> {
    this.value = value
    return this.token
  }
}

export class DecrypterSpy implements Decrypter {
  token: string
  payload = faker.datatype.uuid()
  async decrypt (token: string): Promise<string> {
    this.token = token
    return this.payload
  }
}
