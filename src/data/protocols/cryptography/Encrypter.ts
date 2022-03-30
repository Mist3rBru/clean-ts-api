export interface Encrypter {
  encrypt (data: string): Promise<string>
}

export interface Decrypter {
  decrypt (token: string): Promise<any>
}
