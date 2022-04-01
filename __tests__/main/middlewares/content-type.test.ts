import request from 'supertest'
import { setupApp } from '@/main/config'
import { Express } from 'express'
let app: Express

describe('Content-Type', () => {
  beforeAll(async () => {
    app = await setupApp()
  })

  it('Should return json content-type as default', async () => {
    app.get('/test/json', (req, res) => {
      res.send('')
    })

    await request(app)
      .get('/test/json')
      .expect('content-type', /json/)
  })

  it('Should return xml content-type if forced', async () => {
    app.get('/test/xml', (req, res) => {
      res.type('xml')
      res.send('')
    })

    await request(app)
      .get('/test/xml')
      .expect('content-type', /xml/)
  })
})
