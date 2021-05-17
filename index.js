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
exports.fetch = exports.metaTags = void 0;
const axios_1 = require("axios");
const html_entities_1 = require("html-entities");
exports.metaTags = {
    title: 'title',
    description: 'description',
    ogUrl: 'og:url',
    ogType: 'og:type',
    ogTitle: 'og:title',
    ogDescription: 'og:description',
    ogImage: 'og:image',
    twitterCard: 'twitter:card',
    twitterDomain: 'twitter:domain',
    twitterUrl: 'twitter:url',
    twitterTitle: 'twitter:title',
    twitterDescription: 'twitter:description',
    twitterImage: 'twitter:image'
};
const fetch = (url, headers) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, ogUrl, ogType, ogTitle, ogDescription, ogImage, twitterCard, twitterDomain, twitterUrl, twitterTitle, twitterDescription, twitterImage } = exports.metaTags;
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(url, {
                headers: Object.assign({ 'User-Agent': 'OpenGraph', 'Cache-Control': 'no-cache', Accept: '*/*', Connection: 'keep-alive' }, headers)
            });
            if (response.status >= 400) {
                throw response;
            }
            let siteTitle = '';
            const html = yield response.data;
            const tagTitle = html.match(/<title[^>]*>[\r\n\t\s]*([^<]+)[\r\n\t\s]*<\/title>/gim);
            siteTitle = tagTitle[0].replace(/<title[^>]*>[\r\n\t\s]*([^<]+)[\r\n\t\s]*<\/title>/gim, '$1');
            const metas = html.match(/<meta[^>]+>/gim);
            const og = [];
            // There is no else statement
            /* istanbul ignore else */
            if (metas) {
                for (const meta of metas) {
                    let properties = {};
                    // (                      Create capture group 1
                    //   (?<key>[^\s]+)       Create capture group 2 called key, capture everything backwards from the = sign upto and not including \s
                    //   =                    Match a =
                    //   (['"])               Create capture group \3 matching a double or single quote
                    //   \s*                  0 or more \s
                    //   (?<value>.*?)        Create capture group 4 called value that is not greedy ant takes everything upto the following look forward
                    //   (?=\3)               Look forward and make sure there is a corresponding \3
                    //   \3                   Match \3
                    // )+                     Finish capture group 1 and repeat it
                    const regex = /((?<key>[^\s]+)=(['"])\s*(?<value>.*?)(?=\3)\3)+/gm;
                    let match;
                    do {
                        match = regex.exec(meta);
                        if (match) {
                            // This is to prevent an possible endless loop,
                            //   avoid "If path not taken" from code coverage since you're unable to reproduce this and it's required to prevent endless loops
                            /* istanbul ignore next */
                            if (match.index === regex.lastIndex)
                                regex.lastIndex++;
                            properties = Object.assign(Object.assign({}, properties), { [match[2]]: match[4] !== 'undefined' ? match[4] : null });
                        }
                    } while (match);
                    const reName = new RegExp(`(${title}|${description}|${twitterCard}|${twitterTitle}|${twitterDescription}|${twitterImage})`);
                    if (properties.name && properties.name.match(reName)) {
                        og.push({ name: properties.name, value: properties.content });
                    }
                    const reProperty = new RegExp(`(${ogUrl}|${ogType}|${ogTitle}|${ogDescription}|${ogImage}|${twitterDomain}|${twitterUrl})`);
                    if (properties.property && properties.property.match(reProperty)) {
                        og.push({ name: properties.property, value: properties.content });
                    }
                }
            }
            const result = og.reduce((chain, meta) => (Object.assign(Object.assign({}, chain), { [meta.name]: html_entities_1.decode(meta.value) })), {});
            // Image
            result[ogImage] = result[ogImage] ? result[ogImage] : null;
            result[twitterImage] = result[twitterImage]
                ? result[twitterImage]
                : result[ogImage];
            result.image = result[ogImage]
                ? result[ogImage]
                : result[twitterImage]
                    ? result[twitterImage]
                    : null;
            // URL
            result[ogUrl] = result[ogUrl] ? result[ogUrl] : url;
            result[twitterUrl] = result[twitterUrl]
                ? result[twitterUrl]
                : result[ogUrl];
            result.url = result[ogUrl];
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
                status: error.status,
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
    fetch: exports.fetch
};
//# sourceMappingURL=index.js.map