import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseClient } from '@supabase/supabase-js';

type SupabaseUser = {
  id: string;
  email?: string | null;
  user_metadata?: {
    name?: string;
    [key: string]: unknown;
  };
};

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
  ) {}

  private normalizeUser(user: SupabaseUser | null) {
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email ?? '',
      name: user.user_metadata?.name ?? user.email?.split('@')[0] ?? 'Usuario',
    };
  }

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new BadRequestException('Email y password son requeridos');
    }

    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      throw new UnauthorizedException(error?.message ?? 'Credenciales inválidas');
    }

    const user = this.normalizeUser(data.user as SupabaseUser);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: user.id, email: user.email, name: user.name };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user,
    };
  }

  async register(name: string, email: string, password: string) {
    if (!name?.trim()) {
      throw new BadRequestException('El nombre es requerido');
    }

    if (!email?.trim()) {
      throw new BadRequestException('El email es requerido');
    }

    if (!password || password.length < 6) {
      throw new BadRequestException('La contraseña debe tener al menos 6 caracteres');
    }

    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name.trim(),
        },
      },
    });

    if (error || !data.user) {
      throw new BadRequestException(error?.message ?? 'No se pudo crear el usuario');
    }

    if (!data.session) {
      throw new BadRequestException(
        'La cuenta se creó correctamente, pero debes confirmar tu correo antes de iniciar sesión.',
      );
    }

    const user = this.normalizeUser(data.user as SupabaseUser);

    if (!user) {
      throw new BadRequestException('No se pudo crear el usuario');
    }

    const payload = { sub: user.id, email: user.email, name: user.name };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user,
    };
  }

  async validateUser(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return null;
    }

    return this.normalizeUser(data.user as SupabaseUser);
  }
}
