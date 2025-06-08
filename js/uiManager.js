// js/uiManager.js

import { Battery, Fuse, Multimeter, BMS, Inverter, SolarPanel, ChargeController, Load, Wire } from './components.js';
import { CONFIG } from './config.js';

export class UIManager {
    constructor(simulationEngine) {
        this.engine = simulationEngine;
        this.workspaceWrapper = document.getElementById('workspace-wrapper');
        this.workspaceHtml = document.getElementById('workspace-html');
        this.workspaceSvg = document.getElementById('workspace-svg');
        this.toolbar = document.getElementById('toolbar');
        this.inspector = document.getElementById('inspector-content');
        this.multimeterDisplayContainer = document.getElementById('multimeter-display-container');
        this.multimeterScreen = document.getElementById('multimeter-screen');
        this.selectedComponent = null;
        this.isDrawingWire = false;
        this.currentDrawingWire = null;
        this.startTerminal = null;
        this.init();
    }

    init() {
        this.initToolbar();
        this.initInteract();
        this.initWorkspaceListeners();
        this.initKeyboardListeners(); // Aggiunto listener per la tastiera
    }
    
    initWorkspaceListeners() {
        this.workspaceWrapper.addEventListener('mousemove', (e) => {
            if (this.isDrawingWire && this.currentDrawingWire) {
                const workspaceRect = this.workspaceWrapper.getBoundingClientRect();
                const endPoint = {
                    x: e.clientX - workspaceRect.left,
                    y: e.clientY - workspaceRect.top
                };
                this.currentDrawingWire.updatePath(endPoint);
            }
        });
        this.workspaceWrapper.addEventListener('click', (e) => {
            if (this.isDrawingWire && e.target === this.workspaceWrapper) {
                this.cancelDrawingWire();
            }
        });
    }

    initKeyboardListeners() {
        document.addEventListener('keydown', (e) => {
            if ((e.key === 'Delete' || e.key === 'Backspace') && this.selectedComponent) {
                this.engine.removeComponent(this.selectedComponent);
                this.selectComponent(null); // Deseleziona
            }
        });
    }

    initToolbar() {
        this.toolbar.addEventListener('click', (e) => {
            if (e.target.classList.contains('tool-item')) {
                const type = e.target.dataset.type;
                this.createComponent(type, 200, 200);
            }
        });
    }
    
    createComponent(type, x, y) {
        let newComp;
        switch(type) {
            // MODIFICATO: gestione speciale per il multimetro
            case 'MULTIMETER':
                newComp = new Multimeter(type, x, y);
                // Aggiungi anche le sonde al motore di simulazione per renderle interattive
                this.engine.addComponent(newComp.probes.positive); // <--- CORRECTED
                this.engine.addComponent(newComp.probes.negative); // <--- CORRECTED
                break;
            case 'PROBE_POS': case 'PROBE_NEG': return; // Le sonde non si creano dalla toolbar
            case 'BATTERY_LIFEPO4': case 'BATTERY_AGM': newComp = new Battery(type, x, y); break;
            case 'FUSE': newComp = new Fuse(type, x, y); break;
            case 'LOAD_MOTOR': case 'LOAD_BULB': newComp = new Load(type, x, y); break;
            case 'BMS_4S': newComp = new BMS(type, x, y); break;
            case 'INVERTER': newComp = new Inverter(type, x, y); break;
            case 'SOLAR_PANEL': newComp = new SolarPanel(type, x, y); break;
            case 'CHARGE_CONTROLLER_MPPT': newComp = new ChargeController(type, x, y); break;
            default: console.error(`Tipo non riconosciuto: ${type}`); return;
        }
        this.engine.addComponent(newComp);
        this.selectComponent(newComp);
    }
    
    selectComponent(component) {
        if (this.selectedComponent) {
            this.selectedComponent.wrapper.classList.remove('selected');
        }
        this.selectedComponent = component;
        if (component) {
            this.selectedComponent.wrapper.classList.add('selected');
        }
        this.updateInspector();
    }
    
    updateInspector() {
        if (!this.selectedComponent) {
            this.inspector.innerHTML = `<p class="placeholder">Seleziona un componente o premi 'Canc' per eliminarlo.</p>`;
            return;
        }
        const comp = this.selectedComponent;
        let html = `<h3>${comp.type}</h3><p><small>${comp.id}</small></p>`;
        for (const [key, value] of Object.entries(comp.params)) {
            html += `<label for="param-${key}">${key}</label>
                     <input type="text" id="param-${key}" data-param="${key}" value="${value}">`;
        }
        // Visualizza dati di stato in tempo reale
        html += `<h4>Stato</h4>`;
        for (const [key, value] of Object.entries(comp.state)) {
             html += `<p><small>${key}: ${typeof value === 'number' ? value.toFixed(2) : value}</small></p>`;
        }
        this.inspector.innerHTML = html;
        this.inspector.querySelectorAll('input').forEach(input => {
            input.addEventListener('change', (e) => {
                const paramKey = e.target.dataset.param;
                if (this.selectedComponent) this.selectedComponent.params[paramKey] = e.target.value;
            });
        });
    }

