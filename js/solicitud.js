(function () {
  function init() {
    var form = document.getElementById('solicitud');
    if (!form) return;
    var status = document.getElementById('estado-solicitud');

    function say(t) { status.textContent = t; }
    function link(href, text) {
      var a = document.createElement('a'); a.href = href; a.target = '_blank'; a.rel = 'noopener'; a.textContent = text;
      return a;
    }
    function resumen(d) {
      return ['Hola, quiero hacer una solicitud en Ranalítica Médica.',
        'Nombre: ' + d.nombre,
        d.whatsapp ? 'WhatsApp: ' + d.whatsapp : '',
        d.correo ? 'Correo: ' + d.correo : '',
        d.especialidad ? 'Especialidad: ' + d.especialidad : '',
        d.institucion ? 'Hospital o institución: ' + d.institucion : '',
        d.anio ? 'Año: ' + d.anio : '',
        'Necesito: ' + d.necesidad,
        d.plazo ? 'Plazo: ' + d.plazo : '',
        d.mensaje ? 'Mensaje: ' + d.mensaje : ''].filter(Boolean).join('\n');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = new FormData(form), d = {};
      f.forEach(function (v, k) { d[k] = String(v).trim(); });
      if (d._honey) { say('Listo, recibimos tu solicitud.'); return; }
      if (!d.nombre) { say('Escribe tu nombre.'); form.nombre.focus(); return; }
      if (!d.whatsapp && !d.correo) { say('Déjanos un WhatsApp o un correo para poder contactarte.'); form.whatsapp.focus(); return; }
      if (!d.necesidad) { say('Elige qué necesitas.'); form.necesidad.focus(); return; }
      if (!form.acepto.checked) { say('Marca la casilla para que podamos contactarte.'); return; }
      delete d.acepto; delete d._honey;

      function respaldo(msg) {
        status.textContent = msg + ' ';
        status.appendChild(link(SITE.mail('Solicitud: ' + d.nombre, resumen(d)), 'Enviar la solicitud por correo'));
      }
      if (!SITE.puedeEnviar()) {
        respaldo('Esta página todavía no está conectada al servicio que recibe solicitudes.');
        return;
      }
      var btn = form.querySelector('button[type=submit]'); btn.disabled = true;
      say('Enviando…');
      SITE.enviar(d, 'Nueva solicitud: ' + d.nombre + ' (' + d.necesidad + ')').then(function () {
        form.reset();
        say('Listo, recibimos tu solicitud. Te escribimos pronto para agendar la junta por Zoom.');
      }).catch(function () {
        respaldo('No pudimos enviarla desde aquí.');
      }).then(function () { btn.disabled = false; });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
