'use strict';

// Mismos msg.type que ya reconoce handlers/modules/message.handler.js para
// el bot real. msg.body viene vacío en imágenes, notas de voz, stickers,
// etc. — sin este fallback, esos mensajes se perdían del todo del historial
// (chatHistory.recordMessage descartaba cualquier texto vacío).
const MEDIA_TYPE_LABELS = {
    image: '📷 Imagen',
    video: '🎥 Video',
    ptt: '🎤 Nota de voz',
    audio: '🎵 Audio',
    sticker: '😀 Sticker',
    document: '📄 Documento',
    location: '📍 Ubicación',
    vcard: '👤 Contacto compartido',
};

function extractText(msg) {
    if (msg.body) return msg.body;
    return MEDIA_TYPE_LABELS[msg.type] || `[mensaje sin texto: ${msg.type || 'desconocido'}]`;
}

module.exports = { extractText, MEDIA_TYPE_LABELS };
