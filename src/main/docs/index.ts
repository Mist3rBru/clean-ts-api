import paths from './paths'
import schemas from './schemas'
import components from './components'

export default {
  openapi: '3.0.0',
  info: {
    title: 'CLEAN-TS-API',
    description: "Mangos's course API to make surveys between developers",
    version: '1.0.0'
  },
  servers: [{
    url: '/api',
    description: 'Main Server'
  }],
  paths,
  schemas,
  components
}
