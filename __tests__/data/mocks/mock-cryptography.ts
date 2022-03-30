import { Decrypter, Encrypter, HashComparator, HashGenerator } from '@/data/protocols'
import faker from '@faker-js/faker'

export class HashGeneratorSpy implements HashGenerator {
  data: string
  hash = faker.datatype.uuid()
  async generate (data: string): Promise<string> {
    this.data = data
    return this.hash
  }
}

export class HashComparatorSpy implements HashComparator {
  data: string
  hash: string
  isValid = true
  async compare (data: string, hash: string): Promise<boolean> {
    this.data = data
    this.hash = hash
    return this.isValid
  }
}

export class EncrypterSpy implements Encrypter {
  data: string
  token = faker.datatype.uuid()
  async encrypt (data: string): Promise<string> {
    this.data = data
    return this.token
  }
}

export class DecrypterSpy implements Decrypter {
  data: string
  payload = faker.datatype.uuid()
  async decrypt (data: string): Promise<string> {
    this.data = data
    return this.payload
  }
}
