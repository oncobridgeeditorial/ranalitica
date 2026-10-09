/* El croac de la semana.
   Para cambiarlo cada semana, edita este bloque:
   - Si tienes una imagen de meme o cómic, ponla en la carpeta images/ y escribe su nombre en "imagen"
     (por ejemplo 'images/meme-semana.jpg') y una descripción en "alt".
   - Si "imagen" está vacío, se muestra el cómic de texto de "paneles". */
window.HUMOR = {
  semana: 'Semana del 5 de octubre',
  imagen: 'images/croac-semana.jpg',
  alt: 'Cómic de tres viñetas: una rana con bata blanca celebra que ya tiene todos los resultados de su tesis; en la segunda se angustia porque aún debe escribir 25,000 palabras, formatear referencias, hacer 10 figuras y responder al asesor; en la tercera, agotada, piensa que debió subir TikToks en pandemia.',
  paneles: [
    { quien: 'Residente, después de la guardia', texto: 'Ya casi termino la tesis. Solo me falta la estadística.' },
    { quien: 'Estadístico', texto: '¿Y cuál es tu pregunta de investigación?' },
    { quien: 'Residente', texto: '…¿Esa también la hacen ustedes?' }
  ],
  pie: ''
};
(function () {
  function draw() {
    var box = document.getElementById('humor-cuerpo');
    var H = window.HUMOR;
    if (!box || !H) return;
    var sem = document.getElementById('humor-semana'); if (sem) sem.textContent = H.semana || '';
    box.innerHTML = '';
    if (H.imagen) {
      var img = document.createElement('img'); img.src = H.imagen; img.alt = H.alt || 'Meme de la semana'; img.className = 'humor-img';
      box.appendChild(img);
    } else {
      var row = document.createElement('div'); row.className = 'tira';
      (H.paneles || []).forEach(function (p, i) {
        var f = document.createElement('figure'); f.className = 'vineta';
        var n = document.createElement('span'); n.className = 'vn'; n.textContent = i + 1;
        var q = document.createElement('figcaption'); q.textContent = p.quien;
        var t = document.createElement('p'); t.textContent = p.texto;
        f.appendChild(n); f.appendChild(q); f.appendChild(t);
        row.appendChild(f);
      });
      box.appendChild(row);
    }
    if (H.pie) { var pie = document.createElement('p'); pie.className = 'humor-pie'; pie.textContent = H.pie; box.appendChild(pie); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', draw);
  else draw();
})();
