# marinettoo.es

Portfolio personal. HTML, CSS y JavaScript sin dependencias ni paso de compilación.

## Publicar en GitHub Pages
1. Sube el contenido de esta carpeta a la raíz de un repositorio (por ejemplo `Marinettoo/marinettoo.github.io` o cualquier otro).
2. En el repo: **Settings → Pages → Build and deployment → Deploy from a branch**, rama `main`, carpeta `/ (root)`.
3. En **Custom domain** escribe `marinettoo.es` (el archivo `CNAME` ya lo incluye) y activa **Enforce HTTPS** cuando esté disponible.
4. DNS del dominio: registros `A` para `@` apuntando a `185.199.108.153`, `185.199.109.153`, `185.199.110.153` y `185.199.111.153`, y un `CNAME` para `www` hacia `<tu-usuario>.github.io`.

## Estructura
- `index.html`: contenido (en español). Cada texto traducible lleva `data-i18n="clave"`.
- `js/main.js`: traducciones al inglés, tema claro/oscuro, navbar, menú móvil y carrusel.
- `js/icons.js`: iconos SVG del carrusel de tecnologías.
- `css/styles.css`: estilos y variables de tema.
- `assets/`: foto, iconos y tipografía Inter (licencia OFL, autoalojada).

## Pendiente
- Insignia de IBM SkillsBuild: guarda la imagen como `assets/ibm-badge.png` y sustituye el texto "IBM" en la sección de certificaciones (hay un comentario en `index.html`).
