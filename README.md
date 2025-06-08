PRO Battery Simulator
A professional web-based battery simulation application that allows users to design, build, and test electrical circuits with various components including batteries, loads, inverters, solar panels, and measurement tools.
🚀 Features
Components Library

Batteries: LiFePO4 and AGM 12V batteries with realistic parameters
Power Management: BMS (Battery Management System), fuses, inverters
Energy Sources: Solar panels with MPPT charge controllers
Loads: Motors and bulbs with configurable power ratings
Measurement Tools: Digital multimeter with probe functionality

Interactive Simulation

Real-time Circuit Analysis: Live voltage and current calculations
Visual Feedback: Color-coded wires showing power states (positive/negative/unpowered)
Component Status: Visual indicators for damaged components and active loads
Grid-based Workspace: Snap-to-grid component placement

Advanced Features

Drag & Drop Interface: Intuitive component placement and wiring
Property Inspector: Real-time parameter editing and status monitoring
Multimeter Integration: Moveable probes for circuit testing
Fault Detection: Short circuit detection and component damage simulation

🛠️ Technology Stack

Frontend: Pure HTML5, CSS3, and ES6 JavaScript (no frameworks)
Interaction: Interact.js for drag-and-drop functionality
Graphics: SVG for component rendering and wire visualization
Architecture: Modular ES6 classes with separation of concerns

📁 Project Structure
├── index.html              # Main HTML file
├── css/
│   └── main.css           # Styles and component themes
└── js/
    ├── app.js             # Application entry point
    ├── simulationEngine.js # Circuit simulation logic
    ├── uiManager.js       # User interface management
    ├── components.js      # Component classes and definitions
    ├── assets.js          # SVG assets for components
    ├── config.js          # Configuration and component parameters
    └── utils.js           # Utility functions
🚀 Getting Started
Prerequisites

A modern web browser with ES6 module support
A local web server (for CORS compliance)

Installation

Clone or download the project files
Serve the files using a local web server:
bash# Using Python 3
python -m http.server 8000

# Using Node.js (with http-server)
npx http-server

# Using PHP
php -S localhost:8000

Open your browser and navigate to http://localhost:8000

🎮 How to Use
Building Circuits

Add Components: Click on components in the left toolbar to add them to the workspace
Position Components: Drag components to desired positions (they snap to grid)
Create Connections: Click on component terminals to start wiring, then click another terminal to complete the connection
Configure Parameters: Select components to view and edit their properties in the right inspector panel

Using the Multimeter

Add Multimeter: Click "Tester" in the toolbar
Position Probes: Drag the red (positive) and black (negative) probes to desired measurement points
Connect Probes: Click on probe tips, then click on component terminals to make connections
Read Measurements: The multimeter display shows voltage readings between the connected points

Running Simulations

Start Simulation: Click "Avvia Simulazione" (Start Simulation)
Monitor Status: Watch real-time updates in component properties and visual indicators
Stop Simulation: Click "Ferma Simulazione" (Stop Simulation) when done

Keyboard Shortcuts

Delete/Backspace: Remove selected component

⚡ Component Details
Batteries

LiFePO4: 3.2V nominal, 280Ah capacity, low internal resistance
AGM 12V: 12V nominal, 100Ah capacity, typical for automotive applications

Power Electronics

BMS: 4S configuration for LiFePO4 battery protection
Inverter: DC to AC conversion with efficiency modeling
MPPT Controller: Solar charge controller with maximum power point tracking

Loads and Protection

Fuse: Overcurrent protection with realistic trip characteristics
Motor: Inductive load with inrush current modeling
Bulb: Resistive load for testing

🔧 Configuration
Component parameters can be modified in js/config.js:
javascriptBATTERY_LIFEPO4: {
    nominalVoltage: 3.2,
    capacityAh: 280,
    internalResistance: 0.0002,
    // ... other parameters
}
Simulation settings in the same file:
javascriptCONFIG: {
    SIMULATION_TICK_MS: 100,  // Simulation update rate
    GRID_SIZE: 25,            // Grid snap size
    SNAP_DISTANCE: 15         // Terminal connection distance
}
🎨 Customization
Visual Themes
Modify CSS variables in css/main.css:
css:root {
    --bg-main: #2d3436;
    --accent-color: #0984e3;
    --danger-color: #d63031;
    /* ... other theme variables */
}
Adding New Components

Define component data in config.js
Add SVG asset in assets.js
Create component class in components.js
Update UI creation logic in uiManager.js

🐛 Troubleshooting
Common Issues

Components not loading: Ensure you're serving files through a web server, not opening directly in browser
Drag & drop not working: Check that Interact.js library is loading properly
Simulation not running: Verify all JavaScript modules are loading without errors in browser console

Debug Mode
Open browser developer tools and check console for detailed logging and error messages.
📈 Future Enhancements

 Save/Load circuit designs
 Export simulation data
 Additional measurement modes (current, resistance)
 More complex circuit analysis algorithms
 Component library expansion
 Mobile device optimization

🤝 Contributing
This is an educational project. Feel free to:

Report bugs and issues
Suggest new features
Submit improvements
Add new components

📄 License
This project is open source and available under standard open source terms. Perfect for educational use, learning electronics simulation, and web development practices.
🎓 Educational Use
This simulator is ideal for:

Electronics education and training
Circuit design prototyping
Understanding battery system behavior
Learning web development with ES6 modules
Demonstrating interactive SVG applications


Note: This simulator is designed for educational purposes. Real-world circuit design should always involve proper engineering analysis and safety considerations.
