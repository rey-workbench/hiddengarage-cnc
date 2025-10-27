# Quick Start Guide

## 🚀 Cara Cepat Memulai

### 1. Install Dependencies
```bash
npm install
```

### 2. Jalankan Development Server
```bash
npm run dev
```

Buka browser ke [http://localhost:3000](http://localhost:3000)

### 3. Cara Menggunakan

#### Mode G-Code
1. Klik tab "G-Code"
2. Klik tombol "Contoh" untuk memuat G-code contoh, atau
3. Klik "Muat File" untuk upload file `.gcode`, `.nc`, atau `.ngc`
4. Atau paste G-code langsung ke text editor
5. Klik "Parse & Visualisasi"
6. Gunakan tombol Play/Pause/Reset untuk mensimulasikan

#### Mode SVG
1. Klik tab "SVG"
2. Klik "Pilih File SVG" dan upload file SVG Anda
3. Atur settings:
   - **Scale**: Ukuran objek (gunakan 0.01-0.001 untuk objek besar)
   - **Feed Rate**: Kecepatan potong (mm/min)
   - **Cut Depth**: Kedalaman potong (nilai negatif)
   - **Safe Z**: Ketinggian aman
4. Klik "Konversi ke G-Code"
5. G-code akan otomatis di-generate dan muncul di tab G-Code

#### Settings
- **Playback Speed**: Atur kecepatan simulasi (0.05x - 4x)
- **Arc Segments**: Atur kehalusan lengkungan (4-256)
- **Color Mode**: 
  - Default: Warna berdasarkan jenis gerakan
  - Axis: Warna berdasarkan arah gerakan
  - Progressive: Warna berubah secara realtime
- **Camera Presets**: Atas, Depan, Samping, Isometric

## 📁 Struktur Project

```
cnc-nextjs/
├── app/              # Next.js pages & layout
├── components/       # React components
│   ├── panels/      # Control & Playback panels
│   ├── tabs/        # Tab components
│   ├── ui/          # UI components
│   └── viewer/      # 3D Viewer
├── contexts/        # React Context (state management)
├── hooks/           # Custom React hooks
├── lib/             # Core logic
│   ├── three/      # Three.js utilities
│   └── ...         # Parsers & converters
└── types/          # TypeScript definitions
```

## 🛠️ Commands

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
npm run type-check # TypeScript type checking
npm run clean      # Clean build artifacts
```

## 🎯 Features

✅ G-Code Parser (G00, G01, G02, G03, dll)
✅ SVG to G-Code Converter
✅ Real-time 3D Visualization
✅ Playback Controls
✅ Path Statistics
✅ Multiple Color Modes
✅ Dual Language (EN/ID)
✅ Responsive Design
✅ Modern UI with Tailwind CSS

## 🐛 Troubleshooting

### Objek terlalu besar atau tidak terlihat
- Gunakan Scale 0.01 atau 0.001 pada SVG settings
- Gunakan preset camera untuk melihat dari sudut berbeda

### Performance lambat
- Kurangi Arc Segments di Settings
- Gunakan file G-code yang lebih kecil
- Untuk SVG kompleks, simplify terlebih dahulu

### TypeScript errors
```bash
npm run type-check
```

## 📝 Tips

1. **Untuk SVG terbaik**: Gunakan vector graphics sederhana (logo, outline)
2. **Testing**: Gunakan contoh SVG di folder `public/examples/`
3. **Performance**: File dengan < 50,000 segments akan render dengan cepat
4. **Camera**: Gunakan mouse untuk pan/zoom/rotate viewport

## 🔗 Tech Stack

- Next.js 15
- TypeScript
- Three.js
- React Context API
- Tailwind CSS
- React Hooks

Selamat mencoba! 🎉
