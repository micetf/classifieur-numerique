import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";

// Importation des pages
import History from "./pages/History";
import Settings from "./pages/Settings";
import Home from "./pages/Home";

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <Router>
            <div className="min-h-screen bg-gray-100">
                {/* Header */}
                <header className="bg-education-700 shadow-md">
                    <div className="mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex">
                                {/* Logo */}
                                <div className="flex-shrink-0 flex items-center">
                                    <button
                                        className="md:hidden text-white focus:outline-none"
                                        onClick={toggleSidebar}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 6h16M4 12h16M4 18h16"
                                            />
                                        </svg>
                                    </button>
                                    <svg
                                        className="h-8 w-8 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                        <path d="M10 12L8 14l2 2m4-4l2 2-2 2"></path>
                                    </svg>
                                    <span className="ml-2 text-xl font-bold text-white hidden sm:block">
                                        ClassifieurCPC
                                    </span>
                                </div>

                                {/* Navigation principale - visible sur les grands écrans */}
                                <nav className="hidden md:ml-6 md:flex md:space-x-4">
                                    <Link
                                        to="/"
                                        className="text-white hover:bg-education-600 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Accueil
                                    </Link>
                                    <Link
                                        to="/history"
                                        className="text-education-200 hover:bg-education-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Historique
                                    </Link>
                                    <Link
                                        to="/settings"
                                        className="text-education-200 hover:bg-education-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Paramètres
                                    </Link>
                                </nav>
                            </div>

                            {/* Informations utilisateur */}
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <span className="text-sm font-medium text-white">
                                        CPC-NE Ardèche
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Sidebar mobile */}
                <div
                    className={`fixed inset-0 z-40 md:hidden ${isSidebarOpen ? "block" : "hidden"}`}
                    onClick={toggleSidebar}
                >
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
                    <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-education-800 shadow-xl">
                        <div className="flex flex-col h-full">
                            <div className="px-4 py-6 border-b border-education-600">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <svg
                                            className="h-8 w-8 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                            <polyline points="14 2 14 8 20 8"></polyline>
                                            <path d="M10 12L8 14l2 2m4-4l2 2-2 2"></path>
                                        </svg>
                                        <span className="ml-2 text-xl font-bold text-white">
                                            ClassifieurCPC
                                        </span>
                                    </div>
                                    <button
                                        className="text-white focus:outline-none"
                                        onClick={toggleSidebar}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <nav className="flex-1 px-2 py-4 space-y-1">
                                <Link
                                    to="/"
                                    className="block px-3 py-2 rounded-md text-white font-medium hover:bg-education-600"
                                    onClick={toggleSidebar}
                                >
                                    Accueil
                                </Link>
                                <Link
                                    to="/history"
                                    className="block px-3 py-2 rounded-md text-education-200 font-medium hover:bg-education-600 hover:text-white"
                                    onClick={toggleSidebar}
                                >
                                    Historique
                                </Link>
                                <Link
                                    to="/settings"
                                    className="block px-3 py-2 rounded-md text-education-200 font-medium hover:bg-education-600 hover:text-white"
                                    onClick={toggleSidebar}
                                >
                                    Paramètres
                                </Link>
                            </nav>

                            <div className="px-4 py-4 border-t border-education-600">
                                <p className="text-xs text-education-200">
                                    © 2025 - Académie de Grenoble
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contenu principal */}
                <main className="py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/history" element={<History />} />
                            <Route path="/settings" element={<Settings />} />
                        </Routes>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-white shadow-inner py-4 mt-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <p className="text-sm text-gray-500">
                                © 2025 ClassifieurCPC - CPC-NE Ardèche
                            </p>
                            <div className="mt-2 md:mt-0 text-sm text-gray-500">
                                <span>Version 1.0.0</span>
                                <span className="mx-2">|</span>
                                <a href="#" className="hover:text-gray-700">
                                    Mentions légales
                                </a>
                                <span className="mx-2">|</span>
                                <a href="#" className="hover:text-gray-700">
                                    Aide
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </Router>
    );
}

export default App;
