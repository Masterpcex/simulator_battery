// js/components.js

import { generateId } from './utils.js';
import { COMPONENT_DATA } from './config.js';
import { SVG_ASSETS } from './assets.js';

// --- CLASSI COMPONENTI ESISTENTI (SENZA MODIFICHE FINO A MULTIMETER) ---
class Component {
    constructor(type, x, y) {
        this.id = generateId('comp');
        this.type = type;
        this.x = x;
        this.y = y;

        // --- THIS BLOCK IS MODIFIED ---
        const data = COMPONENT_DATA[type];
        if (data) {
            // If configuration exists, use it
            this.width = data.width;
            this.height = data.height;
            this.params = JSON.parse(JSON.stringify(data.params));
        } else {
            // Otherwise, use safe defaults (for components like probes)
            this.width = 20;
            this.height = 20;
            this.params = {};
        }
        // --- END OF MODIFIED BLOCK ---

        this.state = { isSelected: false, isDamaged: false, temperature: 25, voltage: 0, current: 0 };
        this.terminals = {};
        this.createElement();
    }
    createElement() {
        this.wrapper = document.createElement('div');
        this.wrapper.id = this.id;
        this.wrapper.className = `component-wrapper component-${this.type.toLowerCase()}`;
        this.wrapper.style.left = `${this.x}px`;
        this.wrapper.style.top = `${this.y}px`;
        this.wrapper.style.width = `${this.width}px`;
        this.wrapper.style.height = `${this.height}px`;
        this.wrapper.innerHTML = SVG_ASSETS[this.type] || SVG_ASSETS.DEFAULT;
        document.getElementById('workspace-html').appendChild(this.wrapper);
        this.registerTerminals();
    }
    registerTerminals() {
        const terminalElements = this.wrapper.querySelectorAll('.terminal');
        terminalElements.forEach(el => {
            const terminalId = el.dataset.terminalId;
            this.terminals[terminalId] = { id: terminalId, component: this, element: el, connections: [], nodeId: null };
        });
    }
    getTerminalPosition(terminalId) {
        const terminal = this.terminals[terminalId];
        if (!terminal) return null;
        const el = terminal.element;
        const terminalRect = el.getBoundingClientRect();
        const workspaceRect = document.getElementById('workspace-wrapper').getBoundingClientRect();
        return {
            x: terminalRect.left - workspaceRect.left + (terminalRect.width / 2),
            y: terminalRect.top - workspaceRect.top + (terminalRect.height / 2)
        };
    }
    update(simulationData) { /*...*/ }
    destroy() {
         Object.values(this.terminals).forEach(terminal => {
             [...terminal.connections].forEach(wire => wire.destroy());
         });
         this.wrapper.remove();
    }
    getResistance() { return Infinity; }
}
export class Wire {
    constructor(startTerminal) {
        this.id = generateId('wire');
        this.startTerminal = startTerminal;
        this.endTerminal = null;
        this.state = { current: 0, voltage: 0 };
        this.element = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.element.setAttribute('id', this.id);
        this.element.setAttribute('class', 'wire unpowered');
        document.getElementById('workspace-svg').appendChild(this.element);
        this.updatePath();
    }
    updatePath(endPoint) {
        const startPoint = this.startTerminal.component.getTerminalPosition(this.startTerminal.id);
        if (!endPoint && this.endTerminal) {
            endPoint = this.endTerminal.component.getTerminalPosition(this.endTerminal.id);
        }
        if (!startPoint || !endPoint) return;
        const dx = endPoint.x - startPoint.x;
        const dy = endPoint.y - startPoint.y;
        const pathData = `M ${startPoint.x} ${startPoint.y} C ${startPoint.x + dx * 0.2} ${startPoint.y + dy * 0.8}, ${startPoint.x + dx * 0.8} ${startPoint.y + dy * 0.2}, ${endPoint.x} ${endPoint.y}`;
        this.element.setAttribute('d', pathData);
    }
    setEnd(endTerminal) {
        this.endTerminal = endTerminal;
        this.startTerminal.connections.push(this);
        this.endTerminal.connections.push(this);
        this.updatePath();
    }
    destroy() {
        if (this.startTerminal) {
            const index1 = this.startTerminal.connections.indexOf(this);
            if (index1 > -1) this.startTerminal.connections.splice(index1, 1);
        }
        if (this.endTerminal) {
            const index2 = this.endTerminal.connections.indexOf(this);
            if (index2 > -1) this.endTerminal.connections.splice(index2, 1);
        }
        if (this.element) this.element.remove();
    }
}
export class Battery extends Component {
    constructor(type, x, y) {
        super(type, x, y);
        this.state.voltage = this.params.nominalVoltage;
        this.state.soc = 50;
    }
    update({ dt, currentDraw }) {
        const chargeDelta = (currentDraw * (dt / 1000)) / 3600;
        this.state.soc -= (chargeDelta / this.params.capacityAh) * 100;
        if (this.state.soc < 0) this.state.soc = 0;
        if (this.state.soc > 100) this.state.soc = 100;
        const voltageSag = currentDraw * this.params.internalResistance;
        this.state.voltage = this.params.nominalVoltage - voltageSag;
        if (this.state.soc <= 0) this.state.voltage = 0;
    }
}
export class Load extends Component {
    getResistance() {
        if (this.params.voltage === 0 || this.params.power === 0) return Infinity;
        return Math.pow(this.params.voltage, 2) / this.params.power;
    }
}
export class Fuse extends Component {
    update({ current }) {
        if (!this.params.isBlown && Math.abs(current) > this.params.rating) {
            this.params.isBlown = true;
            this.state.isDamaged = true;
            this.wrapper.classList.add('damaged');
            console.warn(`FUSIBILE ${this.id} BRUCIATO!`);
        }
    }
    getResistance() { return this.params.isBlown ? Infinity : 0.001; }
}

