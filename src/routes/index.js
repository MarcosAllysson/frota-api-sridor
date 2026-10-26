const { Router } = require('express');
const AutomovelController = require('../controllers/AutomovelController');
const MotoristaController = require('../controllers/MotoristaController');
const UtilizacaoController = require('../controllers/UtilizacaoController');

function createRoutes({ automovelService, motoristaService, utilizacaoService }) {
    const router = Router();
    const automoveis = new AutomovelController(automovelService);
    const motoristas = new MotoristaController(motoristaService);
    const utilizacoes = new UtilizacaoController(utilizacaoService);

    router.post('/automoveis', automoveis.criar);
    router.get('/automoveis', automoveis.listar); // ?cor=&marca=
    router.get('/automoveis/:id', automoveis.buscarPorId);
    router.put('/automoveis/:id', automoveis.atualizar);
    router.delete('/automoveis/:id', automoveis.excluir);

    router.post('/motoristas', motoristas.criar);
    router.get('/motoristas', motoristas.listar); // ?nome=
    router.get('/motoristas/:id', motoristas.buscarPorId);
    router.put('/motoristas/:id', motoristas.atualizar);
    router.delete('/motoristas/:id', motoristas.excluir);

    router.post('/utilizacoes', utilizacoes.iniciar);
    router.patch('/utilizacoes/:id/finalizar', utilizacoes.finalizar);
    router.get('/utilizacoes', utilizacoes.listar);

    return router;
}

module.exports = createRoutes;