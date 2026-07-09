#  Fintech Elite: Personal Financial Behavior Analysis System

A state-of-the-art Personal Financial Behavior Analysis System designed with a premium, glassmorphic user interface. The platform empowers users to monitor their transactions, visualize spending patterns, simulate loans, convert currencies, and receive AI-powered financial advisory recommendations.

---

##  Core Features

*   **Premium Glassmorphic Dashboard**: A fully responsive dark-theme interface with visual graphs showing income, expense, and category breakdowns.
*   **Targeted Portfolios (Symmetrical Grid)**: Tailored entrance categories designed for **Professionals, Companies, Diaspora, Farmers, Students, and Merchants** in a balanced 3x2 grid with interactive hover animations.
*   **AI Financial Advisor**: An interactive chat interface that analyzes the user's spending data and provides smart savings advice. (Supports OpenAI API with automatic rule-based local fallbacks).
*   **Interactive Loan Calculator**: Estimates monthly repayments (calculable in months or years) with built-in financial safety guardrails (e.g. restricts new expenses once the balance hits 0).
*   **Global Currency Exchange**: Real-time conversions from Rwandan Francs (RWF) to USD, EUR, GBP, and KES.

---

##  Technology Stack

| Component | Technology | Key Features |
| :--- | :--- | :--- |
| **Frontend** | Next.js (React 19) | Framer Motion animations, Recharts, Custom Glassmorphic CSS |
| **Backend** | Django & Django REST Framework | RESTful APIs, Django Admin Panel, Custom rule-based advisory algorithms |
| **Database** | SQLite | Lightweight, relational data storage |
| **AI Integration** | OpenAI / Rule-Based Fallback | Behavior analysis chatbot & spending pattern tracking |

---

##  Project Directory Structure

```text
fintech-project/
├── backend/                  # Django Python Backend
│   ├── api/                  # API Views, Serializers, Models & Rule logic
│   ├── fintech_backend/      # Main Django project configuration settings
│   ├── db.sqlite3            # Local SQLite database
│   ├── manage.py             # Django CLI manager
│   ├── requirements.txt      # Python dependencies
│   └── venv/                 # Python virtual environment (ignored by Git)
├── frontend/                 # Next.js React Frontend
│   ├── public/               # Static assets & images
│   ├── src/
│   │   ├── components/       # UI Components (Cards, LoanCalculator, Navbar, etc.)
│   │   ├── pages/            # Application views (Dashboard, Chat, Analytics)
│   │   └── styles/           # Globals and premium theme stylesheets
│   ├── package.json          # Node scripts and dependencies
│   └── next.config.ts        # Next.js configurations
└── .gitignore                # Global ignore file for build & dependency caches
```

---

##  How to Setup and Run the Project

Ensure you have **Python 3** and **Node.js** installed on your system before proceeding.

### 1️ Terminal 1: Run the Django Backend

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Activate the virtual environment (`venv`):
   *   **On PowerShell (Windows default):**
       ```powershell
       .\venv\Scripts\Activate.ps1
       ```
   *   **On Command Prompt (CMD):**
       ```cmd
       .\venv\Scripts\activate.bat
       ```
   *   **On Git Bash / macOS / Linux:**
       ```bash
       source venv/Scripts/activate
       ```
3. Install dependencies and run migrations (only needed if running for the first time):
   ```bash
   pip install -r requirements.txt
   python manage.py makemigrations
   python manage.py migrate
   ```
4. Start the Django server:
   ```bash
   python manage.py runserver
   ```
   *   The backend API runs at: **`http://127.0.0.1:8000`**
   *   The Django admin dashboard is at: **`http://127.0.0.1:8000/admin`**

---

### 2️ Terminal 2: Run the Next.js Frontend

1. Open a new terminal window/tab and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies (only needed if running for the first time):
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *   The frontend app runs at: **`http://localhost:3000`**

---

##  How to Stop the Servers

*   In both terminals, press **`Ctrl + C`** on your keyboard to terminate the running processes.
*   If a process hangs, you can force kill them:
    *   **Python (Backend):** `taskkill /f /im python.exe`
    *   **Node (Frontend):** `taskkill /f /im node.exe`
