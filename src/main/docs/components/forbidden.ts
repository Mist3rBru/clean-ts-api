export const forbiddenComponent = {
  description: 'Forbidden Action',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
