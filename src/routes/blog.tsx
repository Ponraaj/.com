import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { getAllBlogPosts } from '../data/blog-posts';
import { PostCard } from '../components/PostCard';

export const Route = createFileRoute('/blog')({
  component: BlogPage,
  loader: () => ({ posts: getAllBlogPosts() }),
  head: () => ({
    title: 'Blogs',
    meta: [
      {
        name: 'description',
        content: 'Just some thoughts and scribblings',
      },
      {
        name: 'author',
        content: 'Pon Raaj',
      },
      {
        name: 'keywords',
        content: 'Pon Raaj,Pon Raaj V, blog, development ',
      },
      {
        property: 'og:title',
        content: 'Blog',
      },
      {
        property: 'og:description',
        content: 'Just some thoughts and scribblings',
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

function BlogPage() {
  const { posts } = Route.useLoaderData();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;

    const query = searchQuery.toLowerCase();
    return posts.filter((post: any) => {
      const titleMatch = post.title.toLowerCase().includes(query);
      const excerptMatch = post.excerpt.toLowerCase().includes(query);
      const contentMatch = post.content.toLowerCase().includes(query);
      const tagsMatch = post.tags.some((tag: string) =>
        tag.toLowerCase().includes(query),
      );

      return titleMatch || excerptMatch || contentMatch || tagsMatch;
    });
  }, [posts, searchQuery]);

  return (
    <div className="min-h-screen page-bg">
      <div className="max-w-3xl mx-auto px-6 py-32">
        {/* Page Header */}
        <header className="mb-24">
          <h1 className="text-5xl md:text-6xl mb-6 text-foreground font-light tracking-tight">
            Blog
          </h1>
          <p className="text-lg text-subtle leading-relaxed">
            Thoughts on technology, development, and life
          </p>
        </header>

        {/* Search Bar */}
        <div className="mb-20">
          <div className="relative max-w-md mx-auto md:mx-0">
            <Search className="absolute left-0 top-1/2 transform -translate-y-1/2 text-subtle w-4 h-4" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-4 py-2 bg-transparent border-b border-subtle/30 text-foreground placeholder-subtle/60 focus:outline-none focus:border-foreground transition-colors"
            />
          </div>
        </div>

        {/* Results Count */}
        {searchQuery && (
          <div className="mb-16">
            <p className="text-sm text-subtle text-center md:text-left">
              {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}{' '}
              found
            </p>
          </div>
        )}

        {/* Blog Posts */}
        <div className="space-y-16">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <div className="py-20 text-center">
              <p className="text-subtle text-lg">
                No posts found matching "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
