/* ==========================================================================
   Invitación Digital - Faby & Gloria
   Script de interactividad, audio, calendarios, cuenta regresiva y RSVP
   ========================================================================== */

/* ==========================================================================
   1. Apertura Inmediata y Segura (Disponible en Scope Global)
   ========================================================================== */
function abrirInvitacion() {
    const pantallaIngreso = document.getElementById("pantalla-ingreso");
    const contenidoInvitacion = document.getElementById("contenido-invitacion");
    const musica = document.getElementById("musica-fondo");
    const btnMusica = document.getElementById("btn-musica");

    // 1. Mostrar contenido principal y desvanecer pantalla de bienvenida
    if (contenidoInvitacion) {
        contenidoInvitacion.classList.remove("oculto");
    }

    if (pantallaIngreso) {
        pantallaIngreso.classList.add("desvanecer");
        setTimeout(() => {
            pantallaIngreso.style.display = "none";
        }, 800);
    }

    // 2. Reproducción de audio protegida (no bloqueante)
    if (musica) {
        try {
            const promesaAudio = musica.play();
            if (promesaAudio !== undefined) {
                promesaAudio.then(() => {
                    if (btnMusica) {
                        btnMusica.classList.remove("oculto");
                        btnMusica.classList.add("reproduciendo");
                    }
                }).catch((err) => {
                    console.warn("Autoplay pausado por políticas del navegador (se activa con botón):", err);
                    if (btnMusica) btnMusica.classList.remove("oculto");
                });
            }
        } catch (err) {
            console.warn("Error al intentar reproducir música:", err);
            if (btnMusica) btnMusica.classList.remove("oculto");
        }
    }

    // 3. Efecto de confeti festivo
    try {
        if (typeof dispararConfeti === "function") {
            dispararConfeti();
        }
    } catch (err) {
        console.warn("Confeti no disponible:", err);
    }
}

// Asignar inmediatamente al objeto global para que onclick siempre funcione
window.abrirInvitacion = abrirInvitacion;

/* ==========================================================================
   2. Inicialización de Componentes (Protegida contra estados de carga)
   ========================================================================== */
