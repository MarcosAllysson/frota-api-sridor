const AppError = require('../src/errors/AppError');

/** Executa fn e verifica que ela lança um AppError com o status esperado. */
function expectErro(fn, statusCode) {
    try {
        fn();
    } catch (err) {
        expect(err).toBeInstanceOf(AppError);
        expect(err.statusCode).toBe(statusCode);
        return;
    }
    throw new Error('Era esperado que um erro fosse lançado.');
}

module.exports = { expectErro };