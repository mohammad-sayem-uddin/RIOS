/**
 * OpenAPI 3.0 Document Generator.
 *
 * Programmatically constructs OpenAPI documentation for all RIOS HTTP endpoints.
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
    schemas: Record<string, unknown>;
  };
}

export class SwaggerGenerator {
  public static generateSpec(): OpenApiSpec {
    return {
      openapi: '3.0.3',
      info: {
        title: 'Research Identity Operating System (RIOS) API',
        version: '1.0.0',
        description:
          'Enterprise REST API for Research Identity management, DDD aggregates, and CQRS operations.',
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
        '/api/v1/research-identities': {
          post: {
            summary: 'Establish a new Research Identity',
            tags: ['Research Identity'],
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
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            responses: {
              '200': { description: 'Research Identity details' },
              '404': { description: 'Not found' },
            },
          },
        },
        '/api/v1/research-identities/{id}/vision': {
          put: {
            summary: 'Refine Research Vision',
            tags: ['Research Identity'],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/UpdateResearchVisionRequest' },
                },
              },
            },
            responses: { '200': { description: 'Vision updated' } },
          },
        },
      },
      components: {
        schemas: {
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
          UpdateResearchVisionRequest: {
            type: 'object',
            required: ['visionStatement', 'timeHorizon'],
            properties: {
              visionStatement: { type: 'string' },
              timeHorizon: { type: 'string' },
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
