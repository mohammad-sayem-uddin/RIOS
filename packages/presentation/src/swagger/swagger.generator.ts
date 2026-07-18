/**
 * OpenAPI 3.0 Document Generator.
 *
 * Programmatically constructs OpenAPI documentation for all RIOS HTTP endpoints.
 * Architecture Reference: Volume I – Identity / Chapter 7 §87, Chapter 10 §145
 */

export interface OpenApiSpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description: string;
  };
  paths: Record<string, unknown>;
  components: {
    securitySchemes?: Record<string, unknown>;
    schemas: Record<string, unknown>;
  };
  security?: Array<Record<string, string[]>>;
}

export class SwaggerGenerator {
  public static generateSpec(): OpenApiSpec {
    return {
      openapi: '3.0.3',
      info: {
        title: 'Research Identity Operating System (RIOS) API',
        version: '1.0.0',
        description:
          'Enterprise REST API for Research Identity management, Identity & Access Management (IAM), DDD aggregates, and CQRS operations.',
      },
      paths: {
        '/health': {
          get: {
            summary: 'System health check',
            tags: ['Health'],
            responses: {
              '200': { description: 'System healthy' },
              '503': { description: 'System unhealthy' },
            },
          },
        },
        '/health/live': {
          get: {
            summary: 'Liveness check',
            tags: ['Health'],
            responses: { '200': { description: 'Service live' } },
          },
        },
        '/health/ready': {
          get: {
            summary: 'Readiness check',
            tags: ['Health'],
            responses: {
              '200': { description: 'Service ready' },
              '503': { description: 'Service not ready' },
            },
          },
        },
        '/api/v1/auth/login': {
          post: {
            summary: 'Authenticate user and issue tokens',
            tags: ['Authentication'],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/LoginRequest' },
                },
              },
            },
            responses: {
              '200': { description: 'Authentication successful' },
              '401': { description: 'Invalid credentials' },
            },
          },
        },
        '/api/v1/auth/refresh': {
          post: {
            summary: 'Rotate refresh token and issue new access token',
            tags: ['Authentication'],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/RefreshTokenRequest' },
                },
              },
            },
            responses: {
              '200': { description: 'Tokens refreshed' },
              '401': { description: 'Invalid refresh token' },
            },
          },
        },
        '/api/v1/auth/logout': {
          post: {
            summary: 'Revoke active authentication session',
            tags: ['Authentication'],
            security: [{ bearerAuth: [] }],
            responses: {
              '200': { description: 'Logout successful' },
              '401': { description: 'Unauthorized' },
            },
          },
        },
        '/api/v1/auth/me': {
          get: {
            summary: 'Retrieve current authenticated user context',
            tags: ['Authentication'],
            security: [{ bearerAuth: [] }],
            responses: {
              '200': { description: 'Current user details' },
              '401': { description: 'Unauthorized' },
            },
          },
        },
        '/api/v1/research-identities': {
          post: {
            summary: 'Establish a new Research Identity',
            tags: ['Research Identity'],
            security: [{ bearerAuth: [] }],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/CreateResearchIdentityRequest' },
                },
              },
            },
            responses: {
              '201': { description: 'Research Identity established successfully' },
              '400': { description: 'Validation error' },
            },
          },
          get: {
            summary: 'Find Research Identities by filters',
            tags: ['Research Identity'],
            security: [{ bearerAuth: [] }],
            parameters: [
              { name: 'stage', in: 'query', schema: { type: 'string' } },
              { name: 'focus', in: 'query', schema: { type: 'string' } },
              { name: 'limit', in: 'query', schema: { type: 'integer' } },
              { name: 'offset', in: 'query', schema: { type: 'integer' } },
            ],
            responses: { '200': { description: 'Matching Research Identities' } },
          },
        },
        '/api/v1/research-identities/search': {
          get: {
            summary: 'Search Research Identities by text',
            tags: ['Research Identity'],
            security: [{ bearerAuth: [] }],
            parameters: [
              { name: 'q', in: 'query', required: true, schema: { type: 'string' } },
              { name: 'limit', in: 'query', schema: { type: 'integer' } },
            ],
            responses: { '200': { description: 'Search results' } },
          },
        },
        '/api/v1/research-identities/{id}': {
          get: {
            summary: 'Get Research Identity by ID',
            tags: ['Research Identity'],
            security: [{ bearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            responses: {
              '200': { description: 'Research Identity details' },
              '404': { description: 'Not found' },
            },
          },
        },
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Provide JWT Access Token in standard Bearer format',
          },
        },
        schemas: {
          LoginRequest: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
              email: { type: 'string', format: 'email' },
              password: { type: 'string' },
            },
          },
          RefreshTokenRequest: {
            type: 'object',
            required: ['refreshToken'],
            properties: {
              refreshToken: { type: 'string' },
            },
          },
          CreateResearchIdentityRequest: {
            type: 'object',
            required: ['primaryFocus', 'stage', 'visionStatement', 'timeHorizon'],
            properties: {
              primaryFocus: { type: 'string' },
              stage: { type: 'string' },
              visionStatement: { type: 'string' },
              timeHorizon: { type: 'string' },
              targetAudience: { type: 'array', items: { type: 'string' } },
              coreThemes: { type: 'array', items: { type: 'string' } },
            },
          },
        },
      },
    };
  }

  public static generateHtml(spec: OpenApiSpec): string {
    const jsonSpec = JSON.stringify(spec);
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>RIOS API Documentation</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    window.onload = function() {
      window.ui = SwaggerUIBundle({
        spec: ${jsonSpec},
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.SwaggerUIStandalonePreset
        ],
      });
    };
  </script>
</body>
</html>`;
  }
}
