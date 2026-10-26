const AppError = require('../errors/AppError');

/** Garante que o valor é um texto não vazio e devolve o texto sem espaços nas pontas. */
function requireString(value, field) {
    if (typeof value !== 'string' || !value.trim()) {
        throw new AppError(`O campo "${field}" é obrigatório e deve ser um texto.`, 400);
    }
    return value.trim();
}

/** Converte uma string ISO 8601 em Date, lançando erro 400 se for inválida. */
function parseDate(value, field) {
    const date = new Date(value);
    if (typeof value !== 'string' || Number.isNaN(date.getTime())) {
        throw new AppError(`O campo "${field}" deve ser uma data ISO 8601 válida.`, 400);
    }
    return date;
}

module.exports = { requireString, parseDate };