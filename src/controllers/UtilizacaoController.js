class UtilizacaoController {
    constructor(service) {
        this.service = service;
    }

    iniciar = (req, res) => res.status(201).json(this.service.iniciar(req.body));
    finalizar = (req, res) => res.json(this.service.finalizar(req.params.id, req.body));
    listar = (req, res) => res.json(this.service.listar());
}

module.exports = UtilizacaoController;