# 🌊 FISH ESCAPE – UNDERWATER GAMING PLATFORM

> **"Explore the Ocean. Play Smart. Collect Treasures!"**  
> Educational Underwater Mini-Game Platform & Distributed Service Architecture  
> Developed for **CIS045-3 Distributed Service Architectures (Assignment 1 Coursework)**  
> University of Bedfordshire

---

## 📸 Figma Reference & Visual Style
The user interface has been implemented based on the official Figma gaming mockup:
- **Underwater cartoon theme**: Deep ocean gradients, turquoise waters, floating animated bubbles, coral reefs, and sea plants.
- **Custom characters**: Scuba Diver Boy with thumbs-up greeting and friendly smiling Shark character.
- **Tactile UI elements**: Carved wooden banners (`Your Treasure Collection`, `Mini Games`, `Ocean Champions`, `My Profile`, `Achievements`), gold coins (`🪙 250`), animated hearts (`❤️❤️❤️`), and level stars (`★ Level 3`).
- **Mobile-first gaming experience**: Clean fixed bottom navigation bar, responsive card layouts, and on-screen touch D-pad controls for mobile and tablet devices.

---

## 🚀 Key Features & Playable Mini-Games

The platform contains **five fully playable, interactive underwater mini-games**:

1. **Game 01: Fish Counting (Official API Integration & Shark Chase Adventure)**
   - **Interactive Story Cutscene**: Animated narrative sequence where the fisherman falls off the fishing boat with a water splash into shark-infested waters.
   - **Live Shark Chase Distance Mechanic**: Visual ocean track tracking distance to safety (0m to 100m).
     - **Correct Answer**: Diver swims faster with bubble boost (+25m away from shark!).
     - **Wrong Answer**: Shark lunges closer (-25m) and player loses 1 Heart ❤️!
     - **Game Over**: Caught by shark if distance reaches 0m or lives reach 0.
     - **Rescue Escape**: Diver reaches safety buoy at 100m!
   - **Live Countdown Timer**: Dynamic per-question timer (30s, 25s, 20s) with pulsing warning alerts.
   - **Mystery Chests (Misty Boxes)**: Floating chests offering Extra Life (+1 Heart), +50 Gold Coins, Shark Freeze Shield, or Turbo Propellers.
   - **Multi-Level Progression**: Coastal Waters (Level 1), Coral Trench (Level 2), and Deep Abyss (Level 3).
   - **Official REST API**: Fetches real-time counting puzzle images from `https://marcconrad.com/uob/fish/api.php?out=json` with error handling, hints, and retries.

2. **Game 02: Memory Match**
   - 12 face-down underwater creature cards (clownfish, octopus, dolphin, sea turtle, starfish, crab).
   - Card flipping logic with match detection, move tracking, real-time stopwatch, and victory fanfare.
   - Bonus coin rewards scaled to move efficiency and speed.

3. **Game 03: Ocean Quiz**
   - 7 curated marine biology trivia questions across 5 categories: Marine Animals, Ocean Facts, Sea Creatures, Underwater Environment, and Ocean Conservation.
   - 4 selectable options with instant correct/incorrect visual highlighting, detailed "Did you know?" fun facts, and final score summary.

4. **Game 04: Save the Little Fish (Maze Arcade)**
   - Real-time underwater 10x10 maze arcade game.
   - Navigate the little golden fish to the Coral Sanctuary while dodging hazardous jellyfish and coral walls.
   - Supports keyboard arrow keys / WASD on desktop and an on-screen touch D-pad on mobile devices.
   - Integrated with power-ups (Swim Faster speed boost and Shark Shield hazard absorption).

5. **Game 05: Treasure Hunt (Seabed Explorer)**
   - Interactive seabed exploration where players spend 5 oxygen dive points to explore mystery seabed spots.
   - Uncover sunken pirate doubloons, rare glowing pearls, ancient relics, and legendary treasure chests with animated rarity tiers.

---

## 🏛️ CIS045-3 Assignment Themes Reflection

