/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {}
}

interface Env {
  ASSETS: Fetcher;
  IMAGES?: ImagesBinding;
  VIEWS?: KVNamespace;
  DB?: D1Database;
  POST_LIKES?: DurableObjectNamespace;
}
