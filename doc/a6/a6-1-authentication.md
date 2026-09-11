# A6 M1 — Autenticación y Roles (Multi-Tenant)

## Login

**#1 — POST /auth/login** — Iniciar sesión — Retorna: Token + Usuario + Colegio

**Flujo:** Frontend (Google Sign-In) → Firebase token → Backend verifica → JWT interno con colegio_id

```
login {
  RD.firebaseToken();                    // token viene en header Authorization: "Bearer <firebase-token>"
  verificarFirebase();                   // valida token contra Firebase Admin SDK, extrae email
  buscarUsuario();                       // SELECT * FROM usuario WHERE email = ? AND deleted_at IS NULL
  RD.usuarioNoExiste();                  // 401 NOT_FOUND — usuario no registrado
  buscarColegio();                       // SELECT * FROM usuario_colegio WHERE usuario_id = ? AND is_active = 1
  RD.noTieneColegio();                   // 403 NOT_AUTHORIZED — usuario no pertenece a ningún colegio
 RD.esSuperAdmin();                     // si is_super_admin = true → JWT con colegio_id = null
  generarJwt();                          // crea JWT con: sub (usuario.id), email, role, colegio_id, is_super_admin
  retornarToken();                       // retorna access_token, token_type, expires_in, user y colegio
}
```

**Nota:** El login es exclusivamente con token de Google Sign-In. No hay formulario de email/password.

**#2 — POST /auth/logout** — Cerrar sesión — Retorna: Mensaje

```
logout {
  retornarMensaje();         // retorna "Sesión cerrada exitosamente"
  // Frontend descarta el token, expira naturalmente después de 24h
}
```

**Nota:** No se usa blacklist. El token expira naturalmente. El frontend simplemente descarta el token.

**#3 — GET /auth/me** — Obtener perfil del usuario — Retorna: Datos + Colegio

```
obtenerPerfil {
  validarToken();            // verifica firma y expiración
  decodificarPayload();      // extrae sub, role, email, colegio_id, is_super_admin del JWT
  RD.esSuperAdmin();         // si is_super_admin → retorna perfil sin colegio
  buscarUsuarioColegio();    // SELECT * FROM usuario_colegio WHERE usuario_id = ? AND colegio_id = ?
  RD.noPerteneceAlColegio(); // 403 NOT_AUTHORIZED — usuario no pertenece a este colegio
  retornarDatos();           // retorna id, email, name, surname, role, colegio_id, colegio_name
}
```

**#4 — POST /auth/switch-colegio** — Cambiar de colegio (solo super_admin) — Retorna: Nuevo JWT

```
switchColegio {
  RD.soloSuperAdmin();               // solo N0 puede cambiar de colegio
  validarColegio();                   // SELECT * FROM colegio WHERE id = ? AND is_active = 1
  RD.colegioNoExiste();              // 404 NOT_FOUND — colegio no encontrado
  generarNuevoJwt();                  // crea JWT con el nuevo colegio_id
  retornarToken();                    // retorna nuevo access_token con el colegio seleccionado
}
```

---

## Gestión de Roles

**#5 — GET /roles** — Listar roles — Retorna: Datos

```
listarRoles {
  RD.esSuperAdmin();          // si es super_admin → lista TODOS los roles del sistema
  listarRolesColegio();       // si no es super_admin → lista roles disponibles EN ESE COLEGIO
  retornarRoles();            // retorna lista de roles
}
```

**#6 — PUT /roles/:id** — Asignar/editar rol — Retorna: Datos

```
asignarRol {
  RD.adminOrColegioAdmin();   // N0 o N1 pueden asignar roles
  validarUsuario();           // SELECT * FROM usuario WHERE id = ? AND deleted_at IS NULL
  RD.usuarioNoExiste();       // 404 NOT_FOUND — usuario no encontrado
  RD.esSuperAdmin();          // si es super_admin → puede asignar en cualquier colegio
  validarColegio();           // si no es super_admin → verificar que el colegio sea el del token
  RD.colegioNoCoincide();     // 403 FORBIDDEN — no puede asignar roles en otro colegio
  asignarRol();               // INSERT o UPDATE en usuario_colegio
  retornarRol();              // retorna el rol asignado
}
```

---

## Panel Super Admin

**#7 — GET /admin/colegios** — Listar todos los colegios — Retorna: Datos

```
listarColegios {
  RD.soloSuperAdmin();        // solo N0
  consultarColegios();        // SELECT * FROM colegio WHERE deleted_at IS NULL ORDER BY name
  retornarColegios();         // retorna lista de colegios
}
```

**#8 — POST /admin/colegios** — Crear colegio — Retorna: Datos

```
crearColegio {
  RD.soloSuperAdmin();        // solo N0
  validarDatos();             // nombre y slug son obligatorios, slug debe ser único
  RD.slugDuplicado();         // 409 CONFLICT — el slug ya existe
  insertarColegio();          // INSERT INTO colegio (name, slug, ...)
  retornarColegio();          // retorna el colegio creado
}
```

**#9 — GET /admin/usuarios** — Listar todos los usuarios — Retorna: Datos

```
listarUsuarios {
  RD.soloSuperAdmin();        // solo N0
  consultarUsuarios();        // SELECT * FROM usuario WHERE deleted_at IS NULL ORDER BY name
  retornarUsuarios();         // retorna lista de usuarios
}
```

**#10 — POST /admin/usuarios/:id/colegios** — Asignar usuario a colegio — Retorna: Datos

```
asignarAColegio {
  RD.soloSuperAdmin();        // solo N0
  validarUsuario();           // SELECT * FROM usuario WHERE id = ?
  RD.usuarioNoExiste();       // 404 NOT_FOUND
  validarColegio();           // SELECT * FROM colegio WHERE id = ? AND is_active = 1
  RD.colegioNoExiste();       // 404 NOT_FOUND
  validarRol();               // el role debe ser válido (presidente, vicepresidente, tesorero, secretario, vocal, padre)
  RD.rolInvalido();           // 400 BAD_REQUEST — rol no válido
  RD.yaPertenece();           // 409 CONFLICT — el usuario ya está en ese colegio
  insertarRelacion();         // INSERT INTO usuario_colegio (usuario_id, colegio_id, role)
  retornarRelacion();         // retorna la relación creada
}
```
