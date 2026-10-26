const request = require('supertest');
const createApp = require('../src/app');

describe('API (integração)', () => {
    let app;

    beforeEach(() => {
        app = createApp();
    });

    test('fluxo completo: cadastrar, utilizar, bloquear conflito, finalizar e listar', async () => {
        const carro = (await request(app).post('/automoveis').send({ placa: 'ABC1D23', cor: 'Preto', marca: 'Fiat' }))
            .body;
        const motorista = (await request(app).post('/motoristas').send({ nome: 'João' })).body;

        const inicio = await request(app)
            .post('/utilizacoes')
            .send({ motoristaId: motorista.id, automovelId: carro.id, motivo: 'Reunião' });
        expect(inicio.status).toBe(201);

        const conflito = await request(app)
            .post('/utilizacoes')
            .send({ motoristaId: motorista.id, automovelId: carro.id, motivo: 'Outra' });
        expect(conflito.status).toBe(409);

        const fim = await request(app).patch(`/utilizacoes/${inicio.body.id}/finalizar`).send({});
        expect(fim.status).toBe(200);
        expect(fim.body.dataFim).not.toBeNull();

        const lista = await request(app).get('/utilizacoes');
        expect(lista.body).toHaveLength(1);
        expect(lista.body[0].motorista.nome).toBe('João');
        expect(lista.body[0].automovel.placa).toBe('ABC1D23');
    });

    test('CRUD de automóvel com filtros e códigos HTTP corretos', async () => {
        await request(app).post('/automoveis').send({ placa: 'AAA1A11', cor: 'Preto', marca: 'Fiat' });
        const b = await request(app).post('/automoveis').send({ placa: 'BBB2B22', cor: 'Branco', marca: 'Ford' });

        expect((await request(app).get('/automoveis?cor=branco')).body).toHaveLength(1);
        expect((await request(app).get(`/automoveis/${b.body.id}`)).status).toBe(200);
        expect((await request(app).put(`/automoveis/${b.body.id}`).send({ placa: 'BBB2B22', cor: 'Azul', marca: 'Ford' })).body.cor).toBe('Azul');
        expect((await request(app).delete(`/automoveis/${b.body.id}`)).status).toBe(204);
        expect((await request(app).get(`/automoveis/${b.body.id}`)).status).toBe(404);
    });

    test('retorna 400 para dados inválidos e 404 para rota desconhecida', async () => {
        expect((await request(app).post('/motoristas').send({})).status).toBe(400);
        expect((await request(app).get('/rota-inexistente')).status).toBe(404);
    });
});