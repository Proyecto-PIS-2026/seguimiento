# Mercado Hoy · prototipo full stack

Aplicación Next.js con cuentas, mercados y administración persistidos en PostgreSQL.
Los componentes compartidos conservan la interfaz de `proto-ui`; esa versión sigue siendo una demostración sin backend.

## Desarrollo local

Usar Node.js 20.19 o superior y pnpm. Detener el servicio antes de instalar
las dependencias en el directorio desplegado.

```bash
pnpm install
cp .env.example .env.local
# Configurar DATABASE_URL con la base PostgreSQL correspondiente.
pnpm db:generate
pnpm db:migrate
pnpm seed:demo
pnpm dev
```

Todos los accesos a datos de la aplicación, scripts y pruebas usan Prisma Client.
`src/server/database.ts` conserva una única instancia y un pool de hasta cinco
conexiones mediante el adaptador oficial `@prisma/adapter-pg`; no hay consultas
mediante `pg` directamente. Los únicos SQL de ejecución son el chequeo de salud
y los bloqueos transaccionales de PostgreSQL, invocados mediante Prisma.

El esquema está en `prisma/schema.prisma`. La migración `000_baseline` conserva
las restricciones CHECK, los índices de email normalizado y las migraciones
históricas de `db/migrations`. Esos archivos históricos se conservan como referencia;
los nuevos cambios se administran con Prisma Migrate.

En este servidor la base existente ya está registrada con esa migración. Para
adoptar Prisma en **otra base existente con las cinco migraciones históricas aplicadas**,
registrar una sola vez `pnpm exec prisma migrate resolve --applied 000_baseline`.
Para una base vacía usar `pnpm db:migrate` directamente. No usar `db push` ni reset
para actualizar producción. Los cambios futuros se preparan con
`pnpm exec prisma migrate dev --name nombre` en una base de desarrollo y se aplican
con `pnpm db:migrate`; revisar el SQL para conservar CHECK e índices de expresión,
que Prisma no representa completamente en su esquema.

`DATABASE_URL` es privada del servidor. Prisma CLI carga `.env.local` y respeta
las variables del entorno. `/api/health` comprueba la conexión mediante Prisma.
`pnpm build` y `pnpm dev` generan el cliente antes de iniciar Next.js.

Producción en este servidor: el servicio systemd `proto-full-stack` ejecuta
`next start` con `NODE_ENV=production` en `127.0.0.1:10001`; Nginx publica HTTPS
por el puerto 10000. Para desplegar: detener el servicio, instalar dependencias,
aplicar migraciones, ejecutar `pnpm build` y reiniciar el servicio. El usuario
`proto-full-stack` necesita lectura de `.env.local`, `.next` y `node_modules`.

## Cuentas y permisos

La cuenta de administración de demostración es `admin/admin`.
Desde Administración → Operadores o Productores se pueden crear, editar, desactivar y eliminar cuentas.
El email se utiliza como usuario y es único entre ambos tipos de cuenta.
Las contraseñas requieren entre 8 y 128 caracteres y se almacenan como hashes scrypt con sal aleatoria.
Al editar se puede dejar el campo vacío para conservar la contraseña actual.
Los registros creados antes de incorporar credenciales se conservan: hay que definirles una contraseña desde Editar.

Las sesiones duran ocho horas, usan una cookie HttpOnly y se guardan en PostgreSQL.
Cambiar una contraseña, desactivar o eliminar una cuenta invalida sus sesiones.
Cada cuenta accede únicamente a su mercado. Las cuentas `operador/operador` y `productor/productor`
se conservan para demostración y tienen mercados separados de las cuentas reales.
El acceso automático mediante parámetros `user` y `pass` sólo admite esas cuentas de demostración y `admin`.

## Flujos implementados

- Alta, edición, baja y acceso de operadores y productores.
- Publicaciones propias: combinación comercial, precio positivo con dos decimales, foto opcional,
  modificación, eliminación y disponibilidad desde la edición de precio por URL.
- Fotos JPG, PNG o WebP de hasta 2 MB, persistidas como datos de imagen; no se guardan URLs temporales del navegador.
- Horarios y vacaciones con fechas válidas, reemplazo activo y cancelación.
- Directorios públicos y pizarrones construidos con cuentas y publicaciones reales, incluyendo acceso directo por URL.
- Lista inteligente administrable y visible públicamente.
- Importación de precios recomendados desde Excel `.xlsx` de hasta 5 MB: plantilla descargable,
  vista previa, validación de especies y precios, y aplicación transaccional. Columnas `especie_id` y `precio`.
  Los precios recomendados se muestran en la lista inteligente; no reemplazan los precios publicados por los vendedores.
- Solicitudes de recuperación guardadas en la base y resolución desde administración.
  El administrador verifica la identidad por sus canales habituales y define una contraseña en la edición de la cuenta.
- Favoritos conservados en el navegador, enlaces a ubicación y WhatsApp, estados de carga/error y reintento.

## Integraciones pendientes

Los catálogos de especies, variedades, presentaciones, unidades, calibres y categorías siguen utilizando
los datos de demostración de `shared.ts`. No se proporcionó una URL ni credenciales del webservice externo.
Google y 2FA no están habilitados. Las pantallas lo indican y no simulan una activación.
Tampoco hay un servicio de correo configurado: la recuperación crea una solicitud para administración;
no anuncia emails enviados ni admite cambiar contraseñas sin validar la identidad.

## Verificación

```bash
pnpm typecheck
pnpm build
# Con la aplicación ejecutándose y la base local disponible:
pnpm test
# Para apuntar a otro puerto:
TEST_BASE_URL=http://localhost:3002 pnpm test
```

Las pruebas de integración crean cuentas temporales y las eliminan al finalizar.
Comprueban permisos, hashes, acceso, edición, contraseñas, desactivación, aislamiento entre mercados,
publicaciones, horarios, vacaciones, productores, recomendaciones y solicitudes de recuperación.

## Datos de ejemplo de operador/operador

`pnpm seed:demo` carga en PostgreSQL las combinaciones, precios y fotos originales de las 20 especies
del mercado de Frutas del Norte, asociado exclusivamente a `frutas-del-norte`.
La carga es transaccional y queda registrada en `prototype_seeds`: ejecutarla nuevamente no duplica
registros, no sobrescribe cambios y no vuelve a crear publicaciones eliminadas después de la carga.
Las cuentas reales y sus publicaciones permanecen independientes.