### 1. Software Design Principles (Low Coupling & High Cohesion)
- **High Cohesion**: Every module has a single, well-defined responsibility:
  - `src/services/fishApi.ts`: Exclusively manages communication, error handling, and parameter serialization with the external Fish Game API.
  - `src/services/soundService.ts`: Encapsulates all Web Audio API procedural synthesis (bubbles, coins, chimes, victory fanfare) without cluttering UI components.
  - `src/services/authService.ts`: Handles virtual identity, session cookies, and login/registration token flows.
  - `src/context/GameContext.tsx`: Centralizes global game state (scores, coins, levels, power-ups, achievements) with reusable action functions.
- **Low Coupling**: The React UI components never call `fetch()` directly or perform raw data manipulation. If the backend changes from the mock service to a Laravel REST API, only the corresponding service file in `src/services/` needs to be updated.

### 2. Event-Driven Programming
The application operates on an asynchronous, event-driven model:
- **User Input Events**: `onClick`, `onChange`, and `onSubmit` event handlers manage puzzle submissions, card flipping, and shop transactions.
- **Hardware & Keyboard Events**: `window.addEventListener('keydown')` catches `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`, `KeyW`, `KeyA`, `KeyS`, `KeyD` for navigating the maze in *Save the Little Fish*.
- **Touch & Pointer Events**: Interactive touch D-pad enables smooth mobile touch interaction.
- **Asynchronous Lifecycle Events**: `useEffect` hooks listen for countdown intervals, asynchronous API responses, and reactive game-over triggers.
- **Synthesized Audio Events**: User interactions trigger procedurally synthesized Web Audio events for immediate sensory feedback.

### 3. Interoperability
- **External Web Service Integration**: The platform interoperates with the external Fish Game API authored by Dr. Marc Conrad (`https://marcconrad.com/uob/fish/api.php?out=json`).
- **Data Exchange Protocol**: HTTP GET requests receiving JSON payloads containing the image resource URL and integer solutions:
  ```json
  {
    "question": "https://www.sanfoh.com/uob/fish/data/ch_...png",
    "fish": 4,
    "chest": 3
  }
  ```
- **Prepared for Laravel REST API Backend**: The services layer is engineered with standardized interfaces matching standard Laravel REST API conventions:
  - `GET /api/leaderboard` -> `leaderboardService.ts`
  - `POST /api/login` and `POST /api/register` -> `authService.ts`
  - `POST /api/scores` -> Submitting player achievements and coin updates.

### 4. Virtual Identity (Authentication, Cookies, Sessions)
- **Virtual Identity**: A digital persona (`OceanHero`, Level 3, 5,210 Score, 250 Coins) represents the player in the virtual ocean world.
- **Authentication Mechanisms**:
  - Sign-in and registration forms with validation and password visibility toggles.
  - Supports the lecture sample credentials (`username: Marc`, `password: hello26`) as demonstrated in `FishGame26/com/perisic/fish/peripherals/LoginData.java`.
  - Simulates token-based authentication (Bearer Tokens) and browser session cookies (`document.cookie = 'fish_escape_session=...'`) with `SameSite=Lax` security.
  - LocalStorage persistence guarantees session continuity across page reloads.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | Component-based interactive UI library |
| **TypeScript** | Type safety, autocompletion, and robust compile-time verification |
| **Vite 8** | Next-generation ultra-fast bundler and local dev server |
| **Tailwind CSS v4** | Modern utility-first styling and underwater gradient system |
| **React Router DOM v7** | Client-side routing across all game pages and authentication screens |
| **Lucide React** | High-performance vector iconography |
| **Web Audio API** | Procedural sound generation (no external audio files required) |
| **Canvas Confetti** | Celebration visual effects upon level-ups and puzzle victories |
| **Context API & LocalStorage** | Global state management and persistent player progression |

---

## 📁 Project Structure

