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
    // Structured Properties
    //   images
    ogImageUrl: 'og:image:url',
    ogImageSecureUrl: 'og:image:secure_url',
    ogImageType: 'og:image:type',
    ogImageWidth: 'og:image:width',
    ogImageHeight: 'og:image:height',
    ogImageAlt: 'og:image:alt',
    //   video
    ogVideoSecureUrl: 'og:video:secure_url',
    ogVideoType: 'og:video:type',
    ogVideoWidth: 'og:video:width',
    ogVideoHeight: 'og:video:height',
    ogVideoUrl: 'og:video:url',
    //   audio
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
    // No vertical
    //   article
    articlePublishedTime: 'article:published_time',
    articleModifiedTime: 'article:modified_time',
    articleExpirationTime: 'article:expiration_time',
    articleAuthor: 'article:author',
    articleSection: 'article:section',
    articleTag: 'article:tag',
    //   book
    bookAuthor: 'book:author',
    bookIsbn: 'book:isbn',
    bookReleaseDate: 'book:release_date',
    bookTag: 'book:tag',
    //   profile
    profileFirstName: 'profile:first_name',
    profileLastName: 'profile:last_name',
    profileUsername: 'profile:username',
    profileGender: 'profile:gender',
};
const queryParams = (str) => {
    const url = str.replace(/^([^#]*).*/, "$1").replace(/^[^?]*\??(.*)/, "$1");
    let result = {};
    const regex = /([^=]+)=([^&]+)&?/g;
    let match;
    do {
        match = regex.exec(url);
        if (match) {
            // This is to prevent an possible endless loop,
            //   avoid "If path not taken" from code coverage since you're unable to reproduce this and it's required to prevent endless loops
            /* istanbul ignore next */
            if (match.index === regex.lastIndex)
                regex.lastIndex++;
            result = Object.assign(Object.assign({}, result), { [match[1]]: match[2] });
        }
    } while (match);
    return result;
};
exports.queryParams = queryParams;
const fetchRaw = (url, headers) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(url.replace(/^([^?#]*).*/, "$1"), {
                params: exports.queryParams(url),
                headers: Object.assign({ 'User-Agent': 'OpenGraph', 'Cache-Control': 'no-cache', Accept: '*/*', Connection: 'keep-alive' }, headers)
            });
            if (response.status >= 400) {
                throw response;
            }
            return yield resolve(response.data);
        }
        catch (error) {
            return reject({ message: error.message });
        }
    }));
});
exports.fetchRaw = fetchRaw;
const fetch = (url, headers, includeRaw = false) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, ogUrl, ogType, ogTitle, ogDescription, ogImage, ogVideo, ogVideoType, ogVideoWidth, ogVideoHeight, ogVideoUrl, twitterPlayer, twitterPlayerWidth, twitterPlayerHeight, twitterPlayerStream, twitterCard, twitterDomain, twitterUrl, twitterTitle, twitterDescription, twitterImage } = exports.metaTags;
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const html = yield exports.fetchRaw(url, headers);
            let siteTitle = '';
            const tagTitle = html.match(/<title[^>]*>[\r\n\t\s]*([^<]+)[\r\n\t\s]*<\/title>/gim);
            siteTitle = tagTitle[0].replace(/<title[^>]*>[\r\n\t\s]*([^<]+)[\r\n\t\s]*<\/title>/gim, '$1');
            const og = [];
            const metas = html.match(/<meta[^>]+>/gim);
            // There is no else statement
            /* istanbul ignore else */
            if (metas) {
                for (let meta of metas) {
                    meta = meta.replace(/\s*\/?>$/, " />");
                    const zname = meta.replace(/[\s\S]*(property|name)\s*=\s*([\s\S]+)/, "$2");
                    const name = /^["']/.test(zname) ? zname.substr(1, zname.slice(1).indexOf(zname[0])) : zname.substr(0, zname.search(/[\s\t]/g));
                    const valid = !!Object.keys(exports.metaTags).filter((m) => exports.metaTags[m].toLowerCase() === name.toLowerCase()).length;
                    // There is no else statement
                    /* istanbul ignore else */
                    if (valid) {
                        const zcontent = meta.replace(/[\s\S]*(content)\s*=\s*([\s\S]+)/, "$2");
                        const content = /^["']/.test(zcontent) ? zcontent.substr(1, zcontent.slice(1).indexOf(zcontent[0])) : zcontent.substr(0, zcontent.search(/[\s\t]/g));
                        og.push({ name, value: content !== 'undefined' ? content : null });
                    }
                }
            }
            const result = og.reduce((chain, meta) => (Object.assign(Object.assign({}, chain), { [meta.name]: html_entities_1.decode(meta.value) })), {
                url,
                raw: includeRaw ? html : null
            });
            // Image
            result[ogImage] = result[ogImage] ? result[ogImage] : null;
            result[twitterImage] = result[twitterImage]
                ? result[twitterImage]
                : result[ogImage];
            result.image = result[ogImage]
                ? result[ogImage]
                : null;
            // Video
            result.video = result[ogVideo] ? result[ogVideo] : result[ogVideoUrl] ? result[ogVideoUrl] : null;
            if (result.video) {
                result[ogVideoWidth] = result[ogVideoWidth] ? result[ogVideoWidth] : 560;
                result[ogVideoHeight] = result[ogVideoHeight] ? result[ogVideoHeight] : 340;
            }
            // URL
            result[ogUrl] = result[ogUrl] ? result[ogUrl] : url;
            result[twitterUrl] = result[twitterUrl]
                ? result[twitterUrl]
                : result[ogUrl];
            result.url = url;
            // Description
            result[ogDescription] = result[ogDescription]
                ? result[ogDescription]
                : result.description;
            result[twitterDescription] = result[twitterDescription]
                ? result[twitterDescription]
                : result[ogDescription];
            result.description = result[ogDescription];
            // Title
            result[ogTitle] = result[ogTitle] ? result[ogTitle] : siteTitle;
            result[twitterTitle] = result[twitterTitle]
                ? result[twitterTitle]
                : result[ogTitle];
            result.title = result[ogTitle];
            // Type
            result[ogType] = result[ogType] ? result[ogType] : 'website';
            return resolve(result);
        }
        catch (error) {
            return reject({
                message: error.message,
                status: error.status || 400,
                error,
                [title]: "",
                [description]: "",
                [ogUrl]: url,
                [ogType]: "website",
                [ogTitle]: "",
                [ogDescription]: "",
                [ogImage]: "",
                [twitterCard]: "",
                [twitterDomain]: "",
                [twitterUrl]: url,
                [twitterTitle]: "",
                [twitterDescription]: "",
                [twitterImage]: ""
            });
        }
    }));
});
exports.fetch = fetch;
exports.default = {
    fetch: exports.fetch,
    fetchRaw: exports.fetchRaw
};
//# sourceMappingURL=index.js.map