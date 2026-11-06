// Este archivo contiene las pruebas unitarias para el servicio de autenticación (AuthService)

import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { vi } from 'vitest';
import { AuthService } from './auth.service.js';

// Describe el conjunto de pruebas para AuthService
describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    const mockSupabase = {
      auth: {
        signInWithPassword: vi.fn().mockImplementation(async ({ email, password }) => {
          if (email === 'admin@ejemplo.com' && password === '123456') {
            return {
              data: {
                user: {
                  id: '1',
                  email,
                  user_metadata: { name: 'Administrador' },
                },
              },
              error: null,
            };
          }

          return {
            data: { user: null },
            error: { message: 'Credenciales inválidas' },
          };
        }),
        signUp: vi.fn().mockImplementation(async ({ email, password, options }) => {
          if (!email || !password || password.length < 6) {
            return {
              data: { user: null },
              error: { message: 'La contraseña debe tener al menos 6 caracteres' },
            };
          }

          return {
            data: {
              user: {
                id: '2',
                email,
                user_metadata: { name: options?.data?.name ?? 'Nuevo usuario' },
              },
            },
            error: null,
          };
        }),
      },
    };

    service = new AuthService(
      new JwtService({
        secret: 'mi-secreto-super-seguro',
        signOptions: { expiresIn: '1h' },
      }),
      mockSupabase as any,
    );
  });

  it('debe devolver un token para un usuario válido', async () => {
    const result = await service.login('admin@ejemplo.com', '123456');

    expect(result.access_token).toBeDefined();
    expect(result.user.email).toBe('admin@ejemplo.com');
  });

  it('debe registrar un usuario nuevo', async () => {
    const result = await service.register('Ana', 'ana@ejemplo.com', '123456');

    expect(result.access_token).toBeDefined();
    expect(result.user.email).toBe('ana@ejemplo.com');
    expect(result.user.name).toBe('Ana');
  });

  it('debe fallar con credenciales inválidas', async () => {
    await expect(service.login('admin@ejemplo.com', 'wrong-pass')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('debe validar la contraseña mínima al registrar', async () => {
    await expect(service.register('Ana', 'ana@ejemplo.com', '123')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('debe requerir confirmación por correo si Supabase no devuelve sesión', async () => {
    (service as any).supabase.auth.signUp = vi.fn().mockResolvedValue({
      data: {
        user: {
          id: '3',
          email: 'pendiente@ejemplo.com',
          user_metadata: { name: 'Pendiente' },
        },
        session: null,
      },
      error: null,
    });

    await expect(
      service.register('Pendiente', 'pendiente@ejemplo.com', '123456'),
    ).rejects.toThrow(BadRequestException);
  });
});