function inicializarInvitacion() {
    // Configuración del evento
    // Domingo 18 de Octubre 2026, 4:00 PM (16:00 hrs)
    const FECHA_EVENTO = new Date(2026, 9, 18, 16, 0, 0);
    const TITULO_EVENTO = "Cumpleaños Faby & Gloria";
    const LUGAR_EVENTO = "Terraza para Eventos, Rep. de Chile #294, La Capacha, Tlaquepaque";
    const DETALLES_EVENTO = "¡Acompáñanos a festejar este día tan especial!";

    const musica = document.getElementById("musica-fondo");
    const btnMusica = document.getElementById("btn-musica");
    const iconoMusica = document.getElementById("icono-musica");
    const btnAbrir = document.getElementById("btn-abrir");

    // Enlazar evento click del botón de apertura además de onclick en HTML
    if (btnAbrir) {
        btnAbrir.addEventListener("click", abrirInvitacion);
    }

    // Control flotante de Música (Play / Pausa)
    if (btnMusica && musica) {
        btnMusica.addEventListener("click", () => {
            if (musica.paused) {
                musica.play().then(() => {
                    btnMusica.classList.add("reproduciendo");
                    if (iconoMusica) iconoMusica.textContent = "🎵";
                }).catch(e => console.warn("No se pudo reanudar el audio:", e));
            } else {
                musica.pause();
                btnMusica.classList.remove("reproduciendo");
                if (iconoMusica) iconoMusica.textContent = "🔇";
            }
        });
    }

    /* ==========================================================================
       3. Pases y Aforo Dinámico (URL: ?pases=2)
       ========================================================================== */
    const parametros = new URLSearchParams(window.location.search);
    const pasesRaw = parseInt(parametros.get("pases"), 10);
    const pasesMaximos = (!isNaN(pasesRaw) && pasesRaw > 0) ? Math.min(pasesRaw, 20) : 1;

    const selectPersonas = document.getElementById("personas");
    const mensajeAforo = document.getElementById("mensaje-aforo");
    const grupoPases = document.getElementById("grupo-pases");
    const selectAsistencia = document.getElementById("asistencia");

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

    // Mostrar / Ocultar selector de personas según si asistirá
    if (selectAsistencia && grupoPases) {
        selectAsistencia.addEventListener("change", () => {
            if (selectAsistencia.value === "no") {
                grupoPases.style.display = "none";
            } else {
                grupoPases.style.display = "block";
            }
        });
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

        if (distancia <= 0) {
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
       5. Botones Agregar a Calendario (Google & Apple/iOS)
       ========================================================================== */
    const fechaInicio = new Date(FECHA_EVENTO.getTime());
    const fechaFin = new Date(FECHA_EVENTO.getTime() + (6 * 60 * 60 * 1000)); // +6 horas (4:00 PM a 10:00 PM)

    // Formateador UTC estándar para calendarios
    const formatoCalendario = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");

    // A) Google Calendar
    const btnCalendario = document.getElementById("btn-calendario");
    if (btnCalendario) {
        const urlCalendar = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(TITULO_EVENTO)}&dates=${formatoCalendario(fechaInicio)}/${formatoCalendario(fechaFin)}&details=${encodeURIComponent(DETALLES_EVENTO)}&location=${encodeURIComponent(LUGAR_EVENTO)}&ctz=America/Mexico_City`;
        btnCalendario.href = urlCalendar;
    }

    // B) Apple / iCloud / iOS Calendar (.ics)
    const btnAppleCalendario = document.getElementById("btn-apple-calendario");
    if (btnAppleCalendario) {
        btnAppleCalendario.addEventListener("click", (e) => {
            e.preventDefault();

            const icsLines = [
                "BEGIN:VCALENDAR",
                "VERSION:2.0",
                "PRODID:-//Fiesta Cumpleanos//Faby y Gloria//ES",
                "CALSCALE:GREGORIAN",
                "METHOD:PUBLISH",
                "BEGIN:VEVENT",
                `DTSTAMP:${formatoCalendario(new Date())}`,
                `DTSTART:${formatoCalendario(fechaInicio)}`,
                `DTEND:${formatoCalendario(fechaFin)}`,
                `SUMMARY:${TITULO_EVENTO}`,
                `DESCRIPTION:${DETALLES_EVENTO}`,
                `LOCATION:${LUGAR_EVENTO}`,
                "STATUS:CONFIRMED",
                "END:VEVENT",
                "END:VCALENDAR"
            ];
            const icsContent = icsLines.join("\r\n");

            // Detección de dispositivos iOS para descarga directa
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            if (isIOS) {
                window.location.href = "data:text/calendar;charset=utf8," + encodeURIComponent(icsContent);
            } else {
                const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
                const link = document.createElement("a");
                const url = window.URL.createObjectURL(blob);
                link.href = url;
                link.setAttribute("download", "Fiesta_Faby_y_Gloria.ics");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                setTimeout(() => window.URL.revokeObjectURL(url), 1500);
            }
        });
    }

    /* ==========================================================================
       6. Envío de Formulario por AJAX con Redirección a WhatsApp
       ========================================================================== */
    const formulario = document.querySelector(".formulario-rsvp");
    if (formulario) {
        formulario.addEventListener("submit", function (e) {
            e.preventDefault();

            // 1. Extraer los datos ingresados
            const nombre = (document.getElementById("nombre")?.value || "").trim();
            const asistencia = document.getElementById("asistencia")?.value || "si";
            const personas = document.getElementById("personas")?.value || "1";
            const anfitrion = document.getElementById("anfitrion")?.value || "faby";
            const comentarios = (document.getElementById("comentarios")?.value || "").trim();

            const formData = new FormData(formulario);
            const botonSubmit = formulario.querySelector("button[type='submit']");
            const textoOriginal = botonSubmit ? botonSubmit.innerText : "Confirmar Asistencia";

            if (botonSubmit) {
                botonSubmit.innerText = "Enviando...";
                botonSubmit.disabled = true;
            }

            // 2. Determinar el teléfono destinatario
            let telefono = "523326010534"; // Faby por defecto
            if (anfitrion === "gloria") {
                telefono = "523317546449"; // Gloria
            }

            // 3. Construir mensaje de WhatsApp
            let texto = `¡Hola! Soy ${nombre}.\n`;
            if (asistencia === "si") {
                texto += `🎉 Confirmo mi asistencia a la fiesta para ${personas} persona(s).`;
            } else {
                texto += `😔 Lamentablemente no podré acompañarlas esta vez.`;
            }
            if (comentarios !== "") {
                texto += `\n🎵 Sugerencia/Comentario: ${comentarios}`;
            }

            const urlWhatsApp = `https://wa.me/${telefono}?text=${encodeURIComponent(texto)}`;

            // Función común para mostrar éxito y redirigir
            function procesarExito() {
                formulario.innerHTML = `
                    <div class="text-center" style="padding: 20px 0; animation: aparecerContenido 0.8s ease;">
                        <div class="icono-seccion">🎉</div>
                        <h3 style="color: var(--primary-gold-bright); margin-bottom: 12px; font-family: 'Playfair Display', serif; font-size: 1.8rem;">¡Gracias por confirmar!</h3>
                        <p style="color: #ffffff; font-size: 1.05rem; margin-bottom: 16px;">Abriendo WhatsApp para enviar tu respuesta...</p>
                        <a href="${urlWhatsApp}" target="_blank" rel="noopener" class="btn-principal" style="font-size: 0.95rem; padding: 12px 24px; text-decoration: none;">
                            👉 Si no abre automáticamente, toca aquí
                        </a>
                    </div>
                `;

                try {
                    dispararConfeti();
                } catch (e) {
                    console.warn(e);
                }

                setTimeout(() => {
                    window.location.href = urlWhatsApp;
                }, 1800);
            }

            // Si se prueba en local (file://), no llamar a fetch para evitar error de red
            if (window.location.protocol === "file:") {
                procesarExito();
                return;
            }

            // Enviar a Netlify Forms en segundo plano
            fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData).toString()
            })
                .then(() => {
                    procesarExito();
                })
                .catch((error) => {
                    console.warn("Aviso en envío de Netlify, procediendo con WhatsApp:", error);
                    // Aún si Netlify no responde (ej. sin conexión de hosting), no bloquear al usuario y abrir WhatsApp
                    procesarExito();
                });
        });
    }
}

/* ==========================================================================
   7. Efecto de Confeti (Canvas Confetti)
   ========================================================================== */
function dispararConfeti() {
    if (typeof confetti !== "function") return;

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
window.dispararConfeti = dispararConfeti;

/* ==========================================================================
   8. Ejecución segura (DOMContentLoaded o estado listo)
   ========================================================================== */
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializarInvitacion);
} else {
    inicializarInvitacion();
}