(function () {
  function init() {
    var root = document.getElementById('cotizador');
    var dataEl = document.getElementById('precios-data');
    if (!root || !dataEl) return;
    var D = JSON.parse(dataEl.textContent);

    var lineasEl = document.getElementById('lineas');
    var totalEl = document.getElementById('total');
    var accionesEl = document.getElementById('acciones');
    var btnWa = document.getElementById('btn-wa');
    var btnMail = document.getElementById('btn-mail');
    var vacioEl = document.getElementById('vacio');

    function money(n) { return '$' + Number(n).toLocaleString('es-MX'); }
    function val(name) {
      var el = root.querySelector('input[name="' + name + '"]:checked');
      return el ? el.value : null;
    }

    function compute() {
      var s = val('servicio');
      var p = val('plazo') || 'estandar';
      var lines = [], sub = 0, desc = '';

      if (s === 'redaccion') {
        var nombres = [];
        root.querySelectorAll('input[name="seccion"]:checked').forEach(function (i) {
          var x = D.secciones[i.value];
          lines.push({ label: x.label, amount: x.price });
          nombres.push(x.label);
          sub += x.price;
        });
        desc = 'redacción de tesis' + (nombres.length ? ' (' + nombres.join(', ') + ')' : '');
      } else if (s === 'asesoria') {
        var e = D.extension[val('extension') || 'mediana'];
        lines.push({ label: 'Asesoría estadística, extensión ' + e.label.toLowerCase(), amount: e.price });
        sub = e.price;
        desc = 'asesoría estadística, extensión ' + e.label.toLowerCase();
      } else if (s) {
        var x = D.servicios[s];
        lines.push({ label: x.label, amount: x.base });
        sub = x.base;
        desc = x.label.toLowerCase();
      }

      var pl = D.plazos[p];
      var total = Math.round(sub * pl.mult / 50) * 50;
      var extra = total - sub;
      if (sub > 0 && extra > 0) {
        lines.push({ label: 'Plazo ' + pl.label.toLowerCase() + ' (' + pl.rango + ')', amount: extra, extra: true });
      }
      return { lines: lines, sub: sub, total: total, desc: desc, plazo: pl };
    }

    function update() {
      var r = compute();

      root.querySelectorAll('[data-solo]').forEach(function (fs) {
        fs.hidden = fs.getAttribute('data-solo') !== val('servicio');
      });

      lineasEl.innerHTML = '';
      r.lines.forEach(function (l) {
        var li = document.createElement('li');
        if (l.extra) li.className = 'extra';
        var a = document.createElement('span'); a.textContent = l.label;
        var d = document.createElement('span'); d.className = 'puntos'; d.setAttribute('aria-hidden', 'true');
        var b = document.createElement('span'); b.className = 'precio'; b.textContent = (l.extra ? '+' : '') + money(l.amount);
        li.appendChild(a); li.appendChild(d); li.appendChild(b);
        lineasEl.appendChild(li);
      });

      var vacio = r.sub === 0;
      vacioEl.hidden = !vacio;
      accionesEl.hidden = vacio;
      totalEl.textContent = money(r.total) + ' MXN';

      if (!vacio) {
        var texto = 'Hola, soy [tu nombre]. Quiero cotizar ' + r.desc + ', con plazo ' + r.plazo.label.toLowerCase() +
          ' (' + r.plazo.rango + '). El estimado que vi en la página es de ' + money(r.total) + ' MXN. Me gustaría agendar la junta inicial.';
        btnWa.href = SITE.wa(texto);
        btnWa.target = '_blank';
        btnWa.rel = 'noopener';
        if (btnMail) btnMail.href = SITE.mail('Cotización | Ranalítica Médica', texto);
      }
    }

    root.addEventListener('change', update);
    update();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
