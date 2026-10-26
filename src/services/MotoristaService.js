const AppError = require('../errors/AppError');
const { requireString } = require('../utils/validators');

const normalizar = (texto) => String(texto).trim().toLowerCase();

class MotoristaService {
    constructor({ motoristaRepository, utilizacaoRepository }) {
        this.motoristaRepository = motoristaRepository;
        this.utilizacaoRepository = utilizacaoRepository;
    }

    criar(dados) {
        return this.motoristaRepository.create(this._validar(dados));
    }

    buscarPorId(id) {
        const motorista = this.motoristaRepository.findById(id);
        if (!motorista) throw new AppError('Motorista não encontrado.', 404);
        return motorista;
    }

    /** Lista motoristas, com filtro opcional por nome (contém, sem diferenciar maiúsculas). */
    listar({ nome } = {}) {
        return this.motoristaRepository.findAll(
            (m) => !nome || normalizar(m.nome).includes(normalizar(nome))
        );
    }

    atualizar(id, dados) {
        this.buscarPorId(id);
        return this.motoristaRepository.update(id, this._validar(dados));
    }

    excluir(id) {
        this.buscarPorId(id);
        const emUso = this.utilizacaoRepository.findAll((u) => u.motoristaId === id && !u.dataFim);
        if (emUso.length > 0) {
            throw new AppError('Não é possível excluir um motorista que está utilizando um automóvel.', 409);
        }
        this.motoristaRepository.delete(id);
    }

    _validar(dados = {}) {
        return { nome: requireString(dados.nome, 'nome') };
    }
}

module.exports = MotoristaService;