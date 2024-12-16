import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/config.js';
import { specs } from './config/swagger.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import tronRoutes from './modules/tron/tron.routes.js';

import { corsOptions } from './config/cors.js';

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api/tron', tronRoutes);
app.use(errorMiddleware);

app.listen(config.port, () => {
  console.log(`Server is running at ${config.baseUrl}`);
  console.log(`Swagger documentation available at ${config.baseUrl}/api-docs`);
});

export default app; 