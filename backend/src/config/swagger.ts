import swaggerJsdoc from 'swagger-jsdoc'
import { config } from './config'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TRON Wallet API',
      version: '1.0.0',
      description: 'API for TRON wallet verification'
    },
    servers: [
      {
        url: config.baseUrl,
        description: `${config.env} server`
      }
    ]
  },
  apis: ['./src/modules/**/**.ts']
}

export const specs = swaggerJsdoc(options) 