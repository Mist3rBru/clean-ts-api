import request from 'supertest'
import { app } from '@/main/config'

describe('Cors', () => {
  it('Should enable CORS', async () => {
    app.get('/test/cors', (req, res) => {
      res.send('')
    })
    const res = await request(app).get('/test/cors')
    expect(res.headers['access-control-allow-origin']).toBe('*')
    expect(res.headers['access-control-allow-methods']).toBe('*')
    expect(res.headers['access-control-allow-headers']).toBe('*')
  })

  it('Should disable x-powered-by header', async () => {
    app.get('/test/x_powered_by', (req, res) => {
      res.send('')
    })

    const res = await request(app).get('/test/x_powered_by')
    expect(res.headers['x-powered-by']).toBeUndefined()
  })
})
