const AppError = require('../errors/AppError');
const { requireString, parseDate } = require('../utils/validators');

class UtilizacaoService {
    constructor({ utilizacaoRepository, automovelRepository, motoristaRepository }) {
        this.utilizacaoRepository = utilizacaoRepository;
        this.automovelRepository = automovelRepository;
        this.motoristaRepository = motoristaRepository;
    }

    /**
     * Registra o início da utilização de um automóvel por um motorista.
     * Regras: o automóvel não pode estar em uso e o motorista não pode estar usando outro automóvel.
     */
    iniciar(dados) {
        const { motoristaId, automovelId } = dados ?? {};
        const motivo = requireString(dados?.motivo, 'motivo');
        const dataInicio = dados?.dataInicio ? parseDate(dados.dataInicio, 'dataInicio') : new Date();

        const motorista = this.motoristaRepository.findById(motoristaId);
        if (!motorista) throw new AppError('Motorista não encontrado.', 404);

        const automovel = this.automovelRepository.findById(automovelId);
        if (!automovel) throw new AppError('Automóvel não encontrado.', 404);

        if (this._emAndamento((u) => u.automovelId === automovel.id)) {
            throw new AppError('Este automóvel já está sendo utilizado por um motorista.', 409);
        }
        if (this._emAndamento((u) => u.motoristaId === motorista.id)) {
            throw new AppError('Este motorista já está utilizando um automóvel.', 409);
        }

        return this.utilizacaoRepository.create({
            motoristaId: motorista.id,
            automovelId: automovel.id,
            motivo,
            dataInicio: dataInicio.toISOString(),
            dataFim: null,
        });
    }

    /** Finaliza uma utilização em andamento, guardando a data de término (padrão: agora). */
    finalizar(id, dados) {
        const utilizacao = this.utilizacaoRepository.findById(id);
        if (!utilizacao) throw new AppError('Registro de utilização não encontrado.', 404);
        if (utilizacao.dataFim) throw new AppError('Esta utilização já foi finalizada.', 409);

        const dataFim = dados?.dataFim ? parseDate(dados.dataFim, 'dataFim') : new Date();
        if (dataFim < new Date(utilizacao.dataInicio)) {
            throw new AppError('A data de término não pode ser anterior à data de início.', 400);
        }

        return this.utilizacaoRepository.update(id, { dataFim: dataFim.toISOString() });
    }

    /** Lista as utilizações já com os dados do motorista e do automóvel. */
    listar() {
        return this.utilizacaoRepository.findAll().map((u) => {
            const { motoristaId, automovelId, ...registro } = u;
            return {
                ...registro,
                motorista: this.motoristaRepository.findById(motoristaId),
                automovel: this.automovelRepository.findById(automovelId),
            };
        });
    }

    _emAndamento(predicate) {
        return this.utilizacaoRepository.findAll((u) => !u.dataFim && predicate(u)).length > 0;
    }
}

module.exports = UtilizacaoService;