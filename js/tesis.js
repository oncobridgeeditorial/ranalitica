/* Tesis acompañadas por especialidad ("el estanque": cada nenúfar es una especialidad).
   Para actualizar: cambia los números o agrega una línea nueva  ['Nombre del área', cantidad],
   Si agrupas varias especialidades, el tercer dato (opcional) aparece al pasar el cursor sobre el nenúfar.
   El tamaño de cada nenúfar y el total se calculan solos. */
window.TESIS = [
  ['Cirugía', 10],
  ['Pediatría', 8],
  ['Oftalmología', 7],
  ['Ginecología', 6],
  ['Medicina familiar', 5],
  ['Medicina interna', 5],
  ['Diagnóstico por imagen', 5, 'radiología, imagenología y medicina nuclear'],
  ['Salud ocupacional y calidad', 5, 'medicina del trabajo y calidad de la atención'],
  ['Psiquiatría', 2]
];
(function () {
  function draw() {
    var ul = document.getElementById('tesis-grafica');
    if (!ul || !window.TESIS) return;
    var d = window.TESIS.slice().sort(function (a, b) { return b[1] - a[1]; });
    var total = 0;
    d.forEach(function (x) { total += x[1]; });
    var t = document.getElementById('tesis-total'); if (t) t.textContent = total;
    var r = document.getElementById('tesis-resumen');
    if (r) r.textContent = 'tesis de residencia en ' + d.length + ' áreas. Entre más grande el nenúfar, más tesis.';
    var max = d[0][1];
    ul.style.setProperty('--cols', d.length);
    ul.innerHTML = '';
    d.forEach(function (x) {
      var li = document.createElement('li'); li.className = 'pad';
      li.style.setProperty('--r', (0.45 + 0.55 * x[1] / max).toFixed(3));
      li.style.setProperty('--a', '32deg');
      li.title = x[0] + ': ' + x[1] + ' tesis' + (x[2] ? ' (' + x[2] + ')' : '');
      var disco = document.createElement('div'); disco.className = 'disco'; disco.textContent = x[1];
      var a = document.createElement('p'); a.className = 'area'; a.textContent = x[0];
      li.appendChild(disco); li.appendChild(a);
      ul.appendChild(li);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', draw);
  else draw();
})();
