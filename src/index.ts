import axios from 'axios';
import { decode } from 'html-entities';
import * as cheerio from 'cheerio';

export interface OpenGraphResult {
  url: string;
  raw: string | null;
  title: string;
  description: string;
  image: string | null;
  video: string | null;
  [key: string]: string | number | null;
}

export interface FetchHeaders {
  [key: string]: string;
}

export const metaTags: Record<string, string> = {
  title: 'title',
  description: 'description',
  // Basic metadata
  ogTitle: 'og:title',
  ogType: 'og:type',
  ogImage: 'og:image',
  ogUrl: 'og:url',
  // Optional metadata
  ogAudio: 'og:audio',
  ogDescription: 'og:description',
  ogDeterminer: 'og:determiner',
  ogLocale: 'og:locale',
  ogLocaleAlternate: 'og:locale:alternate',
  ogSiteName: 'og:site_name',
  ogVideo: 'og:video',
  // Structured Properties — images
  ogImageUrl: 'og:image:url',
  ogImageSecureUrl: 'og:image:secure_url',
  ogImageType: 'og:image:type',
  ogImageWidth: 'og:image:width',
  ogImageHeight: 'og:image:height',
  ogImageAlt: 'og:image:alt',
  // Structured Properties — video
  ogVideoSecureUrl: 'og:video:secure_url',
  ogVideoType: 'og:video:type',
  ogVideoWidth: 'og:video:width',
  ogVideoHeight: 'og:video:height',
  ogVideoUrl: 'og:video:url',
  // Structured Properties — audio
  ogAudioSecureUrl: 'og:audio:secure_url',
  ogAudioType: 'og:audio:type',
  // Social Networks
  twitterPlayer: 'twitter:player',
  twitterPlayerWidth: 'twitter:player:width',
  twitterPlayerHeight: 'twitter:player:height',
  twitterPlayerStream: 'twitter:player:stream',
  twitterCard: 'twitter:card',
  twitterDomain: 'twitter:domain',
  twitterUrl: 'twitter:url',
  twitterTitle: 'twitter:title',
  twitterDescription: 'twitter:description',
  twitterImage: 'twitter:image',
  // Article
  articlePublishedTime: 'article:published_time',
  articleModifiedTime: 'article:modified_time',
  articleExpirationTime: 'article:expiration_time',
  articleAuthor: 'article:author',
  articleSection: 'article:section',
  articleTag: 'article:tag',
  // Book
  bookAuthor: 'book:author',
  bookIsbn: 'book:isbn',
  bookReleaseDate: 'book:release_date',
  bookTag: 'book:tag',
  // Profile
  profileFirstName: 'profile:first_name',
  profileLastName: 'profile:last_name',
  profileUsername: 'profile:username',
  profileGender: 'profile:gender',
};

const metaTagValues = new Set(Object.values(metaTags).map(v => v.toLowerCase()));

export const queryParams = (str: string): Record<string, string> => {
  try {
    const parsed = new URL(str);
    const params: Record<string, string> = {};
    parsed.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  } catch {
    return {};
  }
};

export const fetchRaw = async (url: string, headers?: FetchHeaders): Promise<string> => {
  const parsed = new URL(url);
  const baseUrl = `${parsed.origin}${parsed.pathname}`;
  const params = queryParams(url);

  const response = await axios.get<string>(baseUrl, {
    params,
    headers: {
      'User-Agent': 'OpenGraph',
      'Cache-Control': 'no-cache',
      Accept: '*/*',
      Connection: 'keep-alive',
      ...headers,
    },
  });

  if (response.status >= 400) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.data;
};

export const fetch = async (
  url: string,
  headers?: FetchHeaders,
  includeRaw: boolean = false
): Promise<OpenGraphResult> => {
  const {
    ogUrl, ogType, ogTitle, ogDescription, ogImage,
    ogVideo, ogVideoWidth, ogVideoHeight, ogVideoUrl,
    twitterUrl, twitterTitle, twitterDescription, twitterImage,
  } = metaTags;

  try {
    const html = await fetchRaw(url, headers);
    const $ = cheerio.load(html);

    const siteTitle = $('title').first().text().trim();

    const og: Record<string, string | null> = {
      url,
      raw: includeRaw ? html : null,
    };

    $('meta').each((_, el) => {
      const name = ($(el).attr('property') || $(el).attr('name') || '').toLowerCase();
      const content = $(el).attr('content');

      if (name && content !== undefined && content !== 'undefined' && metaTagValues.has(name)) {
        og[name] = decode(content);
      }
    });

    // Image fallbacks
    og[ogImage] = og[ogImage] ?? null;
    og[metaTags.twitterImage] = og[metaTags.twitterImage] ?? og[ogImage];
    og.image = og[ogImage] ?? null;

    // Video fallbacks
    og.video = og[ogVideo] ?? og[ogVideoUrl] ?? null;
    if (og.video) {
      og[ogVideoWidth] = og[ogVideoWidth] ?? '560';
      og[ogVideoHeight] = og[ogVideoHeight] ?? '340';
    }

    // URL fallbacks
    og[ogUrl] = og[ogUrl] ?? url;
    og[twitterUrl] = og[twitterUrl] ?? og[ogUrl];
    og.url = url;

    // Description fallbacks
    og[ogDescription] = og[ogDescription] ?? og[metaTags.description] ?? null;
    og[twitterDescription] = og[twitterDescription] ?? og[ogDescription];
    og.description = og[ogDescription] ?? '';

    // Title fallbacks
    og[ogTitle] = og[ogTitle] ?? siteTitle;
    og[twitterTitle] = og[twitterTitle] ?? og[ogTitle];
    og.title = og[ogTitle]!;

    // Type fallback
    og[ogType] = og[ogType] ?? 'website';

    return og as OpenGraphResult;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = (error as { status?: number }).status ?? 400;

    throw {
      message,
      status,
      error,
      title: '',
      description: '',
      [ogUrl]: url,
      [ogType]: 'website',
      [ogTitle]: '',
      [ogDescription]: '',
      [ogImage]: '',
      [metaTags.twitterCard]: '',
      [metaTags.twitterDomain]: '',
      [twitterUrl]: url,
      [twitterTitle]: '',
      [twitterDescription]: '',
      [twitterImage]: '',
    };
  }
};

export default {
  fetch,
  fetchRaw,
};
