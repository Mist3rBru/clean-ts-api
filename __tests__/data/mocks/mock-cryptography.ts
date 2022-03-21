import { Decrypter, Encrypter, HashComparator, HashGenerator } from '@/data/protocols'

export const mockHashGenerator = (): HashGenerator => {
  class HashGeneratorSpy implements HashGenerator {
    async generate (value: string): Promise<string> {
      return 'hashed-password'
    }
  }
  return new HashGeneratorSpy()
}

export const mockHashComparator = (): HashComparator => {
  class HashComparatorSpy implements HashComparator {
    async compare (value: string, hash: string): Promise<boolean> {
      return true
    }
  }
  return new HashComparatorSpy()
}

export const mockEncrypter = (): Encrypter => {
  class EncrypterSpy implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return 'any-token'
    }
  }
  return new EncrypterSpy()
}

export const mockDecrypter = (): Decrypter => {
  class DecrypterSpy implements Decrypter {
    async decrypt (token: string): Promise<string> {
      return 'any-id'
    }
  }
  return new DecrypterSpy()
}
