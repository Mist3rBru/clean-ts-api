import { app, env } from '@/main/config'
import { MongoHelper } from '@/infra/database/mongodb'
const port = env.APP_PORT

MongoHelper.connect()
  .then(() => console.log('MongoDb is connected'))
  .catch(() => console.error('MongoDb is not connected'))

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
