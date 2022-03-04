export class Signup {
  async handle (httpRequest: any): Promise<any> {
    return {
      statusCode: 400,
      body: {
        error: 'Missing param: name'
      }
    }
  }
}
