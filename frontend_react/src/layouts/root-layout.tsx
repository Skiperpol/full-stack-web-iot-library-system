import { Link, NavLink, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { FaBook, FaUsers, FaHome } from "react-icons/fa";

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-white text-black">
      <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 shadow-2xl border-b border-neutral-700/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link 
            to="/" 
            className="flex items-center gap-3 py-4 transition-all duration-300 hover:scale-105 group relative"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 to-blue-500/30 rounded-xl blur-md group-hover:blur-lg transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
              <div className="absolute inset-0 bg-white/10 rounded-xl blur-sm group-hover:bg-white/20 transition-all duration-300"></div>
              <img
                src="/src/assets/library-logo.png"
                alt="Logo biblioteki"
                className="h-14 w-14 sm:h-16 sm:w-16 relative z-10 rounded-xl shadow-lg group-hover:shadow-emerald-500/50 transition-all duration-300"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-blue-400 transition-all duration-300">
                System Biblioteczny
              </span>
              <span className="text-xs sm:text-sm text-neutral-400 hidden sm:block group-hover:text-neutral-300 transition-colors">
                Zarządzanie biblioteką IoT
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-3">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `relative flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group ${
                  isActive
                    ? "bg-gradient-to-r from-white/15 to-white/10 text-white shadow-lg shadow-white/20 scale-105"
                    : "text-neutral-300 hover:text-white hover:bg-white/10 hover:scale-105"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <FaHome className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="hidden sm:inline">Strona główna</span>
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-xl"></div>
                  )}
                </>
              )}
            </NavLink>

            <NavLink
              to="/books"
              className={({ isActive }) =>
                `relative flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/40 scale-105"
                    : "text-neutral-300 hover:text-emerald-400 hover:bg-emerald-500/15 hover:scale-105"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <FaBook className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="hidden sm:inline">Książki</span>
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-transparent rounded-xl"></div>
                  )}
                </>
              )}
            </NavLink>

            <NavLink
              to="/clients"
              className={({ isActive }) =>
                `relative flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/40 scale-105"
                    : "text-neutral-300 hover:text-blue-400 hover:bg-blue-500/15 hover:scale-105"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <FaUsers className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="hidden sm:inline">Użytkownicy</span>
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent rounded-xl"></div>
                  )}
                </>
              )}
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-full bg-gradient-to-br from-neutral-50 to-neutral-100 px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
        <ToastContainer
          position="top-center"
          autoClose={3000}
          aria-label={undefined}
        />
      </main>
    </div>
  );
}
