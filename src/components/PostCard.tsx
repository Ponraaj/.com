import { Link } from '@tanstack/react-router';
import { Card } from './ui/card';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  image?: string;
  readTime: number;
  tags: Array<string>;
}

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="border-0 shadow-none bg-transparent">
      <Link
        to="/posts/$postId"
        params={{ postId: post.id }}
        className="group block"
      >
        {post.image && (
          <div className="mb-4 overflow-hidden rounded-lg">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-64 object-cover rounded-lg transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              style={{ viewTransitionName: `post-image-${post.id}` }}
            />
          </div>
        )}
        <div className="flex items-center gap-3 text-sm text-subtle mb-3">
          <time>
            {new Date(post.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <span>·</span>
          <span>{post.readTime} min read</span>
        </div>
        <h3
          className="text-3xl md:text-4xl mb-4 text-foreground font-light tracking-tight group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors duration-300"
          style={{ viewTransitionName: `post-title-${post.id}` }}
        >
          <span className="relative">
            {post.title}
            <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-blue-700 dark:bg-blue-400 transition-all duration-300 ease-out group-hover:w-full"></span>
          </span>
        </h3>
        <p className="text-subtle leading-relaxed">{post.excerpt}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-4">
          {post.tags.map((tag: string) => (
            <span
              key={tag}
              className="text-xs text-subtle uppercase tracking-wider transition-colors duration-300 group-hover:text-blue-700 dark:group-hover:text-blue-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </Link>
    </Card>
  );
}
