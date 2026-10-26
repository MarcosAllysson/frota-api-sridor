const createContainer = require('../src/container');
const { expectErro } = require('./helpers');

describe('AutomovelService', () => {
    let service;

    beforeEach(() => {
        service = createContainer().automovelService;
    });

    const novo = (extra = {}) => ({ placa: 'abc1d23', cor: 'Preto', marca: 'Fiat', ...extra });

    test('cadastra automóvel com placa em maiúsculas', () => {
        const criado = service.criar(novo());
        expect(criado.id).toBeDefined();
        expect(criado.placa).toBe('ABC1D23');
    });

    test('rejeita cadastro com campo obrigatório ausente', () => {
        expectErro(() => service.criar(novo({ cor: '' })), 400);
    });

    test('rejeita placa duplicada', () => {
        service.criar(novo());
        expectErro(() => service.criar(novo()), 409);
    });

    test('recupera por id e lança 404 quando não existe', () => {
        const criado = service.criar(novo());
        expect(service.buscarPorId(criado.id)).toEqual(criado);
        expectErro(() => service.buscarPorId('inexistente'), 404);
    });

    test('lista com filtros por cor e marca', () => {
        service.criar(novo({ placa: 'AAA1A11', cor: 'Preto', marca: 'Fiat' }));
        service.criar(novo({ placa: 'BBB2B22', cor: 'Branco', marca: 'Fiat' }));
        service.criar(novo({ placa: 'CCC3C33', cor: 'Preto', marca: 'Ford' }));

        expect(service.listar()).toHaveLength(3);
        expect(service.listar({ cor: 'preto' })).toHaveLength(2);
        expect(service.listar({ marca: 'FIAT' })).toHaveLength(2);
        expect(service.listar({ cor: 'Preto', marca: 'Ford' })).toHaveLength(1);
    });

    test('atualiza automóvel existente', () => {
        const criado = service.criar(novo());
        const atualizado = service.atualizar(criado.id, novo({ cor: 'Azul' }));
        expect(atualizado.cor).toBe('Azul');
        expect(atualizado.id).toBe(criado.id);
    });

    test('exclui automóvel', () => {
        const criado = service.criar(novo());
        service.excluir(criado.id);
        expectErro(() => service.buscarPorId(criado.id), 404);
    });
});