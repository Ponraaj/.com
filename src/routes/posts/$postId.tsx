import { Link, createFileRoute } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight, Copy, Home } from 'lucide-react';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  getBlogPost,
  getNextPost,
  getPreviousPost,
} from '../../data/blog-posts';

export const Route = createFileRoute('/posts/$postId')({
  component: BlogPost,
  loader: ({ params, context }) => {
    const post = getBlogPost(params.postId);
    if (!post) {
      throw new Error('Post not found');
    }
    const previousPost = getPreviousPost(params.postId);
    const nextPost = getNextPost(params.postId);

    // Extract theme from cookie for SSR
    let initialTheme = 'light';
    const cookie = (context as any)?.request?.headers?.get('cookie');
    const match = cookie?.match(/theme=(dark|light)/);
    if (match) initialTheme = match[1];

    return { post, previousPost, nextPost, initialTheme };
  },
  head: ({ loaderData }) => ({
    title: `${loaderData?.post.title} — Pon Raaj V`,
    meta: [
      {
        name: 'description',
        content: loaderData?.post.excerpt,
      },
      {
        name: 'author',
        content: 'Pon Raaj',
      },
      {
        name: 'keywords',
        content: `Pon Raaj, ${loaderData?.post.tags.join(', ')}, blog post`,
      },
      {
        property: 'og:title',
        content: `${loaderData?.post.title} — Pon Raaj`,
      },
      {
        property: 'og:description',
        content: loaderData?.post.excerpt,
      },
      {
        property: 'og:image',
        content: loaderData?.post.image,
      },
      {
        property: 'og:type',
        content: 'article',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: loaderData?.post.title,
      },
      {
        name: 'twitter:description',
        content: loaderData?.post.excerpt,
      },
      {
        name: 'twitter:image',
        content: loaderData?.post.image,
      },
    ],
  }),
});

function BlogPost() {
  const { post, previousPost, nextPost, initialTheme } = Route.useLoaderData();
  const [readingProgress, setReadingProgress] = useState(0);
  const [currentTheme, setCurrentTheme] = useState(initialTheme);

  useEffect(() => {
    const htmlElement = document.documentElement;
    const observer = new MutationObserver(() => {
      const theme = htmlElement.classList.contains('dark') ? 'dark' : 'light';
      setCurrentTheme(theme);
    });

    const theme = htmlElement.classList.contains('dark') ? 'dark' : 'light';
    setCurrentTheme(theme);

    observer.observe(htmlElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateReadingProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setReadingProgress(scrollPercent);
    };

    window.addEventListener('scroll', updateReadingProgress);
    return () => window.removeEventListener('scroll', updateReadingProgress);
  }, []);

  const isDark = currentTheme === 'dark';

  return (
    <main className="min-h-screen page-bg">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-muted z-50">
        <div
          className="h-full bg-primary transition-all duration-150 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>
      <article className="max-w-4xl mx-auto px-6 py-32">
        <header className="mb-12">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-64 md:h-80 object-cover rounded-lg mb-8"
            style={{ viewTransitionName: `post-image-${post.id}` }}
          />
          <h1 className="text-5xl md:text-6xl mb-6 text-foreground font-light tracking-tight leading-tight">
            {post.title}
          </h1>
          <div className="text-subtle border-b border-border pb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <span className="text-sm">By {post.author}</span>
                <span className="text-sm text-subtle">·</span>
                <span className="text-sm">{post.readTime} min read</span>
              </div>
              <time dateTime={post.publishedAt} className="text-sm">
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
            {/* Tags */}
            <div className="flex flex-wrap gap-4">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="text-xs text-subtle uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        <div className="prose prose-lg prose-stone dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                const codeString = String(children).replace(/\n$/, '');

                return !inline && match ? (
                  <div className="relative group my-6">
                    <div className="flex justify-between items-center px-4 py-2 text-sm font-mono rounded-t-lg bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                      <span>{match[1]}</span>
                      <CopyToClipboard text={codeString}>
                        <button
                          className="transition-colors text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                          aria-label="Copy code"
                        >
                          <Copy size={16} />
                        </button>
                      </CopyToClipboard>
                    </div>
                    <div className="[&>pre]:!mt-0 [&>pre]:!rounded-t-none dark:[&>pre]:!bg-[#282c34] [&>pre]:!bg-[#fafafa]">
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{
                          margin: 0,
                          borderTopLeftRadius: 0,
                          borderTopRightRadius: 0,
                        }}
                        codeTagProps={{
                          style: {
                            color: isDark ? undefined : '#24292e',
                            fontFamily:
                              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                          },
                        }}
                        {...props}
                      >
                        {codeString}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col sm:flex-row items-center justify-between mt-16 pt-8 border-t border-border gap-6 sm:gap-4">
          <div className="flex-1 min-w-0 w-full sm:w-auto">
            {previousPost ? (
              <Link
                to="/posts/$postId"
                params={{ postId: previousPost.id }}
                className="group inline-flex items-center gap-3 text-subtle hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-300"
              >
                <ChevronLeft className="w-5 h-5 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm uppercase tracking-wide">
                    Previous
                  </div>
                  <div
                    className="relative font-medium truncate"
                    style={{
                      viewTransitionName: `post-title-${previousPost.id}`,
                    }}
                  >
                    <span className="relative">
                      {previousPost.title}
                      <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-blue-700 dark:bg-blue-400 transition-all duration-300 ease-out group-hover:w-full"></span>
                    </span>
                  </div>
                </div>
              </Link>
            ) : (
              <div />
            )}
          </div>

          <Link
            to="/"
            className="text-subtle hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-300 order-3 sm:order-2"
          >
            <Home className="w-4 h-4" />
          </Link>

          <div className="flex-1 min-w-0 w-full sm:w-auto text-right order-2 sm:order-3">
            {nextPost ? (
              <Link
                to="/posts/$postId"
                params={{ postId: nextPost.id }}
                className="group inline-flex items-center justify-end gap-3 text-subtle hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-300"
              >
                <div className="min-w-0 text-right">
                  <div className="text-sm uppercase tracking-wide">Next</div>
                  <div
                    className="relative font-medium truncate"
                    style={{ viewTransitionName: `post-title-${nextPost.id}` }}
                  >
                    <span className="relative">
                      {nextPost.title}
                      <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-blue-700 dark:bg-blue-400 transition-all duration-300 ease-out group-hover:w-full"></span>
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 flex-shrink-0" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </nav>
      </article>
    </main>
  );
}
