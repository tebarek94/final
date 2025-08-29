import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
// import swaggerJsdoc from 'swagger-jsdoc';
// import swaggerUi from 'express-swagger-ui';
import dotenv from 'dotenv';

import routes from './routes';
import { testConnection } from './config/database';
import { errorHandler, notFound } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// CORS middleware
app.use(cors());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api', routes);

// Remove Swagger temporarily to fix the error:
// const swaggerOptions = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'NutriPlan Pro API',
//       version: '1.0.0',
//       description: 'AI-Powered Personalized Meal Planning Platform API'
//     },
//     servers: [
//       {
//         url: `http://localhost:${PORT}/api`,
//         description: 'Development server'
//       }
//     ]
//   },
//   apis: ['./src/routes/*.ts']
// };

// const specs = swaggerJsdoc(swaggerOptions);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await testConnection();
    
    app.listen(PORT, () => {
      console.log('🚀 NutriPlan Pro server running on port', PORT);
      console.log(' Health Check:', `http://localhost:${PORT}/health`);
      console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
