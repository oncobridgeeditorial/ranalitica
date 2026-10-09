# Cómo activar las partes que necesitan conexión

## 0. Subir la página a r-analitica.site con GitHub Pages (gratis)

**A. Preparar los archivos**
1. Descomprime `sitio-ranalitica.zip` en una carpeta (clic derecho > Extraer todo). Adentro debes ver `index.html`, `style.css` y las carpetas `js` e `images`.

**B. Crear tu cuenta y tu repositorio (la "carpeta" en internet donde vive la página)**
2. Entra a https://github.com y presiona "Sign up". Crea la cuenta con tu correo y confirma el código que te llega.
3. Ya dentro, presiona el botón verde "New" (o el signo + de arriba a la derecha > "New repository").
4. En "Repository name" escribe `ranalitica`. Deja la opción **Public** marcada (con cuenta gratis, Pages solo funciona con repositorios públicos). Presiona "Create repository".

**C. Subir los archivos**
5. En la página del repositorio recién creado presiona el enlace "uploading an existing file".
6. Abre la carpeta descomprimida en tu computadora, selecciona TODO lo que hay adentro (los archivos .html, style.css, COMO-ACTIVAR.md, firestore.rules y las carpetas js e images) y arrástralo a la ventana del navegador. Espera a que termine de cargar.
7. Baja hasta "Commit changes" y presiona el botón verde. (No subas la carpeta contenedora: `index.html` debe quedar en la raíz del repositorio, no dentro de otra carpeta.)

**D. Encender la página**
8. En el repositorio, entra a "Settings" (pestaña de arriba) > "Pages" (menú izquierdo).
9. En "Build and deployment", en "Source" elige "Deploy from a branch". En "Branch" elige `main` y la carpeta `/ (root)`. Presiona "Save".
10. Espera uno o dos minutos y recarga. Aparece un mensaje con la dirección de la página, algo como `https://TU-USUARIO.github.io/ranalitica/`. Ábrela para comprobar que se ve bien.

**E. Conectar tu dominio r-analitica.site**
11. En esa misma pantalla de Pages, en "Custom domain" escribe `r-analitica.site` y presiona "Save". Te dirá que el dominio aún no está verificado; es normal.
12. Entra a la cuenta de tu registrador (donde compraste el dominio), abre r-analitica.site y busca "DNS" o "Advanced DNS" (administrar registros).
13. Borra los registros que haya por defecto de "parking" o redirección. Agrega estos cuatro registros de tipo **A**, con host `@`:
   - 185.199.108.153
   - 185.199.109.153
   - 185.199.110.153
   - 185.199.111.153
14. Agrega un registro de tipo **CNAME** con host `www` y valor `TU-USUARIO.github.io` (con tu usuario de GitHub, sin `/ranalitica`).
15. Guarda. Los cambios tardan de unos minutos a unas horas.
16. Regresa a Settings > Pages en GitHub. Cuando el dominio se verifique aparece la casilla "Enforce HTTPS": márcala (activa el candado).
17. Prueba abrir https://r-analitica.site.
18. Si el registrador te manda un correo para verificar el contacto del dominio, confírmalo; si no, el dominio puede suspenderse.

**F. Después de que ya abra tu dominio**
19. En Firebase agrega `r-analitica.site` en "Dominios autorizados" (sección 3, paso 10).
20. Llena una solicitud de prueba en la página y activa el correo (sección 2).

**Para actualizar la página después:** entra al repositorio, presiona "Add file" > "Upload files", arrastra los archivos nuevos (reemplazan a los anteriores) y "Commit changes". En uno o dos minutos se actualiza sola.

Nota: como el repositorio es público, cualquiera podría ver el código, incluido tu correo de avisos y tu número de WhatsApp en `js/site.js`. Eso ya es visible para quien inspeccione la página publicada.

## 1. Tus datos de contacto (2 minutos)
En `js/site.js` cambia:
- `whatsapp` ya trae tu número. Solo se usa en el botón de cotización del cotizador y no aparece escrito en ninguna parte de la página.
- `email` ya trae oncobridge.editorial@gmail.com; cámbialo cuando tengas un correo propio del dominio.
Guarda el archivo.

