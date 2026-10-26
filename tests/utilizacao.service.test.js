const createContainer = require('../src/container');
const { expectErro } = require('./helpers');

describe('UtilizacaoService', () => {
    let c;
    let carro1, carro2, motorista1, motorista2;

    beforeEach(() => {
        c = createContainer();
        carro1 = c.automovelService.criar({ placa: 'AAA1A11', cor: 'Preto', marca: 'Fiat' });
        carro2 = c.automovelService.criar({ placa: 'BBB2B22', cor: 'Branco', marca: 'Ford' });
        motorista1 = c.motoristaService.criar({ nome: 'João' });
        motorista2 = c.motoristaService.criar({ nome: 'Maria' });
    });

    const iniciar = (motorista, carro, extra = {}) =>
        c.utilizacaoService.iniciar({
            motoristaId: motorista.id,
            automovelId: carro.id,
            motivo: 'Visita a cliente',
            ...extra,
        });

    test('inicia utilização com data de início e sem data de término', () => {
        const u = iniciar(motorista1, carro1);
        expect(u.dataInicio).toBeDefined();
        expect(u.dataFim).toBeNull();
        expect(u.motivo).toBe('Visita a cliente');
    });

    test('exige motivo', () => {
        expectErro(() => iniciar(motorista1, carro1, { motivo: '' }), 400);
    });

    test('retorna 404 para motorista ou automóvel inexistente', () => {
        expectErro(() => iniciar({ id: 'x' }, carro1), 404);
        expectErro(() => iniciar(motorista1, { id: 'x' }), 404);
    });

    test('não permite que um automóvel seja usado por dois motoristas ao mesmo tempo', () => {
        iniciar(motorista1, carro1);
        expectErro(() => iniciar(motorista2, carro1), 409);
    });

    test('não permite que um motorista use dois automóveis ao mesmo tempo', () => {
        iniciar(motorista1, carro1);
        expectErro(() => iniciar(motorista1, carro2), 409);
    });

    test('finaliza utilização e libera motorista e automóvel', () => {
        const u = iniciar(motorista1, carro1);
        const finalizada = c.utilizacaoService.finalizar(u.id);
        expect(finalizada.dataFim).not.toBeNull();

        expect(() => iniciar(motorista2, carro1)).not.toThrow();
        expect(() => iniciar(motorista1, carro2)).not.toThrow();
    });

    test('não finaliza duas vezes nem com data anterior ao início', () => {
        const u = iniciar(motorista1, carro1, { dataInicio: '2026-01-10T10:00:00Z' });
        expectErro(() => c.utilizacaoService.finalizar(u.id, { dataFim: '2026-01-10T09:00:00Z' }), 400);

        c.utilizacaoService.finalizar(u.id, { dataFim: '2026-01-10T12:00:00Z' });
        expectErro(() => c.utilizacaoService.finalizar(u.id), 409);
    });

    test('retorna 404 ao finalizar registro inexistente', () => {
        expectErro(() => c.utilizacaoService.finalizar('x'), 404);
    });

    test('lista utilizações com dados do motorista e do automóvel', () => {
        iniciar(motorista1, carro1);
        const [registro] = c.utilizacaoService.listar();
        expect(registro.motorista.nome).toBe('João');
        expect(registro.automovel.placa).toBe('AAA1A11');
    });

    test('bloqueia exclusão de automóvel e motorista em utilização', () => {
        iniciar(motorista1, carro1);
        expectErro(() => c.automovelService.excluir(carro1.id), 409);
        expectErro(() => c.motoristaService.excluir(motorista1.id), 409);
    });
});