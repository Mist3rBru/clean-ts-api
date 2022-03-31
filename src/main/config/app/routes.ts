import { Express, Router } from 'express'
import { readdirSync } from 'fs'
import { resolve } from 'path'

export default (app: Express, router: Router): void => {
  app.use('/api', router)
  readdirSync(resolve(__dirname, '../../routes')).map(async file => {
    (await import(`../../routes/${file}`)).default(router)
  })
}
