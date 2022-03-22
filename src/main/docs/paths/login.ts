export const loginPath = {
  post: {
    tags: ['Authentication'],
    summary: 'route to authenticate user',
    description: 'this route can be used by any user',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/loginParams'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/user'
            }
          }
        }
      },
      400: {
        $ref: '#/components/badRequest'
      },
      401: {
        $ref: '#/components/unauthorizedError'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}
