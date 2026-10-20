# Jump Tower

> **A 2D vertical platformer built on Roblox featuring a custom physics engine with raycast-based collision detection, velocity reflection mechanics, and charge-jump gameplay—developed using TypeScript with the Flamework framework and React-based UI.**

Video Review: https://www.youtube.com/watch?v=Lg1kphuliAM

---

## What is Jump Tower?

Jump Tower is a 2D parkour platformer (obby) built on the Roblox platform where players ascend a tower by mastering a charge-and-release jump mechanic. Unlike typical Roblox games that rely on the built-in physics engine, Jump Tower implements a fully custom physics system that enables precise 2D movement, bounce mechanics off angled surfaces, and impact-based landing effects.

### Core Gameplay
- **Charge Jump System**: Hold space to charge, release to jump. Jump height and distance scale with charge duration.
- **Directional Movement**: WASD controls with smooth walking animations
- **Bounce Physics**: Velocity reflects off angled surfaces using vector math
- **Impact Detection**: Hard landings trigger floor-fallen animations and temporary movement locks

---

## Quickstart Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [Aftman](https://github.com/LPGhatguy/aftman) (Roblox toolchain manager)
- [Roblox Studio](https://create.roblox.com/)

### Setup

1. **Install dependencies**
   ```bash
   npm install
   aftman install
   ```

2. **Build the project**
   ```bash
   npm run build:tower
   ```

3. **Start development mode** (watches for changes)
   ```bash
   npm run watch
   ```

4. **Sync with Roblox Studio**
   - Open Roblox Studio
   - Install the [Rojo plugin](https://rojo.space/)
   - Run `rojo serve` in your terminal
   - Connect via the Rojo plugin in Studio

### Project Structure
```
src/
├── client/          # Input handling, animation, camera, UI controllers
├── server/          # Game services, collision handling, player data
└── shared/          # Types, constants, network events, utilities
```

### Available Scripts
| Command | Description |
|---------|-------------|
| `npm run build:tower` | Compile TypeScript and build place |
| `npm run watch` | Watch mode for development |
| `npm run lint-fix` | Auto-fix linting issues |

---

## Technical Highlights

### Custom 2D Physics Engine
Rather than using Roblox's built-in 3D physics, Jump Tower implements a complete 2D physics simulation:

- **Raycast Collision Grid**: 6-directional raycasting with multiple rays per direction for precise collision detection
- **Manual Gravity**: Custom gravity constant (`0.8`) applied per-frame for consistent feel
- **Velocity Reflection**: Proper vector math for bouncing off angled surfaces:
  ```
  V_reflected = V_incident - 2(V_incident · N)N
  ```
- **Impact Force Calculation**: Converts velocity delta to impact force for detecting hard landings

### Architecture
- **Flamework Framework**: Decorator-based dependency injection for clean service/controller patterns
- **Client-Authoritative Movement**: Physics runs client-side for responsive controls; server mirrors state for multiplayer sync
- **React UI Layer**: Component-based UI with Reflex state management
- **Type-Safe Networking**: Strongly-typed client-server events prevent runtime errors

### Build Pipeline
- **roblox-ts**: TypeScript compiles to Lua with full type safety
- **Rojo**: File-based workflow syncs code to Roblox Studio
- **Aftman**: Cross-platform toolchain management for Rojo, rbxcloud, and other tools

### Code Quality
- Strict TypeScript configuration with ESLint
- Separation of concerns: input, physics, animation, and audio are fully decoupled
- Shared type definitions ensure client-server consistency

---

## Why It's Technically Impressive

1. **Custom Physics Over Engine Defaults**: Building a precise 2D platformer on a 3D engine required implementing collision detection, gravity, and bounce mechanics from scratch—demonstrating deep understanding of game physics.

2. **Vector Mathematics**: The bounce system uses reflection formulas typically found in graphics/physics programming, not standard game dev.

3. **Modern TypeScript Architecture**: Uses advanced patterns (dependency injection, decorators, React) in an environment (Roblox/Lua) that doesn't natively support them.

4. **Professional Toolchain**: Implements a production-ready build pipeline with compilation, linting, and deployment automation.

5. **Clean Separation of Concerns**: Controllers handle single responsibilities (input, movement, animation, sound, camera) with explicit dependencies—making the codebase maintainable and testable.

---

## License

MIT
