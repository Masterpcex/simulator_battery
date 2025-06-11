import { SimulationEngine } from './simulationEngine.js';
import { UIManager } from './uiManager.js';

// Funzione principale che avvia l'applicazione
function main() {
    console.log("Inizializzazione del simulatore...");
    
    const simEngine = new SimulationEngine();
    const uiManager = new UIManager(simEngine);

    // --- THIS IS THE NEW LINE YOU MUST ADD ---
    simEngine.setUIManager(uiManager); // Connect the engine back to the UI manager

    // Collega i bottoni di controllo della simulazione
    document.getElementById('start-sim-btn').addEventListener('click', () => simEngine.start());
    document.getElementById('stop-sim-btn').addEventListener('click', () => simEngine.stop());
    
    console.log("Simulatore pronto.");
}

// Avvia l'app quando il DOM è completamente caricato
window.addEventListener('DOMContentLoaded', main);
