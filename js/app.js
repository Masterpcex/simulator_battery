import { SimulationEngine } from './simulationEngine.js';
import { UIManager } from './uiManager.js';

/**
 * Funzione principale che avvia l'applicazione.
 */
function main() {
    console.log("Inizializzazione del simulatore avanzato...");
    
    const simEngine = new SimulationEngine();
    const uiManager = new UIManager(simEngine);

    // --- CORREZIONE CONFERMATA ---
    // Collega il motore di simulazione al gestore UI.
    // Questo è necessario affinché il motore possa richiedere aggiornamenti all'interfaccia
    // (es. aggiornare i colori dei cavi o il display del multimetro).
    simEngine.setUIManager(uiManager);

    // Collega i bottoni di controllo della simulazione al motore
    document.getElementById('start-sim-btn').addEventListener('click', () => simEngine.start());
    document.getElementById('stop-sim-btn').addEventListener('click', () => simEngine.stop());
    
    console.log("Simulatore pronto. Trascina i componenti dalla barra laterale per iniziare.");
}

// Avvia l'applicazione quando il DOM è completamente caricato
window.addEventListener('DOMContentLoaded', main);