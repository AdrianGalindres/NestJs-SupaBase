/* Archivo principal */
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { setupSwagger } from './swagger.js';

// Función principal para iniciar la aplicación NestJS
async function bootstrap() {
  // Crea una instancia de la aplicación NestJS a partir del módulo principal
  const app = await NestFactory.create(AppModule);

  setupSwagger(app); // Configura Swagger para la documentación de la API

  // Habilita CORS para permitir solicitudes desde diferentes orígenes
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
