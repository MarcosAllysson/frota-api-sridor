class AutomovelController {
    constructor(service) {
        this.service = service;
    }

    criar = (req, res) => res.status(201).json(this.service.criar(req.body));
    listar = (req, res) => res.json(this.service.listar(req.query));
    buscarPorId = (req, res) => res.json(this.service.buscarPorId(req.params.id));
    atualizar = (req, res) => res.json(this.service.atualizar(req.params.id, req.body));
    excluir = (req, res) => {
        this.service.excluir(req.params.id);
        res.status(204).send();
    };
}

module.exports = AutomovelController;