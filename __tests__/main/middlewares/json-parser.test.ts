import request from 'supertest'
import { app } from '@/main/config'

describe('Json-Parser', () => {
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
