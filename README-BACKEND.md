# Manual Técnico e Infraestructura del Backend: Sistema de Rendición de Cuentas

Este documento proporciona una guía exhaustiva y detallada sobre la arquitectura, lógica de negocios, flujos de datos, seguridad, persistencia y control de excepciones del backend del Sistema de Rendición de Cuentas.

---

## 1. Arquitectura del Sistema: Patrón de Capas Desacopladas

El backend está diseñado bajo una arquitectura de capas estructurada en el principio de **Responsabilidad Única (SRP)** de SOLID. Esto permite aislar el protocolo HTTP, las reglas de negocio y el acceso al motor de almacenamiento.

```text
                                  ┌──────────────────────────┐
                                  │       Petición HTTP      │
                                  └─────────────┬────────────┘
                                                │
                                                ▼
                                  ┌──────────────────────────┐
                                  │      Rutas (Express)     │
                                  └─────────────┬────────────┘
                                                │
                                                ▼
                                  ┌──────────────────────────┐
                                  │    Middlewares (JWT/Rol) │
                                  └─────────────┬────────────┘
                                                │
                                                ▼
                                  ┌──────────────────────────┐
                                  │   Capa de Controladores  │
                                  └─────────────┬────────────┘
                                                │
                                                ▼
                                  ┌──────────────────────────┐
                                  │     Capa de Modelos      │
                                  └─────────────┬────────────┘
                                                │
                                                ▼
                                  ┌──────────────────────────┐
                                  │   Pool de Datos (MySQL)  │
                                  └──────────────────────────┘
```

* **Capa de Rutas (`src/routes/`)**: Registra y expone los puntos de entrada (endpoints). Su único propósito es vincular verbos y rutas HTTP a sus middlewares e invocar la función controladora adecuada. No realiza cálculos ni interactúa con la base de datos.
* **Capa de Middlewares (`src/middlewares/`)**: Intercepta la petición para validar tokens, controlar las reglas de acceso por rol del usuario autenticado o aplicar políticas globales de seguridad.
* **Capa de Controladores (`src/controllers/`)**: Orquesta el flujo de ejecución. Extrae los parámetros de la solicitud (`req.params`, `req.query`, `req.body`), ejecuta validaciones a nivel de aplicación, delega el procesamiento o almacenamiento de datos a la capa de modelos y devuelve las respuestas HTTP formateadas con sus respectivos códigos de estado.
* **Capa de Modelos (`src/models/`)**: Abstracción SQL. Contiene funciones asíncronas parametrizadas que interactúan con el pool de conexiones de la base de datos. Está desacoplada del protocolo web; no tiene noción del objeto `req` o `res`.

---

## 2. Estructura de Directorios

La organización física de las carpetas en el proyecto sigue un patrón semántico estricto:

```text
Pasantias-Backend/
├── index.js                     # Punto de entrada y arranque del servidor Express
├── package.json                 # Declaración de dependencias y scripts NPM
├── .env                         # Variables de entorno críticas (excluido de git)
├── src/
│   ├── config.js                # Normalización y exportación de variables de entorno
│   ├── token.js                 # Helper con promesas para firmar tokens JWT
│   ├── controllers/             # Controladores que contienen la orquestación de la lógica
│   │   ├── accountantController.js
│   │   ├── authController.js
│   │   ├── authoritiesController.js
│   │   ├── beneficiaryController.js
│   │   ├── debitNoteController.js
│   │   ├── debitNoteDetailsController.js
│   │   ├── departureController.js
│   │   ├── orderController.js
│   │   ├── organizationController.js
│   │   ├── programsController.js
│   │   ├── renditionController.js
│   │   ├── reportsController.js
│   │   ├── stateController.js
│   │   └── usersController.js
│   ├── database/                # Inicialización de la base de datos y scripts DDL
│   │   ├── connection.database.js
│   │   └── db.sql               # Esquema de tablas y relaciones MySQL
│   ├── libs/                    # Módulos compartidos y librerías externas
│   │   ├── nodemailer.js        # Configuración para envío de correos de recuperación
│   │   └── numeroALetras.js     # Utilidad de formateo contable para reportes
│   ├── middlewares/             # Funciones intermediarias de Express
│   │   └── jwt.js               # Validación y autorización basada en JSON Web Tokens
│   ├── models/                  # Abstracción SQL directa (Mapeo a base de datos)
│   │   ├── accountantModel.js
│   │   ├── authoritiesModel.js
│   │   ├── beneficiaryModel.js
│   │   ├── debitNoteDetailsModel.js
│   │   ├── debitNoteModel.js
│   │   ├── departureModels.js
│   │   ├── orderModel.js
│   │   ├── organizationModel.js
│   │   ├── programsModel.js
│   │   ├── renditionModel.js
│   │   ├── reportsModel.js
│   │   ├── stateModel.js
│   │   └── userModel.js
│   └── routes/                  # Definición de las rutas del API REST
│       ├── accountantRouter.js
│       ├── authRouter.js
│       ├── authoritiesRouter.js
│       ├── beneficiaryRouter.js
│       ├── debitNoteDetailsRouter.js
│       ├── debitNoteRouter.js
│       ├── departureRouter.js
│       ├── orderRouter.js
│       ├── organizationRouter.js
│       ├── programsRoutes.js
│       ├── renditionRouter.js
│       ├── reportRouter.js
│       ├── stateRouter.js
│       └── userRoutes.js
```

