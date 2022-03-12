import request from 'supertest'
import { app } from '@/main/config'

describe('Middlewares', () => {
  it('Should disable x-powered-by header', async () => {
    app.get('/test/x_powered_by', (req, res) => {
      res.send('')
    })

    const res = await request(app).get('/test/x_powered_by')
    expect(res.headers['x-powered-by']).toBeUndefined()
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

  it('Should enable CORS', async () => {
    app.get('/test/cors', (req, res) => {
      res.send('')
    })

    const res = await request(app).get('/test/cors')
    expect(res.headers['access-control-allow-origin']).toBe('*')
    expect(res.headers['access-control-allow-methods']).toBe('*')
    expect(res.headers['access-control-allow-headers']).toBe('*')
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
