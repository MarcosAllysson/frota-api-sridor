const AppError = require('../errors/AppError');
const { requireString } = require('../utils/validators');

const normalizar = (texto) => String(texto).trim().toLowerCase();

class AutomovelService {
    constructor({ automovelRepository, utilizacaoRepository }) {
        this.automovelRepository = automovelRepository;
        this.utilizacaoRepository = utilizacaoRepository;
    }

    criar(dados) {
        const automovel = this._validar(dados);
        this._garantirPlacaDisponivel(automovel.placa);
        return this.automovelRepository.create(automovel);
    }

    buscarPorId(id) {
        const automovel = this.automovelRepository.findById(id);
        if (!automovel) throw new AppError('Automóvel não encontrado.', 404);
        return automovel;
    }

    /** Lista automóveis, com filtros opcionais (igualdade, sem diferenciar maiúsculas) por cor e marca. */
    listar({ cor, marca } = {}) {
        return this.automovelRepository.findAll(
            (a) =>
                (!cor || normalizar(a.cor) === normalizar(cor)) &&
                (!marca || normalizar(a.marca) === normalizar(marca))
        );
    }

    atualizar(id, dados) {
        this.buscarPorId(id);
        const automovel = this._validar(dados);
        this._garantirPlacaDisponivel(automovel.placa, id);
        return this.automovelRepository.update(id, automovel);
    }

    excluir(id) {
        this.buscarPorId(id);
        const emUso = this.utilizacaoRepository.findAll((u) => u.automovelId === id && !u.dataFim);
        if (emUso.length > 0) {
            throw new AppError('Não é possível excluir um automóvel que está em utilização.', 409);
        }
        this.automovelRepository.delete(id);
    }

    _validar(dados = {}) {
        return {
            placa: requireString(dados.placa, 'placa').toUpperCase(),
            cor: requireString(dados.cor, 'cor'),
            marca: requireString(dados.marca, 'marca'),
        };
    }

    _garantirPlacaDisponivel(placa, ignorarId) {
        const duplicado = this.automovelRepository.findAll((a) => a.placa === placa && a.id !== ignorarId);
        if (duplicado.length > 0) throw new AppError('Já existe um automóvel com esta placa.', 409);
    }
}

module.exports = AutomovelService;