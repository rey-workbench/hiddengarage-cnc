# CNC Simulator - Next.js

Professional CNC G-Code parser and 3D visualization tool with SVG to G-Code conversion, built with Next.js 15, TypeScript, and Three.js.

## Features

- ✨ **G-Code Parser**: Parse and visualize G-Code files with support for G00, G01, G02, G03, and more
- 🎨 **SVG to G-Code**: Convert SVG files to CNC-compatible G-Code
- 🎯 **3D Visualization**: Real-time 3D rendering with Three.js
- 🎮 **Playback Control**: Play, pause, and reset simulations with speed control
- 📊 **Statistics**: Real-time path statistics and time estimation
- 🌈 **Color Modes**: Default, Axis, and Progressive color visualization
- 🌍 **Multilingual**: Support for English and Indonesian
- 📱 **Responsive**: Modern, clean UI with Tailwind CSS
- ⚡ **Performance**: Optimized with React hooks and context API

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **3D Graphics**: Three.js with React Three Fiber
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Package Manager**: npm

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
cnc-nextjs/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── panels/           # Control and playback panels
│   ├── tabs/             # Tab components (GCode, SVG, Settings, etc.)
│   ├── ui/               # UI components (Loading, Status, etc.)
│   └── viewer/           # Three.js viewer component
├── contexts/             # React Context providers
│   ├── simulation-context.tsx
│   ├── settings-context.tsx
│   └── ui-context.tsx
├── hooks/                # Custom React hooks
│   ├── use-three-scene.ts
│   ├── use-playback.ts
│   ├── use-gcode.ts
│   └── use-svg.ts
├── lib/                  # Core logic and utilities
│   ├── constants.ts      # Constants and translations
│   ├── gcode-parser.ts   # G-Code parser
│   ├── svg-converter.ts  # SVG to G-Code converter
│   └── three/           # Three.js utilities
│       ├── scene-manager.ts
│       ├── toolhead.ts
│       ├── path-renderer.ts
│       └── playback-controller.ts
└── types/               # TypeScript type definitions
    └── index.ts
```

## Usage

### Loading G-Code

1. Click "Load File" to upload a `.gcode`, `.nc`, or `.ngc` file
2. Or paste G-Code directly into the editor
3. Click "Parse & Visualize" to render the toolpath
4. Use playback controls to simulate the machining process

### Converting SVG

1. Switch to the "SVG" tab
2. Click "Select SVG File" and choose an SVG file
3. Adjust conversion settings (scale, feed rate, cut depth, safe Z)
4. Click "Convert to G-Code"
5. The generated G-Code will automatically switch to the G-Code tab

### Settings

- **Playback Speed**: Adjust simulation speed (0.05x - 4x)
- **Arc Segments**: Control arc smoothness (4-256 segments)
- **Color Mode**: Choose between Default, Axis, or Progressive coloring
- **Display Options**: Toggle grid, axes, and toolhead visibility
- **Camera Presets**: Quickly switch between Top, Front, Side, and Isometric views
- **Language**: Switch between English and Indonesian

## Development

### Code Quality

This project follows best practices:

- **TypeScript**: Full type safety across the codebase
- **React Hooks**: Proper use of useState, useEffect, useCallback, useMemo, useContext
- **Context API**: Clean state management without prop drilling
- **Custom Hooks**: Reusable logic for Three.js, playback, parsing, etc.
- **Component Structure**: Well-organized, maintainable components
- **Performance**: Optimized rendering and memory management

### Adding New Features

1. **New Tab**: Create component in `components/tabs/` and add to `ControlPanel`
2. **New Hook**: Add to `hooks/` directory
3. **New Context**: Create in `contexts/` and add to `app/layout.tsx` providers
4. **New Three.js Feature**: Add to `lib/three/` directory

## License

MIT

## Author

Hidden Garage CNC Team
