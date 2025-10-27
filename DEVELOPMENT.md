# Development Guide

## 🏗️ Architecture Overview

### Project Philosophy
This project follows modern React best practices with:
- **Type Safety**: Full TypeScript coverage
- **Separation of Concerns**: Clear separation between UI, logic, and state
- **Reusability**: Custom hooks and context providers
- **Performance**: Optimized rendering with proper memoization
- **Maintainability**: Well-structured, documented code

### Core Concepts

#### 1. State Management (Context API)
Three main contexts for clean state separation:

```typescript
SimulationContext  // G-Code parsing, segments, stats
SettingsContext    // User preferences, saved to localStorage
UIContext          // UI state, active tab, loading, status messages
```

#### 2. Custom Hooks
Reusable logic extracted into hooks:

```typescript
useThreeScene()    // Three.js scene initialization
usePlayback()      // Playback control logic
useGCode()         // G-Code parsing and validation
useSVG()           // SVG conversion logic
useSceneControls() // Camera and scene manipulation
```

#### 3. Component Structure

```
components/
├── panels/          # Major UI panels
│   ├── control-panel.tsx    # Main control panel with tabs
│   └── playback-panel.tsx   # Playback controls
├── tabs/            # Individual tab content
│   ├── gcode-tab.tsx
│   ├── svg-tab.tsx
│   ├── settings-tab.tsx
│   ├── statistics-tab.tsx
│   └── legend-tab.tsx
├── ui/              # Reusable UI components
│   ├── loading-overlay.tsx
│   └── status-bar.tsx
└── viewer/          # 3D visualization
    └── three-viewer.tsx
```

## 🔧 Core Libraries

### Three.js Integration

The Three.js logic is separated into modular classes:

```typescript
SceneManager         // Scene, camera, renderer, lights
Toolhead            // CNC toolhead visualization
PathRenderer        // G-Code path rendering with colors
PlaybackController  // Animation and playback logic
```

Each class is independent and follows Single Responsibility Principle.

### G-Code Parser

The parser (`lib/gcode-parser.ts`) handles:
- ✅ G00 (Rapid positioning)
- ✅ G01 (Linear interpolation)
- ✅ G02/G03 (Circular interpolation CW/CCW)
- ✅ G17/G18/G19 (Plane selection)
- ✅ G20/G21 (Units: inches/mm)
- ✅ G90/G91 (Absolute/Incremental)
- ✅ M03/M04/M05 (Spindle control)

Parser outputs:
```typescript
{
  segments: GCodeSegment[],  // All movement segments
  bbox: BoundingBox,         // 3D bounding box
  stats: PathStatistics      // Distance, time estimates
}
```

### SVG Converter

Supports SVG elements:
- `<path>` with M, L, H, V, Z commands
- `<line>`
- `<polyline>`
- `<polygon>`
- `<rect>`
- `<circle>`
- `<ellipse>`

## 📝 Adding New Features

### Adding a New Tab

1. Create component in `components/tabs/`:
```typescript
// components/tabs/my-new-tab.tsx
'use client';

import { useSettings } from '@/contexts/settings-context';

export default function MyNewTab() {
  const { settings } = useSettings();
  
  return (
    <div className="space-y-4">
      {/* Your content */}
    </div>
  );
}
```

2. Add to `TabType` in `types/index.ts`:
```typescript
export type TabType = 'gcode' | 'svg' | 'settings' | 'statistics' | 'legend' | 'mynew';
```

3. Add translations in `lib/constants.ts`:
```typescript
tab: {
  // ... existing tabs
  mynew: 'My New Tab',
}
```

4. Import and use in `control-panel.tsx`

### Adding a New Hook

Create in `hooks/` directory:
```typescript
'use client';

import { useCallback } from 'react';
import { useSimulation } from '@/contexts/simulation-context';

export function useMyFeature() {
  const { segments } = useSimulation();
  
  const doSomething = useCallback(() => {
    // Your logic
  }, [segments]);
  
  return { doSomething };
}
```

### Adding a New Context

1. Create context file:
```typescript
// contexts/my-context.tsx
'use client';

import { createContext, useContext, useState } from 'react';

interface MyContextType {
  value: string;
  setValue: (v: string) => void;
}

const MyContext = createContext<MyContextType | undefined>(undefined);

export function MyProvider({ children }) {
  const [value, setValue] = useState('');
  
  return (
    <MyContext.Provider value={{ value, setValue }}>
      {children}
    </MyContext.Provider>
  );
}

export function useMyContext() {
  const context = useContext(MyContext);
  if (!context) throw new Error('useMyContext must be used within MyProvider');
  return context;
}
```

2. Add to `app/layout.tsx`:
```typescript
<MyProvider>
  {/* ... existing providers */}
</MyProvider>
```

## 🎨 Styling Guide

### Tailwind Conventions

Use semantic class combinations:
```typescript
// Buttons
className="btn btn-primary"  // Base + variant

// Panels
className="panel"            // Pre-defined in globals.css

// Inputs
className="input-base"       // Consistent form styling

// Scrollbars
className="scrollbar-thin"   // Custom scrollbar
```

### Custom Classes (globals.css)

```css
.btn           // Base button
.btn-primary   // Primary variant
.btn-success   // Success variant
.btn-warning   // Warning variant
.btn-danger    // Danger variant
.panel         // Panel container
.input-base    // Form input
.textarea-base // Textarea
```

## 🧪 Testing Checklist

Before committing:

- [ ] TypeScript check: `npm run type-check`
- [ ] Build successful: `npm run build`
- [ ] Lint clean: `npm run lint`
- [ ] Test G-Code parsing
- [ ] Test SVG conversion
- [ ] Test playback controls
- [ ] Test settings persistence
- [ ] Test responsive design
- [ ] Test both languages (EN/ID)

## 🚀 Performance Tips

1. **Memoization**: Use `useMemo` for expensive calculations
2. **Callbacks**: Use `useCallback` for event handlers
3. **Lazy Loading**: Components loaded with `dynamic()` from `next/dynamic`
4. **Three.js**: Dispose geometries and materials properly
5. **Large Files**: Warn users about files > 50k segments

## 🐛 Common Issues

### Three.js not rendering
- Check if container ref is properly passed
- Verify WebGL is supported
- Check console for Three.js errors

### State not updating
- Verify provider wraps component
- Check if context is properly imported
- Use React DevTools to inspect state

### TypeScript errors
- Run `npm run type-check` to see all errors
- Check type imports are correct
- Verify interface definitions match usage

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Three.js Documentation](https://threejs.org/docs/)
- [React Context API](https://react.dev/reference/react/createContext)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/my-feature`
3. Make changes following the architecture patterns
4. Test thoroughly
5. Commit with clear messages
6. Create Pull Request

Happy coding! 🎉
