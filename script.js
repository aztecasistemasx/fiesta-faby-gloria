document.addEventListener("DOMContentLoaded", () => {
    
    /* ==========================================================================
       1. Configuración de Fecha y Evento
       ========================================================================== */
    // Fecha y hora sincronizada con index.html: Domingo 18 de Octubre 2026, 3:00 PM
    const FECHA_EVENTO = new Date(2026, 9, 18, 15, 0, 0); 
    const TITULO_EVENTO = "Cumpleaños Faby & Gloria";
    const LUGAR_EVENTO = "Terraza para Eventos, Rep. de Chile #294, La Capacha, Tlaquepaque";
    const DETALLES_EVENTO = "¡Acompáñanos a festejar este día tan especial!";

    /* ==========================================================================
       2. Lógica del Audio y Pantalla de Inicio
       ========================================================================== */
    const btnAbrir = document.getElementById("btn-abrir");
    const pantallaIngreso = document.getElementById("pantalla-ingreso");
    const contenidoInvitacion = document.getElementById("contenido-invitacion");
    const musica = document.getElementById("musica-fondo");
    const btnMusica = document.getElementById("btn-musica");
    const iconoMusica = document.getElementById("icono-musica");

    if (btnAbrir) {
        btnAbrir.addEventListener("click", () => {
            // Intentar reproducir música
            if (musica) {
                musica.play().then(() => {
                    if (btnMusica) {
                        btnMusica.classList.remove("oculto");
                        btnMusica.classList.add("reproduciendo");
                    }
                }).catch(error => {
                    console.log("Autoplay bloqueado o archivo no encontrado:", error);
                    if (btnMusica) btnMusica.classList.remove("oculto");
                });
            }

            // Lanzar confeti festivo
            dispararConfeti();

            // Desvanecimiento suave de la pantalla de bienvenida
            if (pantallaIngreso) {
                pantallaIngreso.classList.add("desvanecer");
                setTimeout(() => {
                    pantallaIngreso.style.display = "none";
                }, 800);
            }

            // Mostrar contenido principal con animación
            if (contenidoInvitacion) {
                contenidoInvitacion.classList.remove("oculto");
            }
        });
    }

    // Control flotante de Música (Play / Pausa)
    if (btnMusica && musica) {
        btnMusica.addEventListener("click", () => {
            if (musica.paused) {
                musica.play();
                btnMusica.classList.add("reproduciendo");
                if (iconoMusica) iconoMusica.textContent = "🎵";
            } else {
                musica.pause();
                btnMusica.classList.remove("reproduciendo");
                if (iconoMusica) iconoMusica.textContent = "🔇";
            }
        });
    }

    /* ==========================================================================
       3. Lógica de Pases y Aforo Personalizado (URL: ?pases=2)
       ========================================================================== */
    const parametros = new URLSearchParams(window.location.search);
    const pasesMaximos = parseInt(parametros.get("pases")) || 1; // 1 por defecto

    const selectPersonas = document.getElementById("personas");
    const mensajeAforo = document.getElementById("mensaje-aforo");
    
    if (mensajeAforo) {
        if (pasesMaximos === 1) {
            mensajeAforo.innerText = "Tienes 1 pase asignado.";
        } else {
            mensajeAforo.innerText = `Tienes un cupo máximo de ${pasesMaximos} pases asignados.`;
        }
    }

    if (selectPersonas) {
        selectPersonas.innerHTML = "";
        for (let i = 1; i <= pasesMaximos; i++) {
            const option = document.createElement("option");
            option.value = i;
            option.text = i === 1 ? "1 Persona" : `${i} Personas`;
            selectPersonas.appendChild(option);
        }
    }

    /* ==========================================================================
       4. Cuenta Regresiva Dinámica
       ========================================================================== */
    const spanDias = document.getElementById("dias");
    const spanHoras = document.getElementById("horas");
    const spanMinutos = document.getElementById("minutos");
    const spanSegundos = document.getElementById("segundos");

    function actualizarContador() {
        const ahora = new Date().getTime();
        const distancia = FECHA_EVENTO.getTime() - ahora;

        if (distancia < 0) {
            if (spanDias) spanDias.innerText = "00";
            if (spanHoras) spanHoras.innerText = "00";
            if (spanMinutos) spanMinutos.innerText = "00";
            if (spanSegundos) spanSegundos.innerText = "00";
            return;
        }

        const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
        const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

        if (spanDias) spanDias.innerText = dias < 10 ? `0${dias}` : dias;
        if (spanHoras) spanHoras.innerText = horas < 10 ? `0${horas}` : horas;
        if (spanMinutos) spanMinutos.innerText = minutos < 10 ? `0${minutos}` : minutos;
        if (spanSegundos) spanSegundos.innerText = segundos < 10 ? `0${segundos}` : segundos;
    }

    actualizarContador();
    setInterval(actualizarContador, 1000);

    /* ==========================================================================
       5. Botón Agregar a Google Calendar
       ========================================================================== */
    const btnCalendario = document.getElementById("btn-calendario");
    if (btnCalendario) {
        // Formato ISO para Google Calendar (YYYYMMDDTHHMMSSZ)
        const fechaInicio = new Date(FECHA_EVENTO.getTime());
        const fechaFin = new Date(FECHA_EVENTO.getTime() + (5 * 60 * 60 * 1000)); // +5 horas

        const formatoGoogle = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
        const urlCalendar = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(TITULO_EVENTO)}&dates=${formatoGoogle(fechaInicio)}/${formatoGoogle(fechaFin)}&details=${encodeURIComponent(DETALLES_EVENTO)}&location=${encodeURIComponent(LUGAR_EVENTO)}`;
        
        btnCalendario.href = urlCalendar;
    }



    /* ==========================================================================
       7. Efecto de Confeti (Canvas Confetti)
       ========================================================================== */
    function dispararConfeti() {
        if (typeof confetti !== "function") return;

        // Disparo dorado y festivo
        const count = 200;
        const defaults = {
            origin: { y: 0.7 },
            colors: ['#e2ba73', '#ffffff', '#b8863b', '#ffd993', '#7b52c9']
        };

        function fire(particleRatio, opts) {
            confetti(Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio)
            }));
        }

        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });
    }
});