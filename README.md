FISH ESCAPE – UNDERWATER GAMING PLATFORM

> "Explore the Ocean. Play Smart. Collect Treasures!" 
> Educational Underwater Math Swimmer Game & Distributed Service Architecture  
> Developed for CIS045-3 Distributed Service Architectures (Assignment 1 Coursework) 
> University of Bedfordshire

---

 Overview & Visual Architecture
The user interface has been designed and implemented as an interactive, responsive web gaming platform:
Underwater Cartoon Theme: Dynamic water depth gradients, animated swimming lanes, surface caustics, floating bubbles, and distinct 3D environments (Olympic Swimming Pool, Arctic Ice Lagoon, Sunken Treasure Zone).
- Interactive Gameplay: Control the Scuba Swimmer across swimming lanes using keyboard arrows (`A`/`D` or `Left`/`Right`) and on-screen touch controls to collect target fishes and treasures while avoiding obstacles.
- Math Puzzle Challenge: Seamlessly connects to the external Marc Conrad Fish API to trigger interactive arithmetic and counting logic puzzles.
- Mobile-First Responsive Design: Full viewport responsiveness adapting gracefully to desktop, tablet, and mobile screens.

---

 🏛️ CIS045-3 Assignment Themes Reflection

 1. Software Design Principles (Low Coupling & High Cohesion)
- High Cohesion: Every module has a single, well-defined responsibility:
  - `src/services/fishApiService.ts`: Exclusively manages network communication, error handling, retry backoffs, and payload parsing for the external Fish Game API.
  - `src/services/soundService.ts`: Encapsulates procedural Web Audio API audio synthesis (bubbles, coins, splashes, level fanfares) without cluttering game presentation logic.
  - `src/services/authService.ts`: Handles player virtual identity, local credential validation, and session management.
  - `src/components/game/EnvironmentManager.ts`: Centralizes environment configurations, obstacle tables, and thematic definitions.
- Low Coupling: The game presentation components never execute raw `fetch()` calls or couple directly to third-party endpoints. Communication flows through dedicated service abstractions, making the backend swappable with a Laravel REST API.

2. Event-Driven Programming
The application operates on an asynchronous, event-driven model:
- User Input Events: Keyboard listener hooks (`keydown`), touch inputs, and on-click events drive real-time player lane navigation and puzzle submissions.
- Tick & Loop Events: `requestAnimationFrame` and interval ticks handle real-time physics, floating collision detection, and obstacle velocity.
- Asynchronous Lifecycle Events: React hooks (`useEffect`) listen for countdown timers, asynchronous REST API fetches, and round completion state triggers.

3. Interoperability & External Web Services
- External Web Service Integration: The platform interoperates directly with the official Fish Game API authored by Dr. Marc Conrad:
  - Endpoint: `https://marcconrad.com/uob/fish/api.php?out=json`
- Data Exchange Protocol: Asynchronous HTTP GET requests consuming standardized JSON payloads containing puzzle images and verification answers.
- Architectural Readiness for Laravel Backend: Standardized service contracts match enterprise REST API conventions (`/api/login`, `/api/scores`, `/api/leaderboard`).

4. Virtual Identity & State Persistence
- Virtual Identity: A digital persona (`OceanHero`) tracks player progression, high scores, coins, and achievement trophies.
- Authentication & Security: Local session storage and secure state providers simulate token authentication while maintaining uninterrupted player progress across browser sessions.

---

Technology Stack

| Technology | Purpose |
|------------|---------|
| React 19 | Component-based interactive UI library |
| TypeScript | Type safety, autocompletion, and robust compile-time verification |
| Vite 8| High-performance modern bundler and development server |
| Tailwind CSS v4 | Modern utility-first styling and responsive design |
| Lucide React| Scalable vector iconography |
| Web Audio API | Procedural sound generation without heavy media assets |
| Canvas Confetti | Visual celebration particle effects upon victories |

---

 How to Run the Project Locally

 1. Install Dependencies
```bash
npm install
```

2. Start Development Server
```bash
npm run dev
```
Navigate to `http://localhost:5173` in your web browser.

3. Build for Production
```bash
npm run build
```

---

References & Acknowledgements
- University of Bedfordshire – CIS045-3 Distributed Service Architectures Assignment Brief.
- Dr. Marc Conrad – Official Fish Game API (`https://marcconrad.com/uob/fish/api.php`).
- Lucide Icons – Modern open-source icons (`https://lucide.dev`).
