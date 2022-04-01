import request from 'supertest'
import { noCache } from '@/main/middlewares'
import { setupApp } from '@/main/config'
import { Express } from 'express'
let app: Express

describe('No-Cache', () => {
  beforeAll(async () => {
    app = await setupApp()
  })

  it('should disable cache', async () => {
    app.get('/test/cache', noCache, (req, res) => {
      res.send()
    })
    await request(app)
      .get('/test/cache')
      .expect('cache-control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      .expect('pragma', 'no-cache')
      .expect('expires', '0')
      .expect('surrogate-control', 'no-store')
  })
})
