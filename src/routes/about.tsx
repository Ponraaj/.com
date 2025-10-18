import { createFileRoute } from '@tanstack/react-router';
import { ExternalLink, Github, Linkedin, Mail, Twitter } from 'lucide-react';

export const Route = createFileRoute('/about')({
  component: AboutPage,
  head: () => ({
    title: 'About',
    meta: [
      {
        name: 'description',
        content: 'Just a dev trying to be better',
      },
      {
        name: 'author',
        content: 'Pon Raaj',
      },
      {
        property: 'og:title',
        content: 'About',
      },
      {
        property: 'og:description',
        content: 'Just a dev trying to be better',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:image',
        content: '/cover.png',
      },
      {
        name: 'twitter:image',
        content: '/cover.png',
      },
    ],
  }),
});

function AboutPage() {
  return (
    <div className="min-h-screen page-bg">
      <div className="max-w-3xl mx-auto px-6 py-32">
        <h1 className="text-5xl md:text-6xl mb-6 text-foreground font-light tracking-tight">
          About
        </h1>

        <div className="space-y-16">
          {/* Intro */}
          <div className="space-y-6 text-lg leading-relaxed text-subtle">
            <p className="indent-4">
              I&apos;m Pon Raaj V, a software developer based in Chennai, India,
              currently working as a Software Engineering Intern at Cognizant
              with a focus on Generative AI.
            </p>
            <br />
            <p className="indent-4">
              I enjoy building robust and scalable web applications that are
              both functional and thoughtfully designed. My primary tools
              include Go, TypeScript, Python, and React, but I&apos;m always
              exploring new tools and approaches to solve complex problems.
            </p>
            <br />
            <p className="indent-4">
              When I&apos;m not coding, I enjoy contributing to open-source
              projects, participating in competitive programming contests, and
              leading workshops to help others learn about technology.
            </p>
          </div>

          {/* Skills */}
          <div>
            <h2 className="text-2xl font-light text-[#1d4ed8] dark:text-[#60a5fa] mb-6">
              Things I work with
            </h2>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-foreground">
              <span>Python</span>
              <span>Go</span>
              <span>JavaScript</span>
              <span>TypeScript</span>
              <span>C++</span>
              <span>SQL</span>
              <span>CSS</span>
              <span>TailwindCSS</span>
              <span>Bash</span>
              <span>ReactJS</span>
              <span>NextJS</span>
              <span>NodeJS</span>
              <span>Gin</span>
              <span>Langchain</span>
              <span>LangGraph</span>
              <span>Google&apos;s ADK</span>
              <span>HTMX</span>
              <span>Hugo</span>
              <span>Git</span>
              <span>Docker</span>
              <span>WebSockets</span>
              <span>WebRTC</span>
              <span>Redis</span>
              <span>Github Actions</span>
              <span>Unix</span>
              <span>NeoVim</span>
            </div>
          </div>

          {/* Experience */}
          <div>
            <h2 className="text-2xl font-light text-[#1d4ed8] dark:text-[#60a5fa] mb-6">
              Work
            </h2>
            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-foreground">
                    Software Engineering Intern (Generative AI)
                  </h3>
                  <span className="text-sm text-subtle">
                    July 2025 — Present
                  </span>
                </div>
                <p className="text-subtle leading-relaxed">
                  Implemented Multi-Agent Systems with frameworks like LangGraph
                  and Google&apos;s ADK. Engineered real-time Voice Agents using
                  OpenAI models through WebRTC for low-latency responses.
                </p>
              </div>
            </div>
          </div>

          {/* Projects */}
          <div>
            <h2 className="text-2xl font-light text-[#1d4ed8] dark:text-[#60a5fa] mb-6">
              Projects
            </h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-foreground mb-2">File-Share</h3>
                <p className="text-subtle leading-relaxed mb-3">
                  A peer-to-peer file sharing app using WebRTC data channels
                  with a minimal WebSocket server for signaling and a
                  chunk-based transfer system for large files.
                </p>
                <div className="flex gap-4 text-sm">
                  <a
                    href="https://github.com/Ponraaj/file-share"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group inline-flex items-center gap-1 text-foreground hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-300"
                  >
                    <span className="relative">
                      GitHub
                      <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-blue-700 dark:bg-blue-400 transition-all duration-300 ease-out group-hover:w-full"></span>
                    </span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              <div>
                <h3 className="text-foreground mb-2">D4C (Download Manager)</h3>
                <p className="text-subtle leading-relaxed mb-3">
                  A cross-platform desktop native download manager with pause,
                  resume, and cancel support, using Go-routines for concurrent
                  and faster chunk downloads.
                </p>
                <div className="flex gap-4 text-sm">
                  <a
                    href="https://github.com/Ponraaj/d4c"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group inline-flex items-center gap-1 text-foreground hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-300"
                  >
                    <span className="relative">
                      GitHub
                      <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-blue-700 dark:bg-blue-400 transition-all duration-300 ease-out group-hover:w-full"></span>
                    </span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              <div>
                <h3 className="text-foreground mb-2">Contest-Tracker</h3>
                <p className="text-subtle leading-relaxed mb-3">
                  A full-stack application to fetch and display college
                  students&apos; competitive programming data from LeetCode,
                  CodeChef, and Codeforces in real time.
                </p>
                <div className="flex gap-4 text-sm">
                  <a
                    href="https://github.com/Ponraaj/contest-tracker-be"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group inline-flex items-center gap-1 text-foreground hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-300"
                  >
                    <span className="relative">
                      GitHub
                      <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-blue-700 dark:bg-blue-400 transition-all duration-300 ease-out group-hover:w-full"></span>
                    </span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-2xl font-light text-[#1d4ed8] dark:text-[#60a5fa] mb-6">
              Connect
            </h2>
            <div className="flex flex-wrap gap-6 sm:gap-8">
              <a
                href="mailto:ponraajvetrivel@gmail.com"
                className="group flex items-center gap-2 text-foreground hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-300"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/PonraajV"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-foreground hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-300"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/Ponraaj"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-foreground hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-300"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/in/Ponraaj"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-foreground hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
