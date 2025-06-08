// js/assets.js

// Questo file contiene le stringhe SVG per evitare di caricare file esterni.
export const SVG_ASSETS = {
    BATTERY_LIFEPO4: `<svg viewBox="0 0 80 120" class="component-svg">
        <rect x="2" y="2" width="76" height="116" rx="5" ry="5" fill="#00aaff" stroke="#1e272e" stroke-width="3"/>
        <rect class="terminal terminal-positive" data-terminal-id="positive" x="15" y="-5" width="20" height="15" fill="#d63031"/>
        <rect class="terminal terminal-negative" data-terminal-id="negative" x="45" y="-5" width="20" height="15" fill="#2d3436"/>
        <text x="40" y="60" font-size="14" fill="white" text-anchor="middle">LiFePO4</text>
    </svg>`,
    BATTERY_AGM: `<svg viewBox="0 0 150 100" class="component-svg">
        <rect x="2" y="2" width="146" height="96" rx="5" ry="5" fill="#6c5ce7" stroke="#1e272e" stroke-width="3"/>
        <circle class="terminal terminal-positive" data-terminal-id="positive" cx="30" cy="50" r="10" />
        <circle class="terminal terminal-negative" data-terminal-id="negative" cx="120" cy="50" r="10" />
        <text x="75" y="55" font-size="14" fill="white" text-anchor="middle">AGM 12V</text>
    </svg>`,
    BMS_4S: `<svg viewBox="0 0 100 70" class="component-svg">
        <rect x="1" y="1" width="98" height="68" rx="4" ry="4" fill="#a29bfe" stroke="#1e272e" stroke-width="2"/>
        <text x="50" y="20" font-size="12" fill="black" text-anchor="middle">BMS 4S</text>
        <rect class="terminal" data-terminal-id="b_minus" x="5" y="50" width="20" height="15" /><text x="15" y="45" font-size="10">B-</text>
        <rect class="terminal" data-terminal-id="p_minus" x="75" y="50" width="20" height="15" /><text x="85" y="45" font-size="10">P-</text>
        <!-- I terminali di bilanciamento (C1, C2...) e B+ saranno gestiti dalla logica -->
    </svg>`,
    FUSE: `<svg viewBox="0 0 60 30" class="component-svg">
        <rect x="1" y="5" width="58" height="20" rx="5" fill="#dfe6e9" stroke="#2d3436" stroke-width="2"/>
        <rect class="terminal" data-terminal-id="in" x="-2" y="10" width="10" height="10" fill="#8395a7"/>
        <rect class="terminal" data-terminal-id="out" x="52" y="10" width="10" height="10" fill="#8395a7"/>
        <text x="30" y="19" font-size="10" text-anchor="middle">FUSE</text>
    </svg>`,
    INVERTER: `<svg viewBox="0 0 180 80" class="component-svg">
        <rect x="1" y="1" width="178" height="78" rx="5" fill="#fdcb6e" stroke="#2d3436" stroke-width="2"/>
        <text x="90" y="45" font-size="14" text-anchor="middle">INVERTER</text>
        <rect class="terminal terminal-positive" data-terminal-id="dc_pos" x="10" y="10" width="20" height="15" fill="#d63031"/><text x="20" y="5" font-size="10">DC+</text>
        <rect class="terminal terminal-negative" data-terminal-id="dc_neg" x="10" y="55" width="20" height="15" fill="#2d3436"/><text x="20" y="77" font-size="10">DC-</text>
        <rect class="terminal" data-terminal-id="ac_out" x="150" y="32.5" width="20" height="15" fill="#0984e3"/><text x="160" y="28" font-size="10">AC</text>
    </svg>`,
    SOLAR_PANEL: `<svg viewBox="0 0 80 150" class="component-svg">
        <rect x="1" y="1" width="78" height="148" rx="5" fill="#00cec9" stroke="#2d3436" stroke-width="2"/>
        <path d="M1 25 H 79 M1 50 H 79 M1 75 H 79 M1 100 H 79 M1 125 H 79 M 40 1 V 149" stroke="rgba(0,0,0,0.2)" stroke-width="2"/>
        <rect class="terminal terminal-positive" data-terminal-id="positive" x="15" y="140" width="20" height="15" fill="#d63031"/>
        <rect class="terminal terminal-negative" data-terminal-id="negative" x="45" y="140" width="20" height="15" fill="#2d3436"/>
    </svg>`,
    CHARGE_CONTROLLER_MPPT: `<svg viewBox="0 0 120 80" class="component-svg">
        <rect x="1" y="1" width="118" height="78" rx="5" fill="#55efc4" stroke="#2d3436" stroke-width="2"/>
        <text x="60" y="45" font-size="14" text-anchor="middle">MPPT</text>
        <rect class="terminal" data-terminal-id="pv_pos" x="10" y="10" width="20" height="15" /><text x="20" y="5" font-size="10">PV+</text>
        <rect class="terminal" data-terminal-id="pv_neg" x="10" y="55" width="20" height="15" /><text x="20" y="77" font-size="10">PV-</text>
        <rect class="terminal" data-terminal-id="bat_pos" x="90" y="10" width="20" height="15" /><text x="100" y="5" font-size="10">BATT+</text>
        <rect class="terminal" data-terminal-id="bat_neg" x="90" y="55" width="20" height="15" /><text x="100" y="77" font-size="10">BATT-</text>
    </svg>`,
    LOAD_MOTOR: `<svg viewBox="0 0 80 80" class="component-svg">
        <circle cx="40" cy="40" r="38" fill="#b2bec3" stroke="#2d3436" stroke-width="2"/>
        <circle cx="40" cy="40" r="10" fill="#636e72"/>
        <rect class="terminal terminal-positive" data-terminal-id="positive" x="10" y="0" width="15" height="10"/>
        <rect class="terminal terminal-negative" data-terminal-id="negative" x="55" y="0" width="15" height="10"/>
    </svg>`,
    LOAD_BULB: `<svg viewBox="0 0 60 60" class="component-svg">
        <circle cx="30" cy="30" r="28" fill="#ffeaa7" stroke="#2d3436" stroke-width="2" class="bulb-glass"/>
        <rect class="terminal terminal-positive" data-terminal-id="positive" x="5" y="50" width="15" height="10"/>
        <rect class="terminal terminal-negative" data-terminal-id="negative" x="40" y="50" width="15" height="10"/>
    </svg>`,
    MULTIMETER: `<svg viewBox="0 0 80 150" class="component-svg">
        <rect x="1" y="1" width="78" height="148" rx="8" fill="#d63031"/>
        <rect x="10" y="10" width="60" height="40" fill="#2d3436"/>
        <rect class="terminal" data-terminal-id="probe_pos" x="15" y="140" width="15" height="15" fill="black"/>
        <rect class="terminal" data-terminal-id="probe_neg" x="50" y="140" width="15" height="15" fill="black"/>
    </svg>`,
    DEFAULT: `<svg viewBox="0 0 100 100" class="component-svg">
        <rect x="1" y="1" width="98" height="98" rx="5" ry="5" fill="#fab1a0" stroke="#d63031" stroke-width="2"/>
        <text x="50" y="55" font-size="12" fill="black" text-anchor="middle">Sconosciuto</text>
    </svg>`
};