// Archivo del controlador de autenticación
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service.js';

class LoginDto {
  @ApiProperty({ example: 'admin@ejemplo.com' })
  email: string;

  @ApiProperty({ example: '123456' })
  password: string;
}

class RegisterDto {
  @ApiProperty({ example: 'Ana' })
  name: string;

  @ApiProperty({ example: 'ana@ejemplo.com' })
  email: string;

  @ApiProperty({ example: '123456' })
  password: string;
}

// Define el controlador de autenticación, que maneja las rutas relacionadas con la autenticación
@ApiTags('auth')
@Controller('auth')
// Clase que maneja las solicitudes de autenticación, como login y obtención del perfil del usuario
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Inicia sesión con email y password' })
  @ApiResponse({ status: 201, description: 'Login exitoso' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registra un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body.name, body.email, body.password);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtiene el perfil del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil del usuario obtenido exitosamente' })
  @ApiResponse({ status: 401, description: 'Usuario no autenticado' })
  getProfile(@Req() req: any) {
    return req.user;
  }
}
