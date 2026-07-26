import { handle } from '@astrojs/cloudflare/handler';
import { DurableObject } from 'cloudflare:workers';

export class PostLikes extends DurableObject<Env> {
  private sql: SqlStorage | undefined;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    this.sql = ctx.storage.sql;
    this.sql.exec(
      `CREATE TABLE IF NOT EXISTS likes (
        visitor_id TEXT PRIMARY KEY,
        created_at INTEGER NOT NULL
      )`
    );
  }

  private getCount(): number {
    const row = this.sql!.exec('SELECT COUNT(*) as count FROM likes').one() as {
      count: number;
    };
    return row.count;
  }

  private isLiked(visitorId: string): boolean {
    const rows = this.sql!
      .exec('SELECT 1 FROM likes WHERE visitor_id = ?', visitorId)
      .toArray();
    return rows.length > 0;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'GET') {
      const visitorId = url.searchParams.get('visitorId') || '';
      return Response.json({
        count: this.getCount(),
        liked: visitorId ? this.isLiked(visitorId) : false,
      });
    }

    if (request.method === 'POST') {
      const body = (await request.json()) as {
        visitorId: string;
        action: 'like' | 'unlike';
      };

      if (body.action === 'like') {
        this.sql!
          .exec(
            'INSERT OR IGNORE INTO likes (visitor_id, created_at) VALUES (?, ?)',
            body.visitorId,
            Date.now()
          );
      } else if (body.action === 'unlike') {
        this.sql!
          .exec('DELETE FROM likes WHERE visitor_id = ?', body.visitorId);
      }

      return Response.json({
        count: this.getCount(),
        liked:
          body.action === 'like'
            ? this.isLiked(body.visitorId)
            : false,
      });
    }

    return new Response('Method not allowed', { status: 405 });
  }
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    return handle(request, env, ctx);
  },
} satisfies ExportedHandler<Env>;
