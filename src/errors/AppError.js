/**
 * Erro de negócio/validação com código HTTP associado.
 * É convertido em resposta JSON pelo middleware de erros.
 */
class AppError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.name = 'AppError';
        this.statusCode = statusCode;
    }
}

module.exports = AppError;