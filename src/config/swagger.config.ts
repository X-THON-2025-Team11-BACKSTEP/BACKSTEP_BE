import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NodeBE API Documentation',
      version: '1.0.0',
      description: 'Node.js Backend API Documentation with Swagger',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local Development Server',
      },
      {
        url: 'https://ccscaps.com',
        description: 'Production Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            user_id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'John Doe' },
            nickname: { type: 'string', example: 'johndoe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            money: { type: 'integer', example: 1000 },
            google_id: { type: 'string', nullable: true },
            profile_image: { type: 'string', nullable: true, example: 'https://example.com/image.jpg' },
            bio: { type: 'string', nullable: true, example: 'Hello, I am John.' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        Project: {
          type: 'object',
          properties: {
            project_id: { type: 'integer', example: 101 },
            user_id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Awesome Project' },
            period: { type: 'string', example: '2023-01 ~ 2023-06' },
            personnel: { type: 'integer', example: 4 },
            intent: { type: 'string', example: 'Project Intent' },
            my_role: { type: 'string', example: 'Backend Developer' },
            growth_point: { type: 'string', example: 'Learned Node.js' },
            sale_status: { type: 'string', enum: ['NOTSALE', 'FREE', 'ONSALE'], example: 'ONSALE' },
            is_free: { type: 'string', enum: ['true', 'false'], example: 'false' },
            price: { type: 'integer', example: 5000 },
            result_url: { type: 'string', nullable: true, example: 'https://github.com/project' },
            image: { type: 'string', nullable: true, example: 'https://s3.bucket/project.jpg' },
            helpful_count: { type: 'integer', example: 15 },
            failure_category: { type: 'array', items: { type: 'string' }, example: ['Planning', 'Execution'] },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            code: { type: 'integer', example: 200 },
            message: { type: 'string', example: 'Success' },
            data: { type: 'object' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            code: { type: 'integer', example: 400 },
            message: { type: 'string', example: 'Error message' },
            data: { type: 'object', example: {} },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/**/*.routes.ts', './src/**/dto/*.ts'], // 라우트 및 DTO 파일 경로
};

export const swaggerSpec = swaggerJsdoc(options);

