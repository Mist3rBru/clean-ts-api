export namespace Authentication {
  export type Params = {
    email: string
    password: string
  }

  export type Result = {
    accessToken: string
    userName: string
  }
}

export interface Authentication {
  auth(data: Authentication.Params): Promise<Authentication.Result>
}
