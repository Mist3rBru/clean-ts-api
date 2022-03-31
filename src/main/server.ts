import 'module-alias/register'
import { setupApp, env } from '@/main/config'
import { MongoHelper } from '@/infra/database/mongodb'
const port = env.APP_PORT

MongoHelper.connect(env.MONGO_URL)
  .then(async () => {
    console.log('MongoDB is connected')
    const app = await setupApp()
    app.listen(port, () =>
      console.log(`Server is running on http://localhost:${port}`)
    )
  })
  .catch((error) => console.error('Server', error))
