export const serverErrorComponent = {
  description: 'Intern Error',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