// --- CLASSI NUOVE E MODIFICATE ---

// NUOVA CLASSE PER I PUNTALI (SONDE)
export class MultimeterProbe extends Component {
    constructor(type, x, y, parentMultimeter, isPositive) {
        // Usa un tipo fittizio per non avere SVG o parametri complessi
        super(type, x, y); 
        this.parentMultimeter = parentMultimeter;
        this.isPositive = isPositive;
        this.probeTerminalId = 'probe_tip'; // Un solo "terminale" per la punta
        this.createProbeElement();
    }

    // Sovrascrive il metodo di creazione standard
    createElement() {} 
    
    createProbeElement() {
        this.wrapper = document.createElement('div');
        this.wrapper.id = this.id;
        this.wrapper.className = `multimeter-probe-wrapper ${this.isPositive ? 'probe-positive' : 'probe-negative'}`;
        this.wrapper.style.left = `${this.x}px`;
        this.wrapper.style.top = `${this.y}px`;
        
        // --- THIS BLOCK IS MODIFIED ---
        // Un solo terminale fittizio per le connessioni
        this.terminals[this.probeTerminalId] = {
            id: this.probeTerminalId,
            component: this,
            element: this.wrapper, // THIS IS THE FIX: Link the wrapper div as the terminal's element.
            connections: [],
            nodeId: null
        };
        // --- END OF MODIFIED BLOCK ---
        
        document.getElementById('workspace-html').appendChild(this.wrapper);
    }

    
    // La sonda stessa non ha una resistenza nel circuito
    getResistance() { return Infinity; }

    destroy() {
        // Se la sonda viene eliminata, elimina anche il multimetro genitore
        if(this.parentMultimeter) {
            this.parentMultimeter.destroy();
        }
        super.destroy();
    }
}

// CLASSE MULTIMETER MODIFICATA
export class Multimeter extends Component {
    constructor(type, x, y) {
        super(type, x, y);
        this.probes = {
            positive: new MultimeterProbe('PROBE_POS', x, y + 160, this, true),
            negative: new MultimeterProbe('PROBE_NEG', x + 60, y + 160, this, false)
        };
        this.probeWires = {
            positive: this.createProbeWire(true),
            negative: this.createProbeWire(false)
        };
    }
    
    createProbeWire(isPositive) {
        const wire = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        wire.setAttribute('class', `probe-wire ${isPositive ? 'positive' : 'negative'}`);
        document.getElementById('workspace-svg').appendChild(wire);
        return wire;
    }

    updateProbeWires() {
        // Aggiorna il cavo della sonda positiva
        const bodyPosPositive = this.getTerminalPosition('probe_pos');
        const probePos = { x: this.probes.positive.x + 10, y: this.probes.positive.y + 10 };
        this.drawProbeWire(this.probeWires.positive, bodyPosPositive, probePos);

        // Aggiorna il cavo della sonda negativa
        const bodyPosNegative = this.getTerminalPosition('probe_neg');
        const probeNeg = { x: this.probes.negative.x + 10, y: this.probes.negative.y + 10 };
        this.drawProbeWire(this.probeWires.negative, bodyPosNegative, probeNeg);
    }
    
    drawProbeWire(wireElement, startPoint, endPoint) {
        if (!startPoint || !endPoint) return;
        const pathData = `M ${startPoint.x} ${startPoint.y} L ${endPoint.x} ${endPoint.y}`;
        wireElement.setAttribute('d', pathData);
    }

    measure(graph) {
        const probePos = this.probes.positive;
        const probeNeg = this.probes.negative;

        // Trova il nodo collegato alla punta della sonda positiva
        const connectionPos = probePos.terminals[probePos.probeTerminalId].connections[0];
        const targetTerminalPos = connectionPos ? (connectionPos.startTerminal.component === probePos ? connectionPos.endTerminal : connectionPos.startTerminal) : null;
        const nodePos = targetTerminalPos ? graph.nodes.find(n => n.id === targetTerminalPos.nodeId) : null;
        
        // Trova il nodo collegato alla punta della sonda negativa
        const connectionNeg = probeNeg.terminals[probeNeg.probeTerminalId].connections[0];
        const targetTerminalNeg = connectionNeg ? (connectionNeg.startTerminal.component === probeNeg ? connectionNeg.endTerminal : connectionNeg.startTerminal) : null;
        const nodeNeg = targetTerminalNeg ? graph.nodes.find(n => n.id === targetTerminalNeg.nodeId) : null;

        if (nodePos && nodeNeg) {
            const voltage = nodePos.voltage - nodeNeg.voltage;
            return { voltage };
        }
        return { voltage: 0 }; // Nessuna lettura valida
    }
    
    destroy() {
        // Rimuovi anche le sonde e i cavi delle sonde quando il corpo viene eliminato
        if (this.probes) {
            this.probes.positive.parentMultimeter = null; // Evita loop infiniti
            this.probes.negative.parentMultimeter = null;
            this.probes.positive.destroy();
            this.probes.negative.destroy();
        }
        if (this.probeWires) {
            this.probeWires.positive.remove();
            this.probeWires.negative.remove();
        }
        super.destroy();
    }
}

// Altre classi
export class BMS extends Component {}
export class Inverter extends Component {}
export class SolarPanel extends Component {}
export class ChargeController extends Component {}