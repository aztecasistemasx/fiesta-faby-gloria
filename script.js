Necesito modificar la invitación para que, al confirmar, envíe un mensaje automático de WhatsApp a Faby o a Gloria dependiendo de quién sea el invitado, manteniendo el guardado AJAX en Netlify.

Realiza exactamente estos dos cambios:

En el archivo index.html, dentro del formulario <form name="rsvp-terraza">, agrega este nuevo campo justo antes de la sección de comentarios:

HTML
                <div class="form-group">
                    <label for="anfitrion">¿Quién te invitó?</label>
                    <select id="anfitrion" name="anfitrion" required>
                        <option value="">Selecciona una opción</option>
                        <option value="faby">Faby</option>
                        <option value="gloria">Gloria</option>
                    </select>
                </div>
En el archivo script.js, dentro del bloque número 8 ("Envío de Formulario por AJAX"), modifica el código que se ejecuta en caso de éxito. Reemplaza el bloque .then(() => { ... }) actual por el siguiente código:

JavaScript
            .then(() => {
                // 1. Obtener los datos seleccionados
                const nombre = document.getElementById("nombre").value;
                const asistencia = document.getElementById("asistencia").value;
                const personas = document.getElementById("personas").value;
                const anfitrion = document.getElementById("anfitrion").value;
                const comentarios = document.getElementById("comentarios").value;
                
                // 2. Determinar el teléfono (Deben cambiarse por los reales)
                let telefono = "";
                if (anfitrion === "faby") {
                    telefono = "523300000000"; // Número de Faby
                } else if (anfitrion === "gloria") {
                    telefono = "523300000000"; // Número de Gloria
                }

                // 3. Construir el mensaje de texto
                let texto = `¡Hola! Soy ${nombre}.\n`;
                if (asistencia === "si") {
                    texto += `🎉 Confirmo mi asistencia a la fiesta para ${personas} persona(s).`;
                } else {
                    texto += `😔 Lamentablemente no podré acompañarlas esta vez.`;
                }
                if (comentarios.trim() !== "") {
                    texto += `\n🎵 Sugerencia/Comentario: ${comentarios}`;
                }
                
                // 4. Mostrar mensaje visual y confeti
                formulario.innerHTML = `
                    <div class="text-center" style="padding: 20px 0; animation: aparecerContenido 1s ease;">
                        <div class="icono-seccion">🎉</div>
                        <h3 style="color: var(--primary-gold-bright); margin-bottom: 12px; font-family: 'Playfair Display', serif; font-size: 1.8rem;">¡Gracias por confirmar!</h3>
                        <p style="color: #ffffff; font-size: 1.05rem;">Abriendo WhatsApp para enviar tu respuesta...</p>
                    </div>
                `;
                dispararConfeti();

                // 5. Redirigir a WhatsApp después de 2 segundos para permitir ver la animación
                setTimeout(() => {
                    const urlWhatsApp = `https://api.whatsapp.com/send?phone=${telefono}&text=${encodeURIComponent(texto)}`;
                    window.location.href = urlWhatsApp;
                }, 2000);
            })
