'use strict';
/**
 * extractText() del bot readonly de Service Store VIP: msg.body viene vacío
 * en imágenes/notas de voz/stickers/etc., y chatHistory.recordMessage()
 * descarta silenciosamente cualquier texto vacío — sin fallback, esos
 * mensajes desaparecían del todo del historial que ve Lion Platform, aunque
 * lion-leads-readonly.js sí seguía marcando la actividad (por eso el CRM
 * mostraba el contacto pero el chat salía vacío).
 * Uso: node test_lion_readonly_message_text.js
 */
const { extractText } = require('./lion-readonly-message-text');

let failures = 0;
function check(cond, msg) {
    if (cond) console.log('✅', msg);
    else { failures++; console.log('❌', msg); }
}

check(extractText({ body: 'Hola, cuánto cuesta?' }) === 'Hola, cuánto cuesta?', 'un mensaje de texto normal se devuelve tal cual');
check(extractText({ body: '', type: 'image' }) === '📷 Imagen', 'una imagen sin body cae al label de imagen');
check(extractText({ body: '', type: 'ptt' }) === '🎤 Nota de voz', 'una nota de voz (ptt) cae al label correcto');
check(extractText({ body: '', type: 'audio' }) === '🎵 Audio', 'un audio cae al label correcto');
check(extractText({ body: '', type: 'video' }) === '🎥 Video', 'un video cae al label correcto');
check(extractText({ body: '', type: 'sticker' }) === '😀 Sticker', 'un sticker cae al label correcto');
check(extractText({ body: '', type: 'document' }) === '📄 Documento', 'un documento cae al label correcto');
check(extractText({ body: '', type: 'location' }) === '📍 Ubicación', 'una ubicación cae al label correcto');
check(extractText({ body: '', type: 'vcard' }) === '👤 Contacto compartido', 'un contacto compartido cae al label correcto');
check(extractText({ body: '', type: 'unknown_future_type' }) === '[mensaje sin texto: unknown_future_type]', 'un tipo desconocido cae a un marcador legible, no se pierde silenciosamente');
check(extractText({ body: '' }) === '[mensaje sin texto: desconocido]', 'sin body y sin type tampoco se pierde silenciosamente');
check(extractText({ body: null, type: 'image' }) === '📷 Imagen', 'body null (no solo string vacío) también cae al fallback');

// El caso real que rompía el historial: nunca debe devolver '' ni algo falsy,
// porque chatHistory.recordMessage(phone, fromMe, text) descarta el mensaje
// completo si text es falsy.
for (const type of ['image', 'ptt', 'audio', 'video', 'sticker', 'document', 'location', 'vcard', undefined, 'raro']) {
    const result = extractText({ body: '', type });
    check(!!result, `extractText nunca devuelve un valor falsy (type=${type} -> "${result}")`);
}

console.log(failures === 0 ? '\nTodos los tests pasaron.' : `\n${failures} FALLOS`);
process.exitCode = failures === 0 ? 0 : 1;
