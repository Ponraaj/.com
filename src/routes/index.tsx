import { Link, createFileRoute } from '@tanstack/react-router';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';
import { getAllBlogPosts } from '../data/blog-posts';
import { PostCard } from '../components/PostCard';

export const Route = createFileRoute('/')({
  component: HomePage,
  loader: () => getAllBlogPosts().slice(0, 3),
  head: () => ({
    title: 'Pon Raaj',
    meta: [
      {
        name: 'description',
        content: 'Just a dev trying to be better',
      },
      {
        property: 'og:title',
        content: 'Pon Raaj',
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
        content: '/images/cover.png',
      },
      {
        name: 'twitter:image',
        content: '/images/cover.png',
      },
    ],
  }),
});

function HomePage() {
  const posts = Route.useLoaderData();

  return (
    <div className="min-h-screen page-bg">
      {/* Hero Section */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl mb-6 text-foreground font-light tracking-tight">
            Pon Raaj V
          </h1>
          <p className="text-lg text-subtle leading-relaxed mb-8">
            I'm a software developer based in Chennai, India. I enjoy building
            robust and scalable web applications that are both functional and
            thoughtfully designed.
          </p>
          <div className="flex gap-6 text-sm">
            <Link
              to="/about"
              className="relative group text-foreground hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-300"
            >
              <span className="relative">
                About
                <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-blue-700 dark:bg-blue-400 transition-all duration-300 ease-out group-hover:w-full"></span>
              </span>
            </Link>
            <Link
              to="/blog"
              className="relative group text-foreground hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-300"
            >
              <span className="relative">
                Writing
                <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-blue-700 dark:bg-blue-400 transition-all duration-300 ease-out group-hover:w-full"></span>
              </span>
            </Link>
          </div>
          <div className="flex flex-wrap gap-4 sm:gap-6 mt-8">
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
      </section>

      {/* Latest Posts Section */}
      <section className="pb-32 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl mb-12 text-foreground font-light">
            Recent posts
          </h2>

          <div className="space-y-16">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          <div className="mt-16 pt-12 border-t border-border">
            <Link
              to="/blog"
              className="relative group text-foreground hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-300 text-sm inline-block"
            >
              <span className="relative">
                All posts →
                <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-blue-700 dark:bg-blue-400 transition-all duration-300 ease-out group-hover:w-full"></span>
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
