export const surveyPath = {
  get: {
    security: [{
      apiKeyAuth: []
    }],
    tags: ['Survey'],
    summary: 'route to list surveys',
    description: 'this route can be used by any user',
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveys'
            }
          }
        }
      },
      204: {
        description: 'No Content'
      },
      403: {
        $ref: '#/components/forbidden'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  },
  post: {
    tags: ['Survey'],
    summary: 'route to create new survey',
    description: 'this route can be used only by admin users',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/surveyParams'
          }
        }
      }
    },
    responses: {
      204: {
        description: 'Success'
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
