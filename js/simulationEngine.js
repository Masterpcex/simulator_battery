// js/simulationEngine.js

import { CONFIG } from "./config.js";
import { Battery, Fuse, Load } from "./components.js";

export class SimulationEngine {
    constructor() {
        this.uiManager = null;
        this.components = [];
        this.wires = [];
        this.isRunning = false;
        this.intervalId = null;
        this.simulationTimeStep = CONFIG.SIMULATION_TICK_MS / 1000; // in secondi
    }

    setUIManager(uiManager) {
        this.uiManager = uiManager;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.intervalId = setInterval(() => this.tick(), CONFIG.SIMULATION_TICK_MS);
        console.log("Simulazione avviata.");
    }

    stop() {
        if (!this.isRunning) return;
        this.isRunning = false;
        clearInterval(this.intervalId);
        console.log("Simulazione fermata.");
    }

    tick() {
        const electricalGraph = this.buildElectricalGraph();
        this.solveCircuit(electricalGraph);
        this.updateComponentsState();
        this.uiManager.updateUI(electricalGraph); // Passa i dati del grafo all'UI
    }
    
    buildElectricalGraph() {
        const nodes = [];
        const visitedTerminals = new Set();

        for (const component of this.components) {
            for (const terminalId in component.terminals) {
                const terminal = component.terminals[terminalId];
                if (visitedTerminals.has(terminal)) continue;

                const newNode = {
                    id: `node_${nodes.length}`,
                    terminals: [],
                    voltage: null, // Sarà calcolato dopo
                };
                
                const queue = [terminal];
                visitedTerminals.add(terminal);

                while (queue.length > 0) {
                    const currentTerminal = queue.shift();
                    currentTerminal.nodeId = newNode.id;
                    newNode.terminals.push(currentTerminal);

                    for (const wire of currentTerminal.connections) {
                        const otherTerminal = wire.startTerminal === currentTerminal ? wire.endTerminal : wire.startTerminal;
                        if (otherTerminal && !visitedTerminals.has(otherTerminal)) {
                            visitedTerminals.add(otherTerminal);
                            queue.push(otherTerminal);
                        }
                    }
                }
                nodes.push(newNode);
            }
        }
        return { nodes };
    }
    
    solveCircuit(graph) {
        // Reset and find power sources
        graph.nodes.forEach(node => {
            node.voltage = 0; // Ground di riferimento
            node.isDriven = false;
        });

        // Step 1: Imposta la tensione dei nodi collegati direttamente a fonti di alimentazione
        for (const comp of this.components) {
            if (comp instanceof Battery && comp.state.soc > 0) {
                const posTerminal = comp.terminals['positive'];
                const negTerminal = comp.terminals['negative'];
                const posNode = graph.nodes.find(n => n.id === posTerminal.nodeId);
                const negNode = graph.nodes.find(n => n.id === negTerminal.nodeId);

                if (negNode) {
                    negNode.voltage = 0; // Il negativo è il nostro riferimento 0V
                    negNode.isDriven = true;
                }
                if (posNode) {
                    posNode.voltage = comp.state.voltage;
                    posNode.isDriven = true;
                }
            }
        }

        // Step 2: Calcolo della corrente sui carichi
        for (const comp of this.components) {
            let currentDraw = 0;
            if (comp.getResistance() !== Infinity && !(comp instanceof Battery)) {
                const term1 = Object.values(comp.terminals)[0];
                const term2 = Object.values(comp.terminals)[1];
                if (!term1 || !term2) continue;

                const node1 = graph.nodes.find(n => n.id === term1.nodeId);
                const node2 = graph.nodes.find(n => n.id === term2.nodeId);
                
                if (node1 && node2 && (node1.isDriven || node2.isDriven)) {
                    const voltageDiff = Math.abs(node1.voltage - node2.voltage);
                    currentDraw = voltageDiff / comp.getResistance();
                }
            }
            comp.state.current = currentDraw;
        }
        this.checkForFaults(graph);
    }

    checkForFaults(graph) {
        // Rilevamento corto circuito
        for (const comp of this.components) {
            if (comp instanceof Battery) {
                const posTerminal = comp.terminals['positive'];
                const negTerminal = comp.terminals['negative'];
                if (posTerminal.nodeId && posTerminal.nodeId === negTerminal.nodeId) {
                    comp.state.isDamaged = true;
                    comp.wrapper.classList.add('damaged');
                    console.error(`CORTO CIRCUITO sulla batteria ${comp.id}!`);
                }
            }
        }
    }

    updateComponentsState() {
        // Calcolo assorbimento totale per ogni batteria
        const batteryDraws = {};
        this.components.forEach(c => batteryDraws[c.id] = 0);

        this.components.forEach(comp => {
            if (comp instanceof Load || comp instanceof Fuse) {
                // Semplificazione: si assume che ci sia una sola batteria nel circuito
                const battery = this.components.find(c => c instanceof Battery);
                if(battery) {
                    batteryDraws[battery.id] += comp.state.current;
                }
            }
        });

        // Aggiorna ogni componente
        this.components.forEach(comp => {
            let updateData = { dt: this.simulationTimeStep, current: comp.state.current };
            if(comp instanceof Battery) {
                updateData.currentDraw = batteryDraws[comp.id];
            }
            comp.update(updateData);
        });
    }

    addComponent(component) { this.components.push(component); }
    addWire(wire) { this.wires.push(wire); }
    
    removeComponent(component) {
        const index = this.components.indexOf(component);
        if (index > -1) {
            this.components.splice(index, 1);
            component.destroy();
        }
    }
}