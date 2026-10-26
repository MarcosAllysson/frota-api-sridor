const InMemoryRepository = require('./repositories/InMemoryRepository');
const AutomovelService = require('./services/AutomovelService');
const MotoristaService = require('./services/MotoristaService');
const UtilizacaoService = require('./services/UtilizacaoService');

/**
 * Monta repositórios e serviços (injeção de dependências manual).
 * Cada chamada cria um estado novo e isolado, o que facilita os testes.
 */
function createContainer() {
    const automovelRepository = new InMemoryRepository();
    const motoristaRepository = new InMemoryRepository();
    const utilizacaoRepository = new InMemoryRepository();

    return {
        automovelService: new AutomovelService({ automovelRepository, utilizacaoRepository }),
        motoristaService: new MotoristaService({ motoristaRepository, utilizacaoRepository }),
        utilizacaoService: new UtilizacaoService({
            utilizacaoRepository,
            automovelRepository,
            motoristaRepository,
        }),
    };
}

module.exports = createContainer;