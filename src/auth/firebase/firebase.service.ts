import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { getFirebaseAuth } from '../../config/firebase.config';

export interface FirebaseTokenPayload {
  uid: string;
  email: string;
  name: string;
}

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);

  async verifyToken(idToken: string): Promise<FirebaseTokenPayload> {
    try {
      const auth = getFirebaseAuth();
      const decodedToken = await auth.verifyIdToken(idToken);
      return {
        uid: decodedToken.uid,
        email: decodedToken.email ?? '',
        name: decodedToken.name ?? decodedToken.email ?? '',
      };
    } catch (_error) {
      this.logger.warn('Firebase token verification failed');
      throw new UnauthorizedException('Token de Firebase inválido o expirado');
    }
  }
}
