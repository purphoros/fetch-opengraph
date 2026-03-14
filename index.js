"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetch = exports.fetchRaw = exports.queryParams = exports.metaTags = void 0;
const axios_1 = require("axios");
const html_entities_1 = require("html-entities");
const cheerio = require("cheerio");
exports.metaTags = {
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
const metaTagValues = new Set(Object.values(exports.metaTags).map(v => v.toLowerCase()));
const queryParams = (str) => {
    try {
        const parsed = new URL(str);
        const params = {};
        parsed.searchParams.forEach((value, key) => {
            params[key] = value;
        });
        return params;
    }
    catch (_a) {
        return {};
    }
};
exports.queryParams = queryParams;
const fetchRaw = (url, headers) => __awaiter(void 0, void 0, void 0, function* () {
    const parsed = new URL(url);
    const baseUrl = `${parsed.origin}${parsed.pathname}`;
    const params = (0, exports.queryParams)(url);
    const response = yield axios_1.default.get(baseUrl, {
        params,
        headers: Object.assign({ 'User-Agent': 'OpenGraph', 'Cache-Control': 'no-cache', Accept: '*/*', Connection: 'keep-alive' }, headers),
    });
    if (response.status >= 400) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.data;
});
exports.fetchRaw = fetchRaw;
const fetch = (url_1, headers_1, ...args_1) => __awaiter(void 0, [url_1, headers_1, ...args_1], void 0, function* (url, headers, includeRaw = false) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    const { ogUrl, ogType, ogTitle, ogDescription, ogImage, ogVideo, ogVideoWidth, ogVideoHeight, ogVideoUrl, twitterUrl, twitterTitle, twitterDescription, twitterImage, } = exports.metaTags;
    try {
        const html = yield (0, exports.fetchRaw)(url, headers);
        const $ = cheerio.load(html);
        const siteTitle = $('title').first().text().trim();
        const og = {
            url,
            raw: includeRaw ? html : null,
        };
        $('meta').each((_, el) => {
            const name = ($(el).attr('property') || $(el).attr('name') || '').toLowerCase();
            const content = $(el).attr('content');
            if (name && content !== undefined && content !== 'undefined' && metaTagValues.has(name)) {
                og[name] = (0, html_entities_1.decode)(content);
            }
        });
        // Image fallbacks
        og[ogImage] = (_a = og[ogImage]) !== null && _a !== void 0 ? _a : null;
        og[exports.metaTags.twitterImage] = (_b = og[exports.metaTags.twitterImage]) !== null && _b !== void 0 ? _b : og[ogImage];
        og.image = (_c = og[ogImage]) !== null && _c !== void 0 ? _c : null;
        // Video fallbacks
        og.video = (_e = (_d = og[ogVideo]) !== null && _d !== void 0 ? _d : og[ogVideoUrl]) !== null && _e !== void 0 ? _e : null;
        if (og.video) {
            og[ogVideoWidth] = (_f = og[ogVideoWidth]) !== null && _f !== void 0 ? _f : '560';
            og[ogVideoHeight] = (_g = og[ogVideoHeight]) !== null && _g !== void 0 ? _g : '340';
        }
        // URL fallbacks
        og[ogUrl] = (_h = og[ogUrl]) !== null && _h !== void 0 ? _h : url;
        og[twitterUrl] = (_j = og[twitterUrl]) !== null && _j !== void 0 ? _j : og[ogUrl];
        og.url = url;
        // Description fallbacks
        og[ogDescription] = (_l = (_k = og[ogDescription]) !== null && _k !== void 0 ? _k : og[exports.metaTags.description]) !== null && _l !== void 0 ? _l : null;
        og[twitterDescription] = (_m = og[twitterDescription]) !== null && _m !== void 0 ? _m : og[ogDescription];
        og.description = (_o = og[ogDescription]) !== null && _o !== void 0 ? _o : '';
        // Title fallbacks
        og[ogTitle] = (_p = og[ogTitle]) !== null && _p !== void 0 ? _p : siteTitle;
        og[twitterTitle] = (_q = og[twitterTitle]) !== null && _q !== void 0 ? _q : og[ogTitle];
        og.title = (_r = og[ogTitle]) !== null && _r !== void 0 ? _r : '';
        // Type fallback
        og[ogType] = (_s = og[ogType]) !== null && _s !== void 0 ? _s : 'website';
        return og;
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        const status = (_t = error.status) !== null && _t !== void 0 ? _t : 400;
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
            [exports.metaTags.twitterCard]: '',
            [exports.metaTags.twitterDomain]: '',
            [twitterUrl]: url,
            [twitterTitle]: '',
            [twitterDescription]: '',
            [twitterImage]: '',
        };
    }
});
exports.fetch = fetch;
exports.default = {
    fetch: exports.fetch,
    fetchRaw: exports.fetchRaw,
};
//# sourceMappingURL=index.js.map