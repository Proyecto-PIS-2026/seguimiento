# Reglas del proyecto

- Esta aplicación es la versión full stack en Next.js de `proto-ui`. Debe reutilizar sus componentes y mantener paridad visual y funcional; los cambios compartidos deben aplicarse en ambos prototipos mientras convivan.
- Las páginas se resuelven con Next.js App Router y deben admitir acceso directo por URL además de navegación SPA sin recarga completa.
- Las operaciones que representen acceso a datos deben pasar por la API bajo `/api`; no se deben importar módulos cliente desde Route Handlers. Los datos compartidos con el backend deben permanecer libres de hooks y APIs del navegador.
- Es obligatorio reutilizar los componentes existentes siempre que la aplicación ya disponga de uno que resuelva la misma necesidad.
- Cada componente debe vivir en su propio archivo; no puede haber más de un componente por archivo.
- Todo el código de la aplicación debe escribirse en TypeScript.
- La aplicación debe conservar únicamente cuatro tipos de listados principales: tarjetas de mercado con imagen, productos publicados por un operador o productor, directorios sin imagen y lista inteligente pública. Todo listado nuevo debe reutilizar uno de estos formatos; no se deben crear variantes adicionales salvo que el usuario lo solicite explícitamente.

## Modelo de datos del catálogo

- **Grupo:** clasificación superior identificada por su descripción.
- **Especie:** pertenece a un grupo y tiene un nombre. Es la entidad que se selecciona primero al crear una publicación; no debe rotularse como “producto” dentro de formularios de catálogo.
- **Variedad:** pertenece a una especie y tiene nombre, código, estado y valores de conversión entre unidades de medida.
- **Presentación:** pertenece a una especie y variedad; tiene descripción, peso/unidad predeterminado y puede marcarse como predeterminada.
- **Unidad de medida:** describe cómo se mide o empaca la mercadería y tiene nombre y código.
- **Calibre:** tiene código y nombre de código.
- **Categoría:** pertenece a una especie y tiene descripción.
- **Publicación comercial:** un operador o productor selecciona una especie y define una combinación de variedad, presentación, unidad de medida, calibre y categoría. A esa combinación le asigna una foto opcional y un precio obligatorio.

Los catálogos anteriores provienen de un webservice y no se mantienen desde esta aplicación. “Producto” puede utilizarse como término comercial genérico en el pizarrón, listados y lista inteligente, pero los formularios deben respetar los nombres exactos del modelo. Una combinación comercial no debe denominarse “variante” cuando se refiere al conjunto completo de atributos.
