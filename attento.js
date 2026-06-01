/* ATTENTO — interactions */
(function(){
  "use strict";
  var WA_LINK = "https://wa.me/553199441764";

  /* ---------- Loader (robust: hides on load OR fallback timer) ---------- */
  function hideLoader(){
    var loader = document.getElementById("loader");
    if(loader) loader.classList.add("hide");
  }
  window.addEventListener("load", function(){ setTimeout(hideLoader, 600); });
  // fallback in case 'load' was missed (cached subresources / embeds)
  document.addEventListener("DOMContentLoaded", function(){ setTimeout(hideLoader, 1200); });
  setTimeout(hideLoader, 2600);

  document.addEventListener("DOMContentLoaded", function(){

    /* ---------- Year ---------- */
    var y = document.getElementById("year");
    if(y) y.textContent = new Date().getFullYear();

    /* ---------- Nav scroll state ---------- */
    var nav = document.getElementById("nav");
    function onScroll(){
      if(window.scrollY > 30){ nav.classList.add("scrolled"); }
      else { nav.classList.remove("scrolled"); }
    }
    window.addEventListener("scroll", onScroll, {passive:true});
    onScroll();

    /* ---------- Mobile menu ---------- */
    var burger = document.getElementById("burger");
    var menu = document.getElementById("mobileMenu");
    function closeMenu(){ menu.classList.remove("open"); document.body.style.overflow=""; }
    if(burger){
      burger.addEventListener("click", function(){
        menu.classList.add("open"); document.body.style.overflow="hidden";
      });
    }
    var mclose = document.getElementById("mobileClose");
    if(mclose) mclose.addEventListener("click", closeMenu);
    menu && menu.querySelectorAll("a").forEach(function(a){ a.addEventListener("click", closeMenu); });

    /* ---------- Scroll reveal ---------- */
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, {threshold:0.12, rootMargin:"0px 0px -8% 0px"});
    document.querySelectorAll(".reveal").forEach(function(el){ io.observe(el); });

    /* ---------- FAQ accordion ---------- */
    document.querySelectorAll(".qa-q").forEach(function(q){
      q.addEventListener("click", function(){
        var item = q.closest(".qa");
        var open = item.classList.contains("open");
        document.querySelectorAll(".qa.open").forEach(function(o){ o.classList.remove("open"); });
        if(!open) item.classList.add("open");
      });
    });

    /* ---------- Before / After slider ---------- */
    var stage = document.getElementById("baStage");
    if(stage){
      var afterLayer = stage.querySelector(".ba-after");
      var handle = stage.querySelector(".ba-handle");
      var knob = stage.querySelector(".ba-knob");
      var dragging = false;
      function setPos(clientX){
        var r = stage.getBoundingClientRect();
        var pct = ((clientX - r.left) / r.width) * 100;
        pct = Math.max(2, Math.min(98, pct));
        afterLayer.style.clipPath = "inset(0 0 0 " + pct + "%)";
        handle.style.left = pct + "%";
        knob.style.left = pct + "%";
      }
      function start(e){ dragging = true; e.preventDefault(); }
      function move(e){
        if(!dragging) return;
        var x = e.touches ? e.touches[0].clientX : e.clientX;
        setPos(x);
      }
      function end(){ dragging = false; }
      knob.addEventListener("mousedown", start);
      knob.addEventListener("touchstart", start, {passive:false});
      window.addEventListener("mousemove", move);
      window.addEventListener("touchmove", move, {passive:false});
      window.addEventListener("mouseup", end);
      window.addEventListener("touchend", end);
      // click anywhere on stage moves handle
      stage.addEventListener("click", function(e){
        if(e.target === knob) return;
        setPos(e.clientX);
      });

      /* case switcher */
      var cases = [
        {b:"Antes — Clareamento", a:"Depois — Clareamento"},
        {b:"Antes — Implante", a:"Depois — Implante"},
        {b:"Antes — Ortodontia", a:"Depois — Ortodontia"}
      ];
      var bTag = stage.querySelector(".ba-tag.before span");
      var aTag = stage.querySelector(".ba-tag.after span");
      var bPh = stage.querySelector(".ba-before .ph span");
      var aPh = stage.querySelector(".ba-after .ph span");
      document.querySelectorAll(".ba-dot").forEach(function(dot, i){
        dot.addEventListener("click", function(){
          document.querySelectorAll(".ba-dot").forEach(function(d){ d.classList.remove("active"); });
          dot.classList.add("active");
          if(bPh) bPh.textContent = "Antes";
          if(aPh) aPh.textContent = "Depois";
          if(bTag) bTag.textContent = cases[i].b;
          if(aTag) aTag.textContent = cases[i].a;
          // little reset animation
          afterLayer.style.transition = "clip-path .6s cubic-bezier(.22,.61,.36,1)";
          setTimeout(function(){ afterLayer.style.transition=""; }, 600);
        });
      });
    }

    /* ---------- Appointment form -> WhatsApp ---------- */
    var form = document.getElementById("bookForm");
    if(form){
      var success = document.getElementById("formSuccess");
      var submitBtn = document.getElementById("submitBtn");

      function setErr(field, on){
        field.classList.toggle("err", on);
      }
      form.querySelectorAll("input,textarea").forEach(function(inp){
        inp.addEventListener("input", function(){ setErr(inp.closest(".field"), false); });
      });

      form.addEventListener("submit", function(e){
        e.preventDefault();
        var nome = form.nome.value.trim();
        var tel = form.telefone.value.trim();
        var msg = form.mensagem.value.trim();
        var ok = true;
        if(!nome){ setErr(form.nome.closest(".field"), true); ok=false; }
        if(!tel || tel.replace(/\D/g,"").length < 8){ setErr(form.telefone.closest(".field"), true); ok=false; }
        if(!msg){ setErr(form.mensagem.closest(".field"), true); ok=false; }
        if(!ok) return;

        // loading state
        submitBtn.disabled = true;
        var orig = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spin"></span> Enviando...';

        var text =
          "Olá, gostaria de agendar uma consulta.\n\n" +
          "Nome: " + nome + "\n\n" +
          "Telefone: " + tel + "\n\n" +
          "Como posso ser ajudado:\n" + msg + "\n\n" +
          "Tenho interesse em receber mais informações.";

        var url = WA_LINK + "?text=" + encodeURIComponent(text);

        setTimeout(function(){
          if(success) success.classList.add("show");
          window.open(url, "_blank");
          submitBtn.disabled = false;
          submitBtn.innerHTML = orig;
          form.reset();
        }, 1100);
      });

      var againBtn = document.getElementById("successAgain");
      if(againBtn) againBtn.addEventListener("click", function(){ success.classList.remove("show"); });
    }

    /* ---------- Phone mask (light) ---------- */
    var tel = document.getElementById("telefone");
    if(tel){
      tel.addEventListener("input", function(){
        var v = tel.value.replace(/\D/g,"").slice(0,11);
        if(v.length > 6) v = "(" + v.slice(0,2) + ") " + v.slice(2,7) + "-" + v.slice(7);
        else if(v.length > 2) v = "(" + v.slice(0,2) + ") " + v.slice(2);
        else if(v.length > 0) v = "(" + v;
        tel.value = v;
      });
    }

    /* ---------- Subtle parallax on hero floats ---------- */
    var floats = document.querySelectorAll(".hero-float, .hero-badge-mark");
    window.addEventListener("scroll", function(){
      var s = window.scrollY;
      if(s > 700) return;
      floats.forEach(function(f, i){
        f.style.transform = "translateY(" + (s * (0.04 + i*0.02)) + "px)";
      });
    }, {passive:true});

  });
})();
