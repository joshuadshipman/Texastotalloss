import { Dictionary } from './en';

export const es: Dictionary = {
    hero: {
        badge: "Ayuda Gratuita para Reclamos de Auto en Texas",
        title_main: "¡Pérdida Total!",
        title_sub: "¿¡Y ahora qué!?",
        quote_main: "¿Preocupado por lesiones o simplemente cómo llevar a los niños a la escuela?",
        quote_sub: "No se preocupe, Ángel está aquí para ayudarle con todas sus dudas de Pérdida Total y Lesiones.",
        help_text: "Estamos aquí para ayudarle con el estrés."
    },
    buttons: {
        ai_review: "Revisión de Caso con IA",
        call_now: "📞 Llamar Ahora",
        live_chat: "💬 Chat en Vivo",
        sms: "💬 Texto / SMS",
        schedule: "⏱ Agendar Consulta"
    },
    sections: {
        resources_title: "Recursos Críticos",
        checklist: {
            title: "¿Acaba de tener un accidente?",
            subtitle: "Plan de Acción Inmediata de 10 Pasos",
            card_title: "🚨 Lista de Verificación Post-Accidente"
        },
        mitigate: {
            title: "Deber de Mitigar",
            subtitle: "Lesiones Médicas y Obligaciones de Propiedad",
            main_title: "Su Deber: No Empeore las Cosas"
        },
        storage: {
            title: "DETENGA Tarifas de Corralón",
            subtitle: "Evite cargos diarios de $100+",
            main_title: "DETENGA LA SANGRÍA",
            trap_title: "La Trampa del Costo Diario"
        },
        adjuster: {
            title: "Trucos del Ajustador",
            subtitle: "NO son sus amigos",
            main_title: "Tácticas para Dengar Reclamos"
        },
        total_loss: {
            title: "Ley de Pérdida Total",
            subtitle: "Regla del 100% del Umbral",
            main_title: "ACV vs. Costo de Reparación"
        },
        market: {
            title: "Valor Justo de Mercado",
            subtitle: "Cotizaciones de Concesionarios vs. CCC",
            main_title: "No Acepte la Primera Oferta"
        },
        fault: {
            title: "Determinando la Culpa",
            subtitle: "Regla del 51% de Texas",
            main_title: "Negligencia Comparativa Explicada"
        },
        coverage: {
            title: "Límites de Póliza",
            subtitle: "Responsabilidad, PIP y MedPay",
            main_title: "Sepa lo que se le Debe"
        },
        um_law: {
            title: "Conductor Sin Seguro",
            subtitle: "Chocar y Huir / Sin Seguro",
            main_title: "Reclamos de Cobertura UM/UIM"
        },
        read_more: "Leer Detalles Completos",
        faq: {
            title: "Preguntas Frecuentes",
            subtitle: "Leyes de Pérdida Total en Texas",
            q1: "¿Qué es una Pérdida Total en Texas?",
            a1: "En Texas, un auto es pérdida total si los costos de reparación igualan o superan el 100% del valor real en efectivo (ACV) del vehículo.",
            q2: "¿Puedo quedarme con mi auto chocado?",
            a2: "Sí (Retención del Propietario). La aseguradora deducirá el valor de salvamento de su cheque de liquidación.",
            q3: "¿Qué es la Cláusula de Tasación?",
            a3: "Un derecho de póliza que le permite contratar a un tasador independiente para disputar una oferta baja."
        }
    },
    city_page: {
        hero_badge: "Asistencia Local para el Condado de {county}",
        title_suffix: "Ayuda con Pérdida Total y Lesiones",
        subtitle: "No deje que los ajustadores de seguros de {city} le paguen de menos. Obtenga su valoración gratuita y revisión legal hoy.",
        why_different: "Por qué los reclamos en {city} son diferentes",
        resources_title: "Mejores Recursos de Lesiones en {city}",
        resources_subtitle: "Es crítico buscar atención médica dentro de las 72 horas de un accidente. Estos proveedores confiables tienen 5+ ubicaciones en el área de {city}.",
        calculator_title: "Verifique el Valor de su Vehículo en {city}",
        calculator_text: "Use nuestra calculadora para ver si la oferta del seguro coincide con los precios locales de {city}.",
    },
    footer: {
        rights: "Todos los derechos reservados. No es asesoramiento legal.",
        disclaimer_title: "DIVULGACIÓN DE PUBLICIDAD",
        disclaimer_text: "TexasTotalLoss.com es un sitio web de generación de leads y no un bufete de abogados..."
    },
    chat: {
        trigger: "Chat de Ayuda",
        close: "Cerrar",
        header_title: "Angel - Especialista",
        header_subtitle: "Analizando Leyes de Texas",
        input_placeholder: "Escribe un mensaje...",
        upload_tooltip: "Subir Foto",
        keywords: {
            live_agent: ["agente", "humano", "persona", "representante", "hablar", "vivo"],
            yes: ["si", "sí", "claro", "ok", "correcto", "exacto"],
            no: ["no", "nop", "negativo", "incorrecto"],
            pain: ["dolor", "herida", "lastimado", "roto", "fractura", "sangre", "duele"],
        },
        responses: {
            greeting_sms: "Ningún problema. Vamos a configurarlo para enviarte mensajes de texto. Para empezar, por favor dame tu número de celular.",
            greeting_live: "Te estoy conectando con un especialista en vivo ahora. Por favor espera...",
            greeting_standard: "Hola, soy Angel. Entiendo que este es un momento estresante y estoy aquí para ayudarte. Para empezar, ¿me podrías dar tu nombre?",

            ask_phone: "Gracias, {name}. En caso de que nos desconectemos, ¿cuál es tu número de celular?",
            ask_contact_method: "Gracias. ¿Prefieres que te contactemos por Texto o Llamada?",
            ask_call_time: "¿Cuál es la mejor hora para llamarte?",
            ask_incident: "Perfecto. Ahora, ¿podrías contarme brevemente qué pasó? ¿Fue pérdida total, hubo heridos, o ambos?",
            ask_fault: "Entiendo. Lo siento mucho. ¿La policía confirmó quién tuvo la culpa?",
            ask_photos: "¿Tienes fotos de los daños o un reporte policial? (Puedes subirlas usando el icono de cámara, o decir 'No')",
            ask_recent: "Una última pregunta importante: ¿El accidente fue en las últimas 48 horas?",

            advice_er: "Por favor escucha: Como han pasado menos de 48 horas, te recomiendo encarecidamente ir a Urgencias de inmediato. La adrenalina puede ocultar lesiones.",
            advice_doc_urgent: "Como ha pasado más de una semana, es crítico que veas a un médico inmediatamente. Las lagunas en el tratamiento son la razón #1 por la que se niegan los reclamos.",
            advice_chiro: "Como han pasado unos días, recomiendo ver a un Quiropráctico o Especialista en Rehabilitación lo antes posible.",

            confirmation: "Hemos recibido tus detalles. Un especialista se pondrá en contacto pronto.",
            upload_success: "✅ ¡Foto subida!",
            upload_fail: "Error al subir foto.",

            busy_agents: "Todos nuestros agentes están ocupados. Te enviaremos un texto pronto. ¿Cuál es la mejor hora para escribirte?",
            live_connect: "Conectando con agente..."
        }
    },
    caseReview: {
        title: "Evaluador de Caso con IA",
        subtitle: "Analizando Regulaciones de Texas",
        steps: {
            contact: {
                title: "1. Tu Información de Contacto",
                name: "Nombre Completo",
                phone: "Teléfono Móvil",
                email: "Correo Electrónico",
                method: "Prefiero Texto/Llamada",
                time: "Mejor Hora de Contacto",
                lang: "Idioma",
                permission: "Doy permiso para recibir mensajes de texto sobre mi revisión de caso."
            },
            accident: {
                title: "2. Detalles del Accidente",
                date: "Fecha del Accidente",
                location: "Ubicación (Ciudad, TX)",
                type: "Tipo de Incidente",
                role: "Mi Rol",
                vehicle: "Tu Vehículo",
                police: "¿Reporte Policial?",
                tickets: "¿Multas Emitidas?"
            },
            fault: {
                title: "3. Verificación de Responsabilidad",
                who_fault: "¿Quién tuvo la culpa?",
                admit: "¿Admitieron la culpa?",
                insured: "¿Otro Conductor Asegurado?",
                my_insurance: "Tu Compañía de Seguros",
                recorded: "¿Diste una declaración grabada?"
            },
            injury: {
                title: "4. Evaluación de Lesiones",
                were_injured: "¿Te lastimaste?",
                pain_level: "Nivel de Dolor (0-10)",
                parts: "¿Dónde te duele?",
                treatment: "Tratamiento hasta ahora",
                need_doc: "¿Necesitas ayuda para encontrar Dr?"
            },
            legal: {
                title: "5. Estado Legal",
                hired: "¿Ya contrataste abogado?",
                change: "¿Buscas cambiar de abogado?",
                prior: "¿Reclamos anteriores en 5 años?"
            },
            impact: {
                title: "6. Impacto y Trabajo",
                working: "¿Estabas trabajando?",
                missed: "¿Perdiste días de trabajo?",
                concerns: "Mayores Preocupaciones"
            },
            docs: {
                title: "7. Subida Rápida de Documentos",
                desc: "Si tienes alguno de estos, súbelos ahora:",
                cta: "Toca para Subir Foto/Documento",
                list: ["Tarjeta de Seguro", "Reporte Policial", "Fotos de la Escena"]
            },
            result: {
                high_chance: "ALTA PROBABILIDAD DE ACEPTACIÓN",
                review_needed: "Revisión Recomendada",
                match: "Coincidencia",
                call_btn: "Llamar Abogado Ahora",
                close_btn: "Cerrar"
            }
        },
        options: {
            yes: "Sí",
            no: "No",
            unsure: "No estoy seguro",
            text: "Texto",
            call: "Llamada",
            email: "Email"
        }
    }
};
