export const IBcryptService = Symbol('IBcryptService')
export interface IBcryptService {
  hash(hashString: string): Promise<string>
  compare(password: string, hashPassword: string): Promise<boolean>
}
