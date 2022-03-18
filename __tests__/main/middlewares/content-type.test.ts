import request from 'supertest'
import { app } from '@/main/config'

describe('Content-Type', () => {
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
