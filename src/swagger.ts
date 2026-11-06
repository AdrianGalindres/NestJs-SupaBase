/* Este archivo contiene la configuración de Swagger para la API */

import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/* Configuración de Swagger */
export function setupSwagger(app: INestApplication) { // app: INestApplication es la instancia de la aplicación NestJS
  const config = new DocumentBuilder()
    .setTitle('Mi WapChat API en NestJS')
    .setDescription('Documentación oficial del backend')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'JWT-auth',
    )
    .build(); // Construye la configuración de Swagger

  // Crea el documento de Swagger a partir de la configuración y la instancia de la aplicación
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
}
