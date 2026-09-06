# Revisión funcional del prototipo full stack

## Defectos corregidos

| Flujo | Problema encontrado | Corrección |
| --- | --- | --- |
| Operadores | No se podía editar ni crear credenciales | Edición, contraseña inicial y cambio de contraseña mediante API |
| Acceso | Sólo funcionaban cuentas fijas | Login por email, hash scrypt e identidad asociada al actor |
| Sesiones | Se perdían al reiniciar y no comprobaban estado de la cuenta | Sesiones en PostgreSQL y revocación por cambio de contraseña, baja o desactivación |
| Productores | Se guardaban en memoria; baja sólo visual | CRUD y credenciales persistentes |
| Mi mercado | Mismo puesto y productos de ejemplo para todas las cuentas | Perfil real y datos aislados por actor |
| Publicaciones | Alta, edición y baja se perdían al recargar | Escrituras y lecturas en PostgreSQL, con autorización por propietario |
| Combinaciones | Agregar podía reutilizar el id de otra combinación; filas/precios generados | Identificadores de la base y filas reales, validación del catálogo y duplicados |
| Precios | Decimales truncados; estado de publicación ignorado | Dos decimales y disponibilidad persistida |
| Fotos | URLs blob desaparecían al recargar | Datos de imagen persistidos, validación de tipo y tamaño |
| Mercado público | Datos estáticos y enlaces de cuentas nuevas sin resolver | Directorios y pizarrones reales; acceso directo por identificador |
| Horarios | Guardar sólo cerraba el editor | Persistencia, validación y confirmación después del guardado |
| Vacaciones | Fechas y reemplazos simulados | Persistencia, reemplazo real, validación y cancelación |
| Lista inteligente | Cambios sólo en estado local; página pública desconectada | CRUD conectado a la vista pública |
| Recuperación | Confirmaba un envío inexistente | Solicitud real para administración; no simula correo ni cambio de contraseña |
| 2FA / Google | Controles sin autenticación real; secreto QR fijo | Estado de disponibilidad explícito; sin falsa activación |
| Excel | Continuar no hacía nada | Plantilla XLSX, lectura, validación, previsualización y aplicación de precios recomendados |
| Confirmación de baja | Cerraba antes de esperar la API | Espera el resultado y mantiene el error visible |
| Paginación | Podía quedar en una página vacía al borrar | Ajuste al último número de página válido |
| Ubicación / contacto | Botones sin acción y WhatsApp sin destinatario | Enlaces con ubicación y teléfono del registro |
| Favoritos | Desaparecían al navegar | Persistencia local |
| Salud del servicio | Informaba OK sin revisar la base | Consulta a PostgreSQL |

Los catálogos externos, Google, 2FA y correo requieren integraciones adicionales; el README describe el alcance actual.

## Validación realizada

- Compilación de producción y validación TypeScript completas.
- Pruebas de integración de API con cuentas temporales, eliminación de datos de prueba y conservación de los registros existentes.
- Prueba en navegador: alta, edición, login, publicación con decimales, edición, recarga, horario, mercado público móvil, eliminación, plantilla/lectura XLSX y recuperación.
- Página administrativa de producción HTTP 200 y recuperación de una sesión desde otro proceso utilizando PostgreSQL.
- Validación TypeScript del código compartido de proto-ui usando las dependencias locales del full stack.
- Auditoría de dependencias sin vulnerabilidades conocidas en el lockfile verificado.
