/* Define el módulo de autenticación, que incluye el controlador 
y servicio de autenticación, así como la estrategia JWT para proteger las rutas */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { createClient } from '@supabase/supabase-js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtStrategy } from './jwt.strategy.js';

const supabaseClientProvider = {
  provide: 'SUPABASE_CLIENT',
  useFactory: () =>
    createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '',
    ),
};

/* Modulo de autenticación que configura Passport y JWT, 
y proporciona el controlador y servicio de autenticación*/
@Module({
// Importa los módulos necesarios para la autenticación, incluyendo Passport y JWT
  imports: [
    PassportModule,
// Configura el módulo JWT con un secreto y opciones de expiración para los tokens
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'mi-secreto-super-seguro',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  // Define el controlador y servicio de autenticación, 
  // así como la estrategia JWT para proteger las rutas
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, supabaseClientProvider],
  exports: [AuthService],
})
export class AuthModule {}