```
d:/Laravel project/fish/
├── public/                     # Static assets (favicons, icons)
├── src/
│   ├── assets/                 # Brand graphics and logos
│   ├── components/
│   │   ├── common/             # Reusable UI (WoodenBanner, BubbleBackground, SharkCharacter, DiverBoyCharacter, SettingsModal)
│   │   └── navigation/         # TopHeader (Level, Coins, Settings) and BottomNav (5 tabs)
│   ├── context/
│   │   ├── AuthContext.tsx     # Virtual identity and authentication state
│   │   └── GameContext.tsx     # Central game state (coins, score, level, powerups, achievements)
│   ├── data/
│   │   ├── achievements.ts     # 5 official achievements with progress counters
│   │   ├── miniGames.ts        # Metadata and routes for all 5 mini-games
│   │   ├── quizQuestions.ts    # Marine trivia questions and explanations
│   │   └── treasures.ts        # Power-ups and collectible sunken relics
│   ├── games/
│   │   ├── FishCounting/       # Game 01: Live Fish API counting game
│   │   ├── MemoryMatch/        # Game 02: Ocean pairs card game
│   │   ├── OceanQuiz/          # Game 03: Marine life knowledge quiz
│   │   ├── SaveLittleFish/     # Game 04: Keyboard/Touch underwater maze
│   │   └── TreasureHunt/       # Game 05: Seabed mystery exploration
│   ├── layouts/
│   │   └── MainLayout.tsx      # Adaptive mobile/desktop container frame with view switcher
│   ├── pages/
│   │   ├── Home.tsx            # Landing page matching Figma hero layout
│   │   ├── Play.tsx            # Mini Games Hub grid
│   │   ├── Treasures.tsx       # Power-ups shop & treasure gallery
│   │   ├── Leaderboard.tsx     # Ocean Champions ranking list
│   │   ├── Profile.tsx         # Player stats, level, XP, and badges
│   │   ├── Achievements.tsx    # Comprehensive achievements checklist
│   │   ├── Login.tsx           # Authentication sign-in screen
│   │   └── Register.tsx        # Player registration screen
│   ├── services/
│   │   ├── authService.ts      # Virtual identity & cookie management
│   │   ├── fishApi.ts          # Official Fish Game REST API client
│   │   ├── leaderboardService.ts # High scores and global ranking provider
│   │   └── soundService.ts     # Web Audio API sound generator
│   ├── App.tsx                 # Main application router
│   ├── index.css               # Underwater theme, keyframes, and custom styles
│   └── main.tsx                # React DOM root entry point
├── FishGame26 (1)/             # Lecture reference Java implementation (provided by University)
├── package.json                # Project dependencies and npm scripts
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite bundler configuration with Tailwind plugin
```

---

## ⚡ How to Run the Project

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open your web browser and navigate to `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```
Creates an optimized production bundle inside the `dist/` directory.

### 4. Run Linter
```bash
npm run lint
```

---

## 🔮 Future Laravel Backend Integration Roadmap

When connecting this frontend to a Laravel backend with MySQL:
1. **API Endpoints**:
   - `POST /api/register` – Creates player user row in `users` table and issues Laravel Sanctum token.
   - `POST /api/login` – Validates credentials and returns Bearer Token.
   - `GET /api/user` – Returns authenticated player profile (level, coins, score).
   - `GET /api/leaderboard` – Queries top high scores from `scores` table.
   - `POST /api/scores` – Records game completion, awarded coins, and achievements.
   - `POST /api/purchases` – Validates coin deduction and unlocks power-ups inside database transactions.
2. **Database Schema**:
   - `users` (id, name, email, password, avatar, coins, level, xp, role)
   - `game_sessions` (id, user_id, game_type, score, duration, completed_at)
   - `user_powerups` (id, user_id, powerup_key, purchased_at)
   - `user_achievements` (id, user_id, achievement_key, unlocked_at)

---

## 📚 References & Acknowledgements
- **University of Bedfordshire** – CIS045-3 Distributed Service Architectures Assignment Brief.
- **Dr. Marc Conrad** – Official Fish Game API (`https://marcconrad.com/uob/fish/api.php` and `https://marcconrad.com/uob/fish/doc.php`).
- **Lucide Icons** – Modern open-source icons (`https://lucide.dev`).
- **Canvas Confetti** – Kiril Vatev (`https://github.com/catdad/canvas-confetti`).
- **Generative AI Attribution**: AI-assisted code generation (Google DeepMind Antigravity) was utilized for scaffolding UI templates, audio synthesis scripts, and TypeScript architectural structure in accordance with the unit assessment policy permitting generative AI for code implementation.
