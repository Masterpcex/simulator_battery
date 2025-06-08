export const CONFIG = {
    GRID_SIZE: 25,
    SNAP_DISTANCE: 15,
    SIMULATION_TICK_MS: 100, // Esegue la simulazione 10 volte al secondo
};

export const COMPONENT_DATA = {
    BATTERY_LIFEPO4: {
        label: 'Batteria LiFePO4',
        width: 80,
        height: 120,
        params: {
            nominalVoltage: 3.2,
            capacityAh: 280,
            internalResistance: 0.0002,
            maxChargeVoltage: 3.65,
            minDischargeVoltage: 2.5,
            soh: 100, // State of Health in %
            chargeCycles: 0,
        }
    },
    BATTERY_AGM: {
        label: 'Batteria AGM 12V',
        width: 150,
        height: 100,
        params: {
            nominalVoltage: 12.0,
            capacityAh: 100,
            internalResistance: 0.005,
            soh: 100,
            chargeCycles: 0,
        }
    },
    BMS_4S: {
        label: 'BMS 4S 12V',
        width: 100,
        height: 60,
        params: {
            series: 4,
            maxCurrent: 100, // Amps
            overVoltageProtection: 3.65,
            underVoltageProtection: 2.5,
        }
    },
    FUSE: {
        label: 'Fusibile',
        width: 50,
        height: 25,
        params: {
            rating: 100, // Amps
            isBlown: false,
        }
    },
    INVERTER: {
        label: 'Inverter',
        width: 180,
        height: 80,
        params: {
            inputVoltage: 12, // DC
            outputVoltage: 230, // AC
            maxPower: 1000, // Watts
            efficiency: 90, // %
        }
    },
    SOLAR_PANEL: {
        label: 'Pannello Solare',
        width: 80,
        height: 150,
        params: {
            power: 100, // Watts in STC
            voc: 21.6, // Open circuit voltage
            isc: 6.10, // Short circuit current
        }
    },
    CHARGE_CONTROLLER_MPPT: {
        label: 'Regolatore MPPT',
        width: 120,
        height: 80,
        params: {
            maxInputVoltage: 100, // Volts
            maxCurrent: 30, // Amps
            efficiency: 98,
        }
    },
    LOAD_MOTOR: {
        label: 'Motore DC',
        width: 80,
        height: 80,
        params: {
            voltage: 12,
            power: 120, // Watts
            inrushCurrentMultiplier: 5,
        }
    },
    LOAD_BULB: {
        label: 'Lampadina DC',
        width: 60,
        height: 60,
        params: {
            voltage: 12,
            power: 20, // Watts
        }
    },
     MULTIMETER: {
        label: 'Tester',
        width: 80,
        height: 150,
        params: {
            mode: 'voltage', // 'voltage', 'resistance', 'continuity'
        }
    }
};