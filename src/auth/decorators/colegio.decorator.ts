import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ColegioId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.colegio_id;
  },
);