## 2. Que las solicitudes te lleguen automáticamente al correo
Cuando alguien llena la solicitud, te llega un correo al instante con todos sus datos (y puedes contestarle directo, porque el correo trae su dirección como "responder a"). Si tienes el correo en el celular, es un aviso inmediato. Usa el servicio gratuito FormSubmit, que no pide crear cuenta.
1. En `js/site.js`, `avisosA` ya trae oncobridge.editorial@gmail.com. Si algún día quieres otro correo, cámbialo ahí (y en `email`, que es el que se muestra en la página).
2. Si quieres que le llegue también a otra persona del equipo, escribe su correo en `avisosCopia`.
3. Publica la página (o ábrela desde internet) y llena una solicitud de prueba tú mismo.
4. Esa primera vez, FormSubmit te manda un correo con un botón "Activate Form". Ábrelo (revisa spam) y presiona el botón. Solo se hace una vez.
5. Llena otra solicitud de prueba: ahora sí te llega completa.
(Alternativa: si prefieres Formspree, crea cuenta en https://formspree.io, crea un formulario, copia su dirección `https://formspree.io/f/xxxx` y pégala en `formEndpoint`. Funciona igual.)
Nota: el aviso llega por correo. Un aviso automático por WhatsApp requiere un servicio de pago (WhatsApp Business API), por eso no lo incluí.
Las opiniones nuevas también te avisan por este mismo correo, para que las apruebes.

## 3. Opiniones con cuenta de Google (Firebase, gratis para este uso)
Firebase es un servicio de Google que guarda las opiniones y verifica quién las escribe.

**Crear el proyecto**
1. Entra a https://console.firebase.google.com con tu cuenta de Google.
2. "Crear un proyecto". Nombre: "ranalitica". Puedes desactivar Google Analytics. Continuar hasta crearlo.

**Registrar la página web**
3. En la pantalla principal del proyecto presiona el ícono `</>` (Web).
4. Ponle un apodo, por ejemplo "sitio", y presiona "Registrar app". No marques Hosting.
5. Aparece un bloque de código con `const firebaseConfig = { apiKey: "...", authDomain: "...", projectId: "...", ... }`. Copia lo que está entre las llaves `{ }`.
6. En `js/site.js` reemplaza `firebase: null` por `firebase: ` seguido de lo que copiaste, con las llaves. Ejemplo:
   `firebase: { apiKey: "AIza...", authDomain: "ranalitica.firebaseapp.com", projectId: "ranalitica", storageBucket: "...", messagingSenderId: "...", appId: "..." }`
   Estos datos no son secretos; lo que protege tu base son las reglas del paso 9.

**Activar el inicio de sesión con Google**
7. Menú izquierdo: Compilación > Authentication > "Comenzar" > pestaña "Sign-in method" > Google > Habilitar. Elige tu correo como correo de asistencia y guarda.

**Crear la base de datos y sus reglas**
8. Compilación > Firestore Database > "Crear base de datos". Elige una ubicación (la más cercana a México que aparezca) y "Iniciar en modo de producción".
9. Pestaña "Reglas". Borra todo lo que haya, pega el contenido del archivo `firestore.rules` que viene en esta carpeta y presiona "Publicar".

**Permitir tu dominio**
10. Authentication > Settings > "Dominios autorizados" > "Agregar dominio". Escribe la dirección de tu página ya publicada (por ejemplo `ranaliticamedica.com`). Sin este paso, el inicio de sesión falla.

**Aprobar opiniones**
11. Cuando alguien envíe una opinión, entra a Firestore Database > Datos > colección `opiniones`. Abre el documento, cambia `approved` de `false` a `true` y guarda. A partir de ese momento aparece en la página.
Ahí mismo puedes ver quién la escribió. Para quitar una opinión, cambia `approved` otra vez a `false`.

## 4. Actualizar la gráfica de tesis
Abre `js/tesis.js`. Cambia los números o agrega una línea como `["Dermatología", 2],`. Cada nenúfar es una especialidad y su tamaño y el total se calculan solos.

## 5. Cambiar El croac de la semana
Abre `js/humor.js`. Puedes editar los textos del cómic, o poner una imagen de meme en la carpeta `images` y escribir su nombre en `imagen`.
