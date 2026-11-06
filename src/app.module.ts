// Archivo principal del módulo de la aplicación
import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';

/* Define el módulo principal de la aplicación, que importa el módulo 
de autenticación y proporciona el controlador y servicio principales */
@Module({
  imports: [AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
