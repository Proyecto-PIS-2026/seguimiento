# Mercado Hoy · prototipo full stack

Versión Next.js del prototipo de Mercado Hoy. Reutiliza los componentes y estilos de `proto-ui`, incorpora rutas directas mediante App Router y expone una API interna para las operaciones del prototipo.

```bash
npm install
npm run dev
```

La API está disponible bajo `/api`; `/api/health` permite verificar su estado.

Las cuentas de demostración son `operador/operador`, `productor/productor` y `admin/admin`.
Cada cuenta inicia en su mercado o en administración y muestra únicamente los accesos raíz de su rol.
Los detalles y la vista de operador ausente se abren desde sus respectivos flujos, no desde el menú.
Sin sesión se conservan el pizarrón, la lista inteligente y el directorio público de operadores.

Next valida las credenciales mediante `/api/auth/session`, conserva la sesión en una cookie HttpOnly
y comprueba el rol al abrir rutas privadas y modificar registros mediante la API.
Las sesiones duran ocho horas y se guardan en memoria: reiniciar el servidor las invalida.
Son cuentas de prototipo; no constituyen autenticación de producción ni implementan Google o 2FA.
`proto-ui` reproduce el comportamiento visual con una sesión local de demostración.
