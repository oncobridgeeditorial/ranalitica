(function () {
  function init() {
    var panel = document.getElementById('opinion');
    if (!panel) return;
    var cfg = window.SITE && SITE.firebase && SITE.firebase.apiKey ? SITE.firebase : null;
    var stars = [].slice.call(panel.querySelectorAll('.estrella'));
    var group = panel.querySelector('.estrellas');
    var comment = document.getElementById('comentario');
    var status = document.getElementById('estado-opinion');
    var sesion = document.getElementById('op-sesion');
    var formBox = document.getElementById('op-form');
    var quien = document.getElementById('op-quien');
    var lista = document.getElementById('op-lista');
    var vacio = document.getElementById('op-vacio');
    var prom = document.getElementById('op-promedio');
    var rating = 0, user = null, fb = null;

    function say(t) { status.textContent = t; }
    function paint(n) { stars.forEach(function (s) { s.classList.toggle('on', Number(s.getAttribute('data-valor')) <= n); }); }
    stars.forEach(function (s) {
      s.addEventListener('mouseenter', function () { paint(Number(s.getAttribute('data-valor'))); });
      s.addEventListener('click', function () {
        rating = Number(s.getAttribute('data-valor'));
        stars.forEach(function (x) { x.setAttribute('aria-checked', x === s ? 'true' : 'false'); });
        paint(rating);
      });
    });
    group.addEventListener('mouseleave', function () { paint(rating); });

    function load() {
      if (fb) return fb;
      var base = 'https://www.gstatic.com/firebasejs/10.12.2/';
      fb = Promise.all([import(base + 'firebase-app.js'), import(base + 'firebase-auth.js'), import(base + 'firebase-firestore.js')])
        .then(function (m) {
          var app = m[0].initializeApp(cfg);
          return { auth: m[1].getAuth(app), A: m[1], db: m[2].getFirestore(app), F: m[2] };
        });
      return fb;
    }

    function starText(n) { return '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n); }
    function show(items) {
      lista.innerHTML = '';
      items.forEach(function (o) {
        var li = document.createElement('li');
        var s = document.createElement('p'); s.className = 'op-estrellas'; s.textContent = starText(o.rating);
        s.setAttribute('aria-label', o.rating + ' de 5 estrellas');
        var n = document.createElement('p'); n.className = 'op-nombre'; n.textContent = o.name;
        li.appendChild(s); li.appendChild(n);
        if (o.text) { var t = document.createElement('p'); t.className = 'op-texto'; t.textContent = o.text; li.appendChild(t); }
        lista.appendChild(li);
      });
      vacio.hidden = items.length > 0;
      if (items.length) {
        var avg = items.reduce(function (a, o) { return a + o.rating; }, 0) / items.length;
        prom.textContent = avg.toFixed(1).replace('.', ',') + ' de 5, según ' + items.length + (items.length === 1 ? ' opinión' : ' opiniones');
        prom.hidden = false;
      }
    }

    if (cfg) {
      load().then(function (x) {
        var q = x.F.query(x.F.collection(x.db, 'opiniones'), x.F.where('approved', '==', true), x.F.limit(100));
        x.F.getDocs(q).then(function (snap) {
          var items = [];
          snap.forEach(function (d) { items.push(d.data()); });
          items.sort(function (a, b) { return ((b.createdAt && b.createdAt.seconds) || 0) - ((a.createdAt && a.createdAt.seconds) || 0); });
          show(items);
        });
        x.A.onAuthStateChanged(x.auth, function (u) {
          user = u;
          sesion.hidden = !!u; formBox.hidden = !u;
          if (u) quien.textContent = 'Vas a opinar como ' + (u.displayName || u.email) + '. Tu nombre aparecerá junto a tu opinión.';
        });
      }).catch(function () { say('No se pudieron cargar las opiniones. Intenta de nuevo más tarde.'); });
    }

    document.getElementById('op-entrar').addEventListener('click', function () {
      if (!cfg) { say('Las opiniones con cuenta de Google todavía no están activadas en esta página.'); return; }
      say('');
      load().then(function (x) { return x.A.signInWithPopup(x.auth, new x.A.GoogleAuthProvider()); })
        .catch(function () { say('No se pudo iniciar sesión. Revisa que tu navegador permita ventanas emergentes.'); });
    });
    document.getElementById('op-salir').addEventListener('click', function () {
      load().then(function (x) { return x.A.signOut(x.auth); });
    });
    document.getElementById('enviar-opinion').addEventListener('click', function () {
      if (!user) return;
      if (!rating) { say('Elige una calificación de 1 a 5 estrellas.'); return; }
      load().then(function (x) {
        return x.F.setDoc(x.F.doc(x.db, 'opiniones', user.uid), {
          uid: user.uid, name: user.displayName || 'Usuario de Google', rating: rating,
          text: comment.value.trim(), approved: false, createdAt: x.F.serverTimestamp()
        });
      }).then(function () {
        if (SITE.puedeEnviar()) SITE.enviar({ tipo: 'Opinión pendiente de aprobar', nombre: user.displayName || '', estrellas: rating, comentario: comment.value.trim() }, 'Nueva opinión por aprobar').catch(function () {});
        formBox.hidden = true;
        say('Gracias. Tu opinión se publicará en cuanto la revisemos.');
      }).catch(function (err) {
        say(err && err.code === 'permission-denied'
          ? 'Esta cuenta ya envió una opinión. Solo se permite una por persona.'
          : 'No se pudo enviar tu opinión. Intenta de nuevo.');
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
