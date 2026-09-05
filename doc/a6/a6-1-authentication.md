# A6 M1 — Autenticación y Roles

## Login

**#1 — POST /auth/login** — Iniciar sesión — Retorna: Token + Usuario

```
login {
  RD.loginCredenciales();    // email y password no están vacíos, formato email válido
  autenticarFirebase();      // llama a Firebase Auth REST API con email y password
  buscarOCrearUsuario();     // busca usuario por firebase_uid, si no existe lo crea
  generarJwt();              // crea JWT con payload: sub, role, email, expira 24h
  retornarToken();           // retorna access_token, token_type, expires_in y datos del usuario
}
```

**#2 — POST /auth/logout** — Cerrar sesión — Retorna: Mensaje

```
logout {
  extraerToken();            // valida formato "Bearer <token>", extrae el JWT
  revocarToken();            // agrega token a blacklist en Redis/BD con TTL = tiempo restante
  retornarMensaje();         // retorna "Sesión cerrada exitosamente"
}
```

**#3 — GET /auth/me** — Obtener perfil del usuario — Retorna: Datos

```
obtenerPerfil {
  validarToken();            // verifica firma, expiración y blacklist
  decodificarPayload();      // extrae sub, role, email del JWT
  buscarUsuario();           // consulta usuario en BD con parent_id o board_member_id según rol
  retornarDatos();           // retorna id, email, name, surname, dni, phone, role, parent_id, board_member_id
}
```

**#4 — GET /roles** — Listar roles — Retorna: Datos

```
listarRoles {
  RD.adminOnly();            // solo administradores (N1) pueden listar roles
  consultarRoles();          // SELECT * FROM roles ORDER BY id
  retornarDatos();           // retorna [{ id, name, description }]
}
```

**#5 — PUT /roles/:id** — Asignar/editar rol — Retorna: Datos

```
editarRol {
  RD.adminOnly();            // solo administradores (N1) pueden asignar roles
  RD.rolValido();            // el rol debe ser: admin, president, vice_president, treasurer, secretary, parent
  RD.usuarioExiste();        // el usuario destino debe existir
  actualizarRol();           // UPDATE users SET role = ?, updated_at = NOW() WHERE id = ?
  registrarAuditoria();      // registra quién hizo el cambio, cuándo y de qué a qué
  retornarDatos();           // retorna { id, user_id, role, updated_at }
}
```