    initInteract() {
        interact('.component-wrapper, .multimeter-probe-wrapper').draggable({
            listeners: {
                move: (event) => {
                    const target = event.target;
                    const component = this.engine.components.find(c => c.id === target.id);
                    if (component) {
                        component.x += event.dx;
                        component.y += event.dy;
                        target.style.left = `${component.x}px`;
                        target.style.top = `${component.y}px`;
                        
                        // Se è un componente normale, aggiorna i suoi cavi
                        if (component.terminals) {
                            Object.values(component.terminals).forEach(t => t.connections.forEach(w => w.updatePath()));
                        }
                        // Se è il corpo di un multimetro, aggiorna i cavi delle sonde
                        if (component instanceof Multimeter) {
                            component.updateProbeWires();
                        }
                        // Se è una sonda, aggiorna il suo cavo
                        if (component.parentMultimeter) {
                            component.parentMultimeter.updateProbeWires();
                        }
                    }
                }
            },
            modifiers: [interact.modifiers.snap({ targets: [interact.createSnapGrid({ x: CONFIG.GRID_SIZE, y: CONFIG.GRID_SIZE })] })]
        }).on('tap', (event) => {
             const component = this.engine.components.find(c => c.id === event.currentTarget.id);
             this.selectComponent(component);
        });
        interact('.terminal, .multimeter-probe-wrapper').on('tap', (event) => {
            const element = event.currentTarget;
            let terminal;

            if (element.classList.contains('terminal')) {
                const terminalId = element.dataset.terminalId;
                const componentWrapper = element.closest('.component-wrapper');
                const component = this.engine.components.find(c => c.id === componentWrapper.id);
                terminal = component.terminals[terminalId];
            } else { // È una sonda
                const component = this.engine.components.find(c => c.id === element.id);
                terminal = component.terminals[component.probeTerminalId];
            }
            
            if (!this.isDrawingWire) this.startDrawingWire(terminal);
            else if (this.startTerminal !== terminal) this.finishDrawingWire(terminal);
            event.stopPropagation();
        });
    }

    startDrawingWire(terminal) {
        this.isDrawingWire = true;
        this.startTerminal = terminal;
        this.currentDrawingWire = new Wire(terminal);
    }
    finishDrawingWire(endTerminal) {
        this.currentDrawingWire.setEnd(endTerminal);
        this.engine.addWire(this.currentDrawingWire);
        this.resetDrawingState();
    }
    cancelDrawingWire() {
        if (this.currentDrawingWire) this.currentDrawingWire.destroy();
        this.resetDrawingState();
    }
    resetDrawingState() {
        this.isDrawingWire = false;
        this.currentDrawingWire = null;
        this.startTerminal = null;
    }

   
    // METODO UPDATEUI COMPLETAMENTE AGGIORNATO
    updateUI(graph) {
        if (!graph) return;

        // Logica esistente per colorare i cavi
        this.engine.wires.forEach(wire => {
            const startNode = graph.nodes.find(n => n.id === wire.startTerminal.nodeId);
            if(startNode && startNode.isDriven) {
                wire.element.classList.remove('unpowered');
                wire.element.classList.toggle('positive', startNode.voltage > 0);
                wire.element.classList.toggle('negative', startNode.voltage === 0);
            } else {
                wire.element.classList.add('unpowered');
                wire.element.classList.remove('positive', 'negative');
            }
        });

        // Logica esistente per animare i componenti
        this.engine.components.forEach(comp => {
            comp.wrapper.classList.toggle('damaged', comp.state.isDamaged);
            if (comp instanceof Load) {
                 const isActive = comp.state.current > 0.01;
                 comp.wrapper.classList.toggle('active', isActive);
            }
        });

        // NUOVA LOGICA PER IL MULTIMETRO
        const multimeter = this.engine.components.find(c => c instanceof Multimeter);
        if (multimeter) {
            multimeter.updateProbeWires(); // Aggiorna la posizione dei cavi delle sonde
            this.multimeterDisplayContainer.classList.remove('hidden');
            const measurement = multimeter.measure(graph);
            this.multimeterScreen.textContent = `${measurement.voltage.toFixed(2)} V`;
        } else {
            this.multimeterDisplayContainer.classList.add('hidden');
        }
        
        if(this.selectedComponent) this.updateInspector();
    }
}