---

## 3. Configuración del Archivo `.env` (Variables de Entorno)

El servidor requiere la definición de variables de entorno para inicializarse. El archivo `.env` debe ubicarse en la raíz del proyecto y configurarse con el siguiente formato:

```ini
# Configuración del Puerto del Servidor
PORT=8080

# Parámetros de Persistencia (MySQL)
DB_host=localhost
DB_user=root
DB_port=3306
DB_database=pasantias_rendiciones
DB_password=tu_contrasena_de_mysql

# Semilla de Firma para Seguridad JWT
PALABRASECRETA=tu_clave_secreta_altamente_compleja_para_firmar_tokens

# Entorno de ejecución
NODE_ENV=development
```

---

## 4. Gestión Exhaustiva de Autenticación y Flujo de Login

La seguridad del sistema está centralizada en el controlador [authController.js](file:///c:/Users/Mariana%20Morales/Desktop/9no%20Pasantias/Programacion/Pasantias-Backend/src/controllers/authController.js), el middleware [jwt.js](file:///c:/Users/Mariana%20Morales/Desktop/9no%20Pasantias/Programacion/Pasantias-Backend/src/middlewares/jwt.js) y el modelo [userModel.js](file:///c:/Users/Mariana%20Morales/Desktop/9no%20Pasantias/Programacion/Pasantias-Backend/src/models/userModel.js).

### Flujo Detallado de Inicio de Sesión (`login`)
Cuando el cliente realiza una petición `POST /api/auth/login` con el payload `{ ced_usu, cla_usu }`:

1. **Normalización e Ingesta**: El controlador extrae las variables del cuerpo de la petición. La cédula se limpia usando `String(ced_usu).trim()` para evitar problemas con espacios en blanco al consultar registros VARCHAR de base de datos.
2. **Consulta de Existencia**: Se invoca a `userModel.getUserModel({ ced_usu })`. El modelo ejecuta la siguiente consulta SQL:
   ```sql
   SELECT TRIM(u.ced_usu) as ced_usu, u.nom_usu, u.ema_usu, u.sta_usu, u.cla_usu, u.rol_usu, s.nom_sta, r.nom_rol as rol_nom
   FROM usu_ren u
   LEFT JOIN sta_ren s ON u.sta_usu = s.cod_sta
   LEFT JOIN rol_ren r ON u.rol_usu = r.cod_rol
   WHERE TRIM(u.ced_usu) = ?
   ```
   Si no se localiza ningún registro, se retorna un código `400 Bad Request` indicando *"Usuario no encontrado"*.
3. **Mecanismo Dual de Validación de Claves (Soporte Legacy)**:
   * **Caso Cifrado**: Se intenta validar la contraseña utilizando `bcrypt.compare(cla_usu, userFound.cla_usu)`.
   * **Caso Texto Plano (Migración)**: Si la comparación falla, el controlador comprueba si la contraseña proporcionada coincide exactamente con el string plano en base de datos (`cla_usu === userFound.cla_usu`). Si es correcta, el sistema autoriza el login y, para actualizar la seguridad, hashea la contraseña inmediatamente mediante un proceso asíncrono y ejecuta `userModel.updatePasswordModel(userFound.ced_usu, hashedPassword)` en segundo plano. Esto asegura que la base de datos se robustezca dinámicamente sin degradar la experiencia del usuario final.
4. **Verificación de Bloqueos**: Se analiza el nombre del estado del usuario recuperado (`userFound.nom_sta`). Si el valor corresponde a `'Suspendido'` o `'Inactivo'`, se bloquea el inicio de sesión respondiendo con un código `403 Forbidden` y el payload `{ message: "Usuario suspendido. Contacte al administrador.", suspended: true }`.
5. **Creación del Token**: El controlador delega en [token.js](file:///c:/Users/Mariana%20Morales/Desktop/9no%20Pasantias/Programacion/Pasantias-Backend/src/token.js) la creación de una firma digital. La función `createAccesToken` devuelve una promesa que envuelve `jwt.sign`:
   ```javascript
   export function createAccesToken(payload) {
       return new Promise((resolve, reject) => {
           jwt.sign(payload, process.env.PALABRASECRETA, { expiresIn: "1d" }, (err, token) => {
               if (err) return reject(err);
               resolve(token);
           });
       });
   }
   ```
   El payload inyecta `{ id: userFound.ced_usu, rol: userFound.rol_usu, nombre: userFound.nom_usu }`.
6. **Inyección de Cookie Segura**: El token resultante se inyecta en la cabecera HTTP a través de cookies con propiedades seguras:
   ```javascript
   res.cookie('token', token, {
       httpOnly: true, // Bloquea la lectura de la cookie desde scripts en el navegador (Mitiga XSS)
       secure: req.secure || req.headers['x-forwarded-proto'] === 'https', // Solo se transmite bajo HTTPS
       sameSite: req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'none' : 'lax', // Protege contra CSRF
   });
   ```

---

## 5. Lógica de Negocio y Estructura por Módulo

### A. Módulo de Usuarios
Este módulo controla los datos de identidad de los usuarios registrados y previene la inconsistencia relacional de la plataforma.
* **Inserción**: `createUser` hashea la contraseña recibida con un factor de coste (*rounds*) de 10 antes de persistir.
* **Bloqueo de Eliminación**: Un usuario activo no puede ser borrado físicamente para salvaguardar el historial contable de firmas. Al invocar `deleteUsers`, el controlador recupera al usuario y comprueba si `user.sta_usu === 1` o si su estado nominal es `'activo'`. Si es verdadero, el backend interrumpe la petición con una respuesta `400 Bad Request` y el mensaje *"No se puede eliminar un usuario en estado activo"*.

### B. Módulo de Rendición de Cuentas
Controla las carpetas de rendiciones contables correspondientes a Órdenes de Pago (OPG).
* **Manejo de Ciclo de Vida e Inmutabilidad**: Las rendiciones transitan por estados. La rendición marcada como `'Entregada'` se considera inmutable. Si el controlador [renditionController.js](file:///c:/Users/Mariana%20Morales/Desktop/9no%20Pasantias/Programacion/Pasantias-Backend/src/controllers/renditionController.js) en `updateRendition` detecta que el estado guardado es `'Entregada'` (`deliveredId`), restringe las modificaciones:
  * Solo si el usuario logueado es **Administrador** (Rol 1) y está moviendo el estado a `'Activo'` (reabriendo la rendición), se permite la edición.
  * Para cualquier otro rol, el servidor responde con `409 Conflict` e impide sobrescribir los valores.
* **Integridad de Borrado**: No se permite la eliminación de una rendición que contenga gastos cargados. `deleteRendition` ejecuta primero `renditionModel.renditionHasDebitNotes(cod_rnd)`. Si el conteo es superior a cero, devuelve `409 Conflict`, obligando al operador a eliminar primero las Notas de Débito asociadas.
* **Sincronización Automática de la OPG**: Al crear, actualizar o eliminar una rendición, el sistema ejecuta de fondo `orderModel.autoUpdateOpgStatus(opg_rnd)`, que recalcula e impacta el estado de la orden de pago a nivel físico en la base de datos de manera inmediata.

### C. Módulo de Notas de Débito (NDB)
Módulo encargado de registrar las erogaciones individuales imputadas a una rendición.
* **Control de Presupuesto**: Para evitar que las notas de débito superen el saldo de la OPG, se utiliza la función de validación `validateDebitNoteAmount`:
  1. Llama a `debitNoteModel.getDebitNoteBudgetModel(rnd_ndb, excludedCodNdb)` para calcular el saldo de la OPG restando las NDB registradas previamente y sumando los reintegros.
  2. Si el monto propuesto supera este saldo remanente (`remaining`), el backend responde con un error `400 Bad Request` indicando el saldo disponible real formateado a moneda de curso legal (`es-VE`).
* **Cálculo de Retenciones**: El monto neto de la nota de débito se autocalcula en el backend mediante la siguiente lógica:
  ```javascript
  if (Number(sub_ndb) > 0 && (Number(rtc_ndb) > 0 || Number(tbf_ndb) > 0 || Number(isl_ndb) > 0)) {
      mon_ndb = round2(Number(sub_ndb || 0) - Number(rtc_ndb || 0) - Number(tbf_ndb || 0) - Number(isl_ndb || 0));
  }
  ```
  Esto reduce posibles discrepancias matemáticas introducidas desde el frontend.
* **Bloqueo en Rendiciones Entregadas**: `createDebitNote`, `updateDebitNote` y `deleteDebitNote` verifican si la rendición padre ya fue entregada (`isDeliveredRendition`). Si es así, se rechaza la transacción con `409 Conflict`.

### D. Módulo de Reportes (Consolidación de Datos)
El archivo [reportsModel.js](file:///c:/Users/Mariana%20Morales/Desktop/9no%20Pasantias/Programacion/Pasantias-Backend/src/models/reportsModel.js) expone la lógica contable del sistema a través de consultas agregadas eficientes:
* **`getReportHeaderModel`**: Obtiene el encabezado de un reporte realizando cruzamientos (`INNER JOIN`) entre `rnd_ren` (rendición), `opg_ren` (orden de pago), `ctd_ren` (cuentadante) y `par_ren` (partida) en una sola transacción asíncrona optimizada, entregando campos de contacto, dirección física y montos globales.
* **`getOPGRenditionsProgressModel`**: Ejecuta consultas complejas con agrupaciones (`GROUP BY`) para retornar el progreso acumulado neto de ejecución:
  ```sql
  SELECT r.cod_rnd, r.num_rnd, COALESCE(r.rnt_rnd, 0) AS reintegro,
         COALESCE(SUM(CASE WHEN (SELECT COALESCE(SUM(mon_drn), 0) FROM drn_ren WHERE cab_drn = n.cod_ndb) >= n.mon_ndb THEN n.mon_ndb ELSE 0 END), 0) AS monto_rendido
  FROM rnd_ren r
  LEFT JOIN ndb_ren n ON r.cod_rnd = n.rnd_ndb
  WHERE r.opg_rnd = ?
  GROUP BY r.cod_rnd, r.num_rnd, r.rnt_rnd
  ORDER BY CAST(r.num_rnd AS UNSIGNED) ASC
  ```
  La lógica de negocio posterior calcula el porcentaje acumulativo respecto a la OPG y el saldo sobrante neto, retornando un arreglo formateado con precisión de dos decimales (`toFixed(2)`).

---

## 6. Validaciones Específicas por Módulo

Para asegurar la consistencia del sistema frente a cualquier anomalía, el backend implementa reglas de validación severas en Express:

### Módulo de Usuarios
- La cédula de identidad debe ser provista y limpiada.
- En `changePassword`, la contraseña nueva debe contener como mínimo 6 caracteres.
- Al crear un usuario, el campo `cla_usu` es estrictamente obligatorio (`400 Bad Request: La contraseña es obligatoria`).

### Módulo de Rendiciones
- La fecha de la rendición (`fec_rnd`) no puede superar la fecha actual (`new Date()`).
- El número de control de la rendición (`num_rnd`) debe ser único por cada Orden de Pago (`checkDuplicateNumRnd`).

### Módulo de Notas de Débito (NDB)
- La fecha del documento (`fec_ndb`) no puede ser futura.
- El número del documento (`num_ndb`) se valida para asegurar el prefijo `'ND-'` antes de registrarlo.
- Se valida la unicidad global del número de nota de débito (`checkDuplicateNumNdb`).
- **Validación de Subtotales y Retenciones**:
  - El subtotal no puede ser menor a la suma de las retenciones aplicadas (`rtc_ndb` (IVA), `tbf_ndb` (Timbre Fiscal), `isl_ndb` (ISLR)).
  - El subtotal no puede superar el monto de la Orden de Pago asociada.
  - Ninguna retención individual puede superar o igualar el subtotal de la factura.
  - Ninguna retención individual puede igualar o superar el monto de la OPG de respaldo.
- **Validación al Reducir Montos**: Si se edita una Nota de Débito y el nuevo monto es inferior al original, el controlador valida que no caiga por debajo de la sumatoria de sus detalles de gastos ya imputados (`totalDetails`), evitando inconsistencias presupuestarias.

---

## 7. Persistencia de Datos y Pool de Conexiones

La conexión a la base de datos se centraliza en [connection.database.js](file:///c:/Users/Mariana%20Morales/Desktop/9no%20Pasantias/Programacion/Pasantias-Backend/src/database/connection.database.js), utilizando el controlador asíncrono `mysql2/promise`.

El pool se configura con los siguientes parámetros contables y operativos:
* **`waitForConnections: true`**: Habilita la cola de consultas entrantes cuando todas las conexiones físicas están en uso, en lugar de lanzar una excepción de timeout.
* **`connectionLimit: 10`**: Limita el pool a un máximo de 10 conexiones activas concurrentes para optimizar los recursos del motor de base de datos MySQL.
* **`queueLimit: 0`**: Desactiva el límite de la cola de espera de consultas (permite encolar indefinidamente bajo ráfagas de peticiones).

### Validación de Conexión en el Arranque (Health Check)
Durante el ciclo de inicialización del servidor, se realiza una prueba de conexión:
```javascript
try {
    await db.query('SELECT 1');
    console.log(`✅ Connected to MySQL database: ${DB_database}`);
} catch (error) {
    console.error('❌ Error connecting to database:', error.message);
}
```
Esto garantiza que cualquier error de red, credenciales o caída del servicio de base de datos sea capturado inmediatamente en consola para su análisis técnico.

---

## 8. Seguridad y Validaciones a Nivel de Middleware (JWT y Roles)

El archivo [jwt.js](file:///c:/Users/Mariana%20Morales/Desktop/9no%20Pasantias/Programacion/Pasantias-Backend/src/middlewares/jwt.js) expone los middlewares encargados de la seguridad y el control de accesos de la API REST:

### 1. Autenticación (`verifyToken`)
Extrae la cookie `token` del flujo de la petición HTTP.
- Si la cookie no existe, responde con `401 Unauthorized: No hay token, autorización denegada`.
- Si existe, valida la firma con `jwt.verify` y la semilla `PALABRASECRETA`. Si es inválido o expiró, retorna `403 Forbidden: Token inválido`.
- Si es válido, inyecta los datos decodificados en `req.user` para su consumo en las capas posteriores y cede el control al siguiente middleware mediante `next()`.

### 2. Autorización por Roles y Permisos (`authorizeRoles`)
Permite definir los privilegios operativos basándose en el rol del usuario autenticado:
* **Rol 1 (Administrador)**: Posee bypass automático en todas las rutas y operaciones de lectura o escritura.
* **Restricción del Módulo de Usuarios**: Si el endpoint solicitado pertenece a la gestión de usuarios (detectado evaluando si `req.originalUrl` incluye `/users`) y el rol del usuario no es `1` (Administrador), se bloquea el flujo con un código `403 Forbidden: Acceso denegado: Solo administradores pueden gestionar usuarios`.
* **Restricción de Solo Lectura para Cuentadantes**: El Rol `3` (Cuentadante) solo tiene autorización de lectura. Si realiza solicitudes con métodos de escritura (`POST`, `PUT`, `DELETE`), el middleware intercepta la petición y responde con un código `403 Forbidden: Acceso denegado: El rol Cuentadante es de solo lectura`.

---

## 9. Captura de Excepciones y Respuestas HTTP Semánticas

El backend captura todos los errores inesperados mediante bloques `try/catch` implementados de manera descentralizada en cada controlador de la aplicación.

### Clasificación de Errores y Respuestas del Servidor:
* **Errores de Base de Datos y Caídas de Conexión**: Las excepciones disparadas por consultas fallidas, caídas de red de base de datos o sintaxis SQL incorrecta son interceptadas en los bloques `catch`. Se realiza un log interno completo (`console.error`) para auditoría del equipo técnico y se responde al cliente con un código genérico `500 Internal Server Error` y un mensaje sanitizado para no exponer la estructura interna de la base de datos.
* **Control de Excepciones Lógicas de Negocio**: Respuestas directas mapeadas con códigos de estado semánticos:
  * `400 Bad Request`: Parámetros inválidos, datos requeridos faltantes o fechas fuera de rango.
  * `401 Unauthorized`: Petición efectuada sin credenciales válidas o sesión expirada.
  * `403 Forbidden`: Privilegios insuficientes (ej: Cuentadante intentando modificar registros o acceso al módulo de usuarios).
  * `404 Not Found`: El recurso buscado no se encuentra registrado en la persistencia.
  * `409 Conflict`: Reglas operativas rotas (ej: número de control duplicado o modificación de rendición en estado `'Entregada'`).
