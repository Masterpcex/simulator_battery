/**
 * Genera un ID univoco per un componente.
 */
export function generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calcola la distanza tra due punti.
 * @param {object} p1 - {x, y}
 * @param {object} p2 - {x, y}
 */
export function distance(p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}