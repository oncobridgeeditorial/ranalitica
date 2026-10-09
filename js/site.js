/* Datos de contacto y conexiones: cámbialos aquí y se actualizan en todo el sitio.
   Las instrucciones paso a paso están en COMO-ACTIVAR.md */
window.SITE = {
  whatsapp: '526567706088',            // 52 + 10 dígitos. Solo se usa en el botón de cotización; no se muestra en pantalla
  email: 'oncobridge.editorial@gmail.com',
  avisosA: 'oncobridge.editorial@gmail.com',                         // correo donde quieres RECIBIR las solicitudes (ver COMO-ACTIVAR.md)
  avisosCopia: '',                     // opcional: otro correo que también reciba el aviso
  formEndpoint: '',                    // opcional: dirección de Formspree, si prefieres ese servicio
  firebase: null                       // datos del proyecto de Firebase (opiniones con Google)
};
(function () {
  SITE.wa = function (text) {
    return 'https://wa.me/' + SITE.whatsapp + (text ? '?text=' + encodeURIComponent(text) : '');
  };
  // Envío automático de avisos por correo (solicitudes y opiniones nuevas)
  SITE.endpoint = function () {
    if (SITE.formEndpoint) return SITE.formEndpoint;
    if (SITE.avisosA) return 'https://formsubmit.co/ajax/' + encodeURI(SITE.avisosA);
    return '';
  };
  SITE.puedeEnviar = function () { return !!SITE.endpoint(); };
  SITE.enviar = function (datos, asunto) {
    var body = { _subject: asunto, _template: 'table', _captcha: 'false' };
    Object.keys(datos).forEach(function (k) { body[k] = datos[k]; });
    if (datos.correo) { body.email = datos.correo; body._replyto = datos.correo; }
    if (SITE.avisosCopia) body._cc = SITE.avisosCopia;
    return fetch(SITE.endpoint(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body)
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok || j.success === 'false' || j.success === false) throw new Error('envio');
        return j;
      });
    });
  };
  SITE.mail = function (subject, body) {
    return 'mailto:' + SITE.email + '?subject=' + encodeURIComponent(subject || '') + '&body=' + encodeURIComponent(body || '');
  };
  function fill() {
    document.querySelectorAll('[data-wa]').forEach(function (a) {
      a.href = SITE.wa(a.getAttribute('data-wa'));
      a.target = '_blank';
      a.rel = 'noopener';
    });
    document.querySelectorAll('[data-mail]').forEach(function (a) {
      a.href = SITE.mail(a.getAttribute('data-mail-subject') || '', a.getAttribute('data-mail'));
    });
    document.querySelectorAll('[data-email-text]').forEach(function (el) {
      el.textContent = SITE.email;
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fill);
  else fill();
})();
