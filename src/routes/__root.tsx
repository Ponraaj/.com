import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';

import Header from '../components/Header';
import { NotFoundPage } from '../components/NotFoundPage';

import appCss from '../styles.css?url';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'PonRaaj',
      },
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
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  loader: ({ context }) => {
    let theme = 'dark';
    const cookie = (context as any).request?.headers?.get('cookie');
    const match = cookie?.match(/theme=(dark|light)/);
    if (match) theme = match[1];
    return { theme };
  },
  notFoundComponent: NotFoundPage,
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const { theme } = Route.useLoaderData();
  return (
    <html lang="en" className={theme} suppressHydrationWarning={true}>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme={theme}>
          <Header />
          {children}
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
