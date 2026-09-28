import { Module } from '@nestjs/common';
import { AssembliesService } from './assemblies.service';
import { AssembliesController } from './assemblies.controller';
import { AsambleaRepository } from './repository/asamblea.repository/asamblea.repository';
import { DetalleRepository } from './repository/detalle.repository/detalle.repository';
import { AsambleaExisteRd } from './rule-domain/asamblea-existe.rd/asamblea-existe.rd';
import { DetalleExisteRd } from './rule-domain/detalle-existe.rd/detalle-existe.rd';
import { RuleDomain } from './repository/rule-domain/rule-RuleDomain';

@Module({
  controllers: [AssembliesController],
  providers: [
    AssembliesService,
    AsambleaRepository,
    DetalleRepository,
    AsambleaExisteRd,
    DetalleExisteRd,
    RuleDomain,
  ],
})
export class AssembliesModule {}
