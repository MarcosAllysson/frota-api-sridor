const createContainer = require('../src/container');
const { expectErro } = require('./helpers');

describe('MotoristaService', () => {
    let service;

    beforeEach(() => {
        service = createContainer().motoristaService;
    });

    test('cadastra motorista', () => {
        const criado = service.criar({ nome: '  João Silva ' });
        expect(criado.id).toBeDefined();
        expect(criado.nome).toBe('João Silva');
    });

    test('rejeita nome vazio', () => {
        expectErro(() => service.criar({ nome: '   ' }), 400);
    });

    test('recupera por id e lança 404 quando não existe', () => {
        const criado = service.criar({ nome: 'Maria' });
        expect(service.buscarPorId(criado.id)).toEqual(criado);
        expectErro(() => service.buscarPorId('x'), 404);
    });

    test('filtra listagem por nome (parcial, sem diferenciar maiúsculas)', () => {
        service.criar({ nome: 'João Silva' });
        service.criar({ nome: 'Maria Souza' });
        service.criar({ nome: 'Joana Lima' });

        expect(service.listar()).toHaveLength(3);
        expect(service.listar({ nome: 'jo' })).toHaveLength(2);
        expect(service.listar({ nome: 'souza' })).toHaveLength(1);
    });

    test('atualiza e exclui motorista', () => {
        const criado = service.criar({ nome: 'Carlos' });
        expect(service.atualizar(criado.id, { nome: 'Carlos Alberto' }).nome).toBe('Carlos Alberto');
        service.excluir(criado.id);
        expectErro(() => service.buscarPorId(criado.id), 404);
    });
});