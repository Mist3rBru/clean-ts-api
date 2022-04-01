import request from 'supertest'
import { setupApp } from '@/main/config'
import { Express } from 'express'
let app: Express

describe('Json-Parser', () => {
  beforeAll(async () => {
    app = await setupApp()
  })

  it('Should parse body as JSON', async () => {
    app.post('/test/json_parser', (req, res) => {
      res.send(req.body)
    })

    const body = { test: 'json' }
    await request(app)
      .post('/test/json_parser')
      .send(body)
      .expect(body)
  })
})
