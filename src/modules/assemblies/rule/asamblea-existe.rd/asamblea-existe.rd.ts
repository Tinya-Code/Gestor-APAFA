import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { RuleDomain } from '../../repository/rule/rule-RuleDomain';

@Injectable()
export class AsambleaExisteRd {
  private readonly logger = new Logger(AsambleaExisteRd.name);

  constructor(private readonly ruleDomain: RuleDomain) {}

  /*
   * Verifica que la asamblea exista y pertenezca al colegio
   * No retorna nada, solo lanza excepciones
   * Rompe el flujo de ejecución si la asamblea no existe o no pertenece al colegio
   */
  async asambleaExiste(id: number, colegioId: number): Promise<void> {
    const asamblea = await this.ruleDomain.existeAsamblea(id);
    if (!asamblea) {
      this.logger.warn(`Asamblea ${id} no existe`);
      throw new NotFoundException('Asamblea no encontrada');
    }

    const asambleaEnColegio = await this.ruleDomain.existeAsambleaEnColegio(
      id,
      colegioId,
    );
    if (!asambleaEnColegio) {
      this.logger.warn(
        `Intento de acceso a asamblea ${id} desde colegio ${colegioId} (no pertenece)`,
      );
      throw new ForbiddenException('Asamblea no pertenece a este colegio');
    }
  }
}
