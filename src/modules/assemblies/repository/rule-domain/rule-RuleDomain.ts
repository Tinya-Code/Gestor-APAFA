import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../../database/database.service';

@Injectable()
export class RuleDomain {
  constructor(private readonly db: DatabaseService) {}

  /*-------------- FUNCIONES DE VALIDACION /RD.asamblea-existe ---------------*/
  // existe asamblea
  async existeAsamblea(id: number): Promise<boolean> {
    const [rows] = await this.db.query(
      'SELECT id FROM asamblea WHERE id = ? AND deleted_at IS NULL',
      [id],
    );
    return rows.length > 0;
  }

  // existe asamblea en colegio
  async existeAsambleaEnColegio(
    id: number,
    colegioId: number,
  ): Promise<boolean> {
    const [rows] = await this.db.query(
      'SELECT id FROM asamblea WHERE id = ? AND colegio_id = ? AND deleted_at IS NULL',
      [id, colegioId],
    );
    return rows.length > 0;
  }

  /*---------- FUNCIONES DE VALIDACION /RD.detalle-asamblea-existe -------------*/
  // existe detalle asamblea
  async existeDetalleAsamblea(id: number): Promise<boolean> {
    const [rows] = await this.db.query(
      'SELECT id FROM detalle_asamblea WHERE id = ? AND deleted_at IS NULL',
      [id],
    );
    return rows.length > 0;
  }

  // existe detalle asamblea en asamblea
  async existeDetalleAsambleaEnAsamblea(
    id: number,
    asambleaId: number,
  ): Promise<boolean> {
    const [rows] = await this.db.query(
      'SELECT id FROM detalle_asamblea WHERE id = ? AND assembly_id = ? AND deleted_at IS NULL',
      [id, asambleaId],
    );
    return rows.length > 0;
  }
}
