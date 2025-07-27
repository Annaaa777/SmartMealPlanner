import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import MealPlanPage from './pages/MealPlanPage';
import RecipePage from './pages/RecipePage';
import SuggestionPage from './pages/SuggestionPage';
import { fetchMoreRecipes } from './services/api';

function App() {
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [refreshRecipes, setRefreshRecipes] = useState(false); // ✅ For auto-refresh after fetch

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full bg-blue-600 dark:bg-gray-800 text-white flex flex-col justify-between p-6 z-40 transform transition-all duration-300 ease-in-out ${
            isSidebarOpen ? 'w-64' : 'w-20'
          }`}
        >
          <div>
            <h1
              className={`text-2xl font-bold mb-10 transition-opacity duration-300 ${
                isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden'
              }`}
            >
              Smart Meal Planner
            </h1>
            <nav className="space-y-4">
              <SidebarLink to="/" icon="🏠" text="Dashboard" isOpen={isSidebarOpen} />
              <SidebarLink to="/meal-planner" icon="🍽" text="Meal Planner" isOpen={isSidebarOpen} />
              <SidebarLink to="/recipes" icon="📖" text="Recipes" isOpen={isSidebarOpen} />
              <SidebarLink to="/suggestions" icon="🤔" text="What Can I Make?" isOpen={isSidebarOpen} />
            </nav>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="btn btn-accent mt-6 w-full"
          >
            {darkMode ? '☀ Light' : '🌙 Dark'}
          </button>
        </aside>

        {/* Main Content */}
        <div
          className="flex-1 flex flex-col"
          style={{ marginLeft: isSidebarOpen ? '16rem' : '5rem', transition: 'margin-left 0.3s ease-in-out' }}
        >
          {/* Header */}
          <header className="bg-blue-600 dark:bg-gray-800 text-white px-4 py-3 flex justify-between items-center shadow">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-2xl">
              ☰
            </button>
            <h1 className="text-lg font-semibold">Smart Meal Planner</h1>
          </header>

          {/* Pages */}
          <main className="flex-1 p-8 overflow-y-auto">
            <AnimatedRoutes refreshRecipes={refreshRecipes} setRefreshRecipes={setRefreshRecipes} />
          </main>
        </div>
      </div>
    </Router>
  );
}

/* Sidebar Link Component */
function SidebarLink({ to, icon, text, isOpen }) {
  return (
    <Link to={to} className="flex items-center gap-3 hover:text-yellow-300 transition text-lg">
      <span>{icon}</span>
      {isOpen && <span>{text}</span>}
    </Link>
  );
}

/* Animated Routes Component */
function AnimatedRoutes({ refreshRecipes, setRefreshRecipes }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageWrapper>
              <DashboardHome setRefreshRecipes={setRefreshRecipes} />
            </PageWrapper>
          }
        />
        <Route
          path="/meal-planner"
          element={
            <PageWrapper>
              <MealPlanPage />
            </PageWrapper>
          }
        />
        <Route
          path="/recipes"
          element={
            <PageWrapper>
              <RecipePage refreshRecipes={refreshRecipes} setRefreshRecipes={setRefreshRecipes} />
            </PageWrapper>
          }
        />
        <Route
          path="/suggestions"
          element={
            <PageWrapper>
              <SuggestionPage />
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

/* Page Animation Wrapper */
function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}

/* Dashboard with Fetch Recipes Button */
function DashboardHome({ setRefreshRecipes }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFetchRecipes = async () => {
    try {
      setLoading(true);
      setMessage('');
      const result = await fetchMoreRecipes(10);
      setMessage(result.message);
      setRefreshRecipes(true); // Triggers RecipeList refresh
    } catch (error) {
      setMessage('❌ Error fetching recipes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-4xl font-extrabold text-blue-700 dark:text-blue-400 mb-10">
        Welcome to Your Dashboard
      </h2>

      <div className="mb-8">
        <button onClick={handleFetchRecipes} disabled={loading} className="btn btn-primary">
          {loading ? 'Fetching...' : 'Fetch More Recipes'}
        </button>
        {message && <p className="mt-2 text-green-600">{message}</p>}
      </div>

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <DashboardCard title="Quick Start" text="Plan your meals based on your budget and nutrition goals." btnText="Start Planning" link="/meal-planner" color="primary" />
        <DashboardCard title="Manage Recipes" text="Add, edit, and organize your recipes in one place." btnText="Go to Recipes" link="/recipes" color="secondary" />
        <DashboardCard title="Ingredient Suggestions" text="Find what you can make with the ingredients you already have." btnText="Get Suggestions" link="/suggestions" color="accent" />
      </section>
    </div>
  );
}

/* Dashboard Card Component */
function DashboardCard({ title, text, btnText, link, color }) {
  return (
    <div className="card flex flex-col justify-between h-full transform hover:-translate-y-2 hover:shadow-xl transition duration-300">
      <div>
        <h3 className="heading mb-2">{title}</h3>
        <p className="text-body mb-4">{text}</p>
      </div>
      <a href={link} className={`btn btn-${color} w-full mt-auto`}>
        {btnText}
      </a>
    </div>
  );
}

export default App;
