import { Link } from '@tanstack/react-router';

import { useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      <header className="py-6 px-4 border-b border-subtle header-bg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="text-xl hover:opacity-70 transition-opacity text-foreground"
          >
            Pon Raaj V
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-8">
              <Link
                to="/"
                activeProps={{
                  className: 'text-primary',
                }}
                className="relative group text-subtle hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-300 text-base"
              >
                <span className="relative">
                  Home
                  <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-blue-700 dark:bg-blue-400 transition-all duration-300 ease-out group-hover:w-full"></span>
                </span>
              </Link>
              <Link
                to="/blog"
                activeProps={{
                  className: 'text-primary',
                }}
                className="relative group text-subtle hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-300 text-base"
              >
                <span className="relative">
                  Blog
                  <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-blue-700 dark:bg-blue-400 transition-all duration-300 ease-out group-hover:w-full"></span>
                </span>
              </Link>
              <Link
                to="/about"
                activeProps={{
                  className: 'text-primary',
                }}
                className="relative group text-subtle hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-300 text-base"
              >
                <span className="relative">
                  About
                  <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-blue-700 dark:bg-blue-400 transition-all duration-300 ease-out group-hover:w-full"></span>
                </span>
              </Link>
            </nav>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="text-subtle hover:text-foreground transition-colors"
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'light' ? (
                <Moon size={20} />
              ) : (
                <Sun size={20} />
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="text-subtle hover:text-foreground transition-colors"
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'light' ? (
                <Moon size={20} />
              ) : (
                <Sun size={20} />
              )}
            </button>
            <button
              onClick={() => setIsOpen(true)}
              className="text-subtle hover:text-foreground transition-colors"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <aside
        className={`fixed top-0 left-0 h-full w-full header-bg z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-subtle">
          <span className="text-base text-foreground">Navigation</span>
          <button
            onClick={() => setIsOpen(false)}
            className="text-subtle hover:text-foreground transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col p-6 space-y-6">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            activeProps={{
              className: 'text-primary',
            }}
            className="relative group text-lg text-foreground hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-300"
          >
            <span className="relative">
              Home
              <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-blue-700 dark:bg-blue-400 transition-all duration-300 ease-out group-hover:w-full"></span>
            </span>
          </Link>
          <Link
            to="/blog"
            onClick={() => setIsOpen(false)}
            activeProps={{
              className: 'text-primary',
            }}
            className="relative group text-lg text-foreground hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-300"
          >
            <span className="relative">
              Blog
              <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-blue-700 dark:bg-blue-400 transition-all duration-300 ease-out group-hover:w-full"></span>
            </span>
          </Link>
          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            activeProps={{
              className: 'text-primary',
            }}
            className="relative group text-lg text-foreground hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-300"
          >
            <span className="relative">
              About
              <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-blue-700 dark:bg-blue-400 transition-all duration-300 ease-out group-hover:w-full"></span>
            </span>
          </Link>
        </nav>
      </aside>
    </>
  );
}
