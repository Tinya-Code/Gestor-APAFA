import { Module } from '@nestjs/common';
import { AssembliesService } from './assemblies.service';
import { AssembliesController } from './assemblies.controller';
import { AsambleaExisteRd } from './rule/asamblea-existe.rd/asamblea-existe.rd';
import { DetalleExisteRd } from './rule/detalle-existe.rd/detalle-existe.rd';
import { RuleDomain } from './repository/rule/rule-RuleDomain';
import { ListarAsambleaRepository } from './repository/listar-asamblea.repository/listar-asamblea.repository';

@Module({
  controllers: [AssembliesController],
  providers: [
    AssembliesService,
    AsambleaExisteRd,
    DetalleExisteRd,
    RuleDomain,
    ListarAsambleaRepository,
  ],
})
export class AssembliesModule {}
