import { env } from './env';

export const SITE_URL = env.NEXT_PUBLIC_BASE_URL;

export const SEO_DEFAULTS = {
  siteName: 'Learning Objects Repository | RMIT University Library',
  description: 'Browse and search digital learning resources.',
  image: `${SITE_URL}/images/og-default.jpg`,
  twitterHandle: '@RMIT',
  locale: 'en_AU',
};