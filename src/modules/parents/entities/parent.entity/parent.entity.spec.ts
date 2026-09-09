import type { ParentEntity } from './parent.entity';

describe('ParentEntity', () => {
  it('should have correct shape', () => {
    const parent: ParentEntity = {
      id: 1,
      colegio_id: 1,
      usuario_id: null,
      name: 'Juan',
      surname: 'Pérez',
      dni: '30123456',
      phone: '+5491155551234',
      email: 'juan.perez@email.com',
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    };

    expect(parent.id).toBeDefined();
    expect(parent.colegio_id).toBeDefined();
    expect(parent.name).toBeDefined();
    expect(parent.surname).toBeDefined();
    expect(parent.dni).toBeDefined();
  });
});
