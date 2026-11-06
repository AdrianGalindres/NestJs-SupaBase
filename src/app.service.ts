// Archivo de servicio principal de la aplicación 
import { Injectable } from '@nestjs/common';

// Servicio que proporciona funcionalidades generales de la aplicación
@Injectable()
export class AppService {
  getHello(): string {
    return 'CORREO AUTENTICADO CORRECTAMENTE!';
  }
}
