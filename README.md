# MiMo Abyss Chess

♟️ **MiMo Abyss Chess** — Cinematic 3D Chess Game with Stockfish AI & MiMo Commentary

---

## 🎮 Play Now

**Live URL:** https://mimo-abyss-chess.vercel.app

---

## ✨ Features

### Visual
- 🌑 **Abyss Theme**: Dark void + neon cyan/violet lighting
- 🎨 **Procedural Pieces**: 6 piece types × 2 colors (white/obsidian)
- ✨ **Post-Processing**: Bloom + vignette for cinematic feel
- 🎥 **Orbit Camera**: Free rotation, zoom, and pan

### Gameplay
- ♟️ **Full Chess Rules**: Check, checkmate, stalemate, en passant, castling
- 🖱️ **Click-to-Move**: Select piece → highlight valid moves → click destination
- 👥 **PvP Local**: Play against friends locally
- 🤖 **vs AI**: Stockfish.wasm integration (coming soon)

### UI
- 🎯 **HUD**: Turn indicator, move history, status
- 🎨 **Mode Select**: Choose PvP or vs AI
- ⚙️ **Settings**: Difficulty slider, player color selection

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Build | Vite + React 18 + TypeScript | Fast development |
| 3D | @react-three/fiber + drei | Declarative React Three Fiber |
| Rules | chess.js | Standard chess rules engine |
| State | Zustand | Simple state management |
| UI | TailwindCSS + Framer Motion | Styling & animations |

---

## 📁 Project Structure

```
mimo-abyss-chess/
├── src/
│   ├── components/
│   │   ├── Board.tsx       # 8x8 interactive board
│   │   ├── Pieces.tsx      # Procedural 3D pieces
│   │   ├── Lighting.tsx    # Abyss lighting setup
│   │   ├── HUD.tsx         # Game HUD overlay
│   │   └── ModeSelect.tsx  # Mode selection screen
│   ├── store/
│   │   └── gameStore.ts    # Zustand state store
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── public/
│   └── test/               # Manual test pages
├── tailwind.config.js
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Install
```bash
git clone https://github.com/JujisBaik/mimo-abyss-chess.git
cd mimo-abyss-chess
npm install
```

### Run Development
```bash
npm run dev
```

Visit `http://localhost:5173`

### Build for Production
```bash
npm run build
npm run preview
```

---

## 🎯 How to Play

1. **Select Mode**: Choose PvP or vs AI
2. **Pick Color**: White or Black
3. **Click Piece**: Select a piece (highlighted in purple)
4. **Click Destination**: Valid moves shown in cyan
5. **Play**: Make moves, check/checkmate detected automatically

---

## 📝 Roadmap

### MVP (Done ✅)
- [x] 3D board with Abyss theme
- [x] Chess.js integration
- [x] Click-to-move with legal move highlighting
- [x] Mode selection (PvP)
- [x] Basic HUD

### Coming Soon
- [ ] Stockfish.wasm AI opponent
- [ ] MiMo commentary system
- [ ] Animations (move, capture, check)
- [ ] Audio (ambient, SFX)
- [ ] Theme switcher (Cyber, Royal, Lava)
- [ ] Mobile responsive
- [ ] PGN export/import

---

## 🐛 Known Issues

1. **Raycasting**: Click detection may need fine-tuning on some devices
2. **Mobile**: Not fully optimized for touch yet
3. **AI**: Stockfish integration not yet implemented

---

## 🤝 Contributing

Contributions welcome! Feel free to open issues or pull requests.

---

## 📄 License

MIT License — feel free to use for your MiMo 100T application!

---

## 🔗 Links

- **GitHub**: https://github.com/JujisBaik/mimo-abyss-chess
- **Live Demo**: https://mimo-abyss-chess.vercel.app
- **MiMo 100T**: https://100t.xiaomimimo.com/

---

> "Chess, but the void is watching." 👁️