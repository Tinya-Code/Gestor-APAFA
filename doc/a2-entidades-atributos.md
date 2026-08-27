# A2 - b - Entidades y atributos


## 👨‍👩‍👧 Padre

| Propiedad | Descripción                            |
| --------- | -------------------------------------- |
| id        | Identificador único del padre o madre. |
| nombre    | Nombre del padre o madre.              |
| apellido  | Apellido del padre o madre.            |
| dni       | Documento nacional de identidad.       |
| telefono  | Número de contacto telefónico.         |
| correo    | Correo electrónico registrado.         |

## 🎓 Estudiante

|Propiedad|Descripción|
|---|---|
|id|Identificador único del estudiante.|
|nombre|Nombre del estudiante.|
|apellido|Apellido del estudiante.|
|grado|Nivel escolar que cursa.|
|seccion|Grupo o sección asignada.|
|id_padre|Referencia al padre o madre responsable.|

## 🏛️ Directiva

|Propiedad|Descripción|
|---|---|
|id|Identificador único del miembro directivo.|
|id_padre|Padre o madre que ocupa el cargo.|
|rol|Cargo dentro de la directiva (administrador, tesorero, etc.).|
|fecha_inicio|Fecha en que inicia su gestión.|
|fecha_fin|Fecha en que termina su gestión.|

## 🗓️ Asamblea

|Propiedad|Descripción|
|---|---|
|id|Identificador único de la asamblea.|
|titulo|Tema o nombre de la reunión.|
|fecha|Día en que se realiza la asamblea.|
|descripcion|Detalle o resumen de los temas tratados.|

## 📋 Detalle de Asamblea

|Propiedad|Descripción|
|---|---|
|id|Identificador único del detalle.|
|id_asamblea|Referencia a la asamblea correspondiente.|
|descripcion|Nota o acuerdo registrado.|
|fecha_registro|Fecha en que se registró el detalle.|

## 🎉 Evento

|Propiedad|Descripción|
|---|---|
|id|Identificador único del evento.|
|id_asamblea|Relación con una asamblea (si aplica).|
|titulo|Nombre del evento.|
|fecha|Día en que se realiza.|
|descripcion|Breve explicación del evento.|
|genera_multa|Indica si el evento genera multa por inasistencia.|
|monto_multa|Valor de la multa (si aplica).|
|genera_asistencia|Indica si se registra asistencia.|
|genera_gasto|Indica si el evento implica gastos.|
|genera_aporte|Indica si se recaudan aportes.|
|monto_aporte|Valor del aporte (si aplica).|

## ✅ Asistencia

|Propiedad|Descripción|
|---|---|
|id|Identificador único del registro.|
|id_evento|Evento al que corresponde la asistencia.|
|id_padre|Padre o madre registrado.|
|asistio|Indica si asistió o no.|
|fecha_registro|Fecha en que se registró la asistencia.|

## 💸 Multa

|Propiedad|Descripción|
|---|---|
|id|Identificador único de la multa.|
|id_padre|Padre o madre sancionado.|
|id_evento|Evento que generó la multa.|
|monto|Valor de la multa.|
|pagado|Estado del pago (sí/no).|
|fecha_generada|Fecha en que se generó la multa.|
|fecha_pago|Fecha del pago (si se realizó).|

## 💰 Aporte

|Propiedad|Descripción|
|---|---|
|id|Identificador único del aporte.|
|id_padre|Padre o madre que realiza el aporte.|
|id_evento|Evento asociado (si aplica).|
|id_directiva|Directivo que registra el aporte.|
|monto|Valor del aporte.|
|fecha|Fecha del aporte.|
|descripcion|Motivo o detalle del aporte.|

## 🧾 Comprobante

|Propiedad|Descripción|
|---|---|
|id|Identificador único del comprobante.|
|id_directiva|Directivo responsable del registro.|
|numero_comprobante|Número del documento (factura o boleta).|
|tipo|Tipo de comprobante emitido.|
|fecha|Fecha de emisión.|
|descripcion|Detalle del gasto o compra.|

## 🧮 Item de Gasto

|Propiedad|Descripción|
|---|---|
|id|Identificador único del ítem.|
|id_comprobante|Comprobante al que pertenece.|
|descripcion|Detalle del gasto específico.|
|monto|Valor del ítem.|

## 🏗️ Gasto

|Propiedad|Descripción|
|---|---|
|id|Identificador único del gasto.|
|id_evento|Evento asociado (si aplica).|
|id_comprobante|Comprobante que respalda el gasto.|
|id_directiva|Directivo que autoriza o registra.|
|total|Monto total del gasto.|
|tipo|Categoría del gasto (mantenimiento, actividad, etc.).|
|fecha|Fecha del gasto.|
|descripcion|Detalle del gasto realizado.|

## 🔄 Movimiento

|Propiedad|Descripción|
|---|---|
|id|Identificador único del movimiento.|
|tipo|Tipo de movimiento (ingreso o egreso).|
|monto|Valor del movimiento.|
|fecha|Fecha del registro.|
|descripcion|Detalle del movimiento.|
|id_referencia|Identificador del registro relacionado.|
|tipo_referencia|Tipo de referencia (aporte, multa o gasto).|

## 📢 Aviso

|Propiedad|Descripción|
|---|---|
|id|Identificador único del aviso.|
|tipo|Tipo de aviso (evento o multa).|
|id_referencia|Registro al que hace referencia.|
|titulo|Título del aviso.|
|mensaje|Contenido o texto del aviso.|
|fecha|Fecha de publicación del aviso.|

---