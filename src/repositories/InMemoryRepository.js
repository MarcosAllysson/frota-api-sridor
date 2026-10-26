const { randomUUID } = require('crypto');

/**
 * Repositório genérico com persistência em memória.
 * Trocar por um banco de dados no futuro exige apenas outra implementação
 * com os mesmos métodos.
 */
class InMemoryRepository {
    constructor() {
        this.items = new Map();
    }

    create(data) {
        const entity = { id: randomUUID(), ...data };
        this.items.set(entity.id, entity);
        return entity;
    }

    findById(id) {
        return this.items.get(id) || null;
    }

    findAll(predicate = () => true) {
        return [...this.items.values()].filter(predicate);
    }

    update(id, data) {
        const current = this.findById(id);
        if (!current) return null;
        const updated = { ...current, ...data, id };
        this.items.set(id, updated);
        return updated;
    }

    delete(id) {
        return this.items.delete(id);
    }
}

module.exports = InMemoryRepository;