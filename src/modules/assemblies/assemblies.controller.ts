import { Controller } from '@nestjs/common';
import { AssembliesService } from './assemblies.service';

@Controller('assemblies')
export class AssembliesController {
  constructor(private readonly assembliesService: AssembliesService) {}
}
