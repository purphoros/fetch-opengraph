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
exports.fetch = void 0;
const axios_1 = require("axios");
const fetch = (url) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(url);
            if (response.status >= 400) {
                throw response;
            }
            const html = yield response.data;
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
                            //   avoid "If path not taken" from code coverage since you're unable to reproduce
                            /* istanbul ignore next */
                            if (match.index === regex.lastIndex)
                                regex.lastIndex++;
                            properties = Object.assign(Object.assign({}, properties), { [match[2]]: match[4] !== 'undefined' ? match[4] : null });
                        }
                    } while (match);
                    if (properties.name &&
                        properties.name.match(/(title|description|twitter:card|twitter:title|twitter:description|twitter:image)/)) {
                        og.push({ name: properties.name, value: properties.content });
                    }
                    if (properties.property &&
                        properties.property.match(/(og[:]url|og.type|og\:title|og\:description|og\:image|twitter\:domain|twitter\:url)/)) {
                        og.push({ name: properties.property, value: properties.content });
                    }
                }
            }
            const result = og.reduce((chain, meta) => (Object.assign(Object.assign({}, chain), { [meta.name]: meta.value })), {});
            result.image = result['og:image'] ? result['og:image'] : result['twitter:image'] ? result['twitter:image'] : null;
            result.url = result['og:url'] ? result['og:url'] : result['twitter:url'] ? result['twitter:url'] : url;
            return resolve(result);
        }
        catch (error) {
            return reject(error);
        }
    }));
});
exports.fetch = fetch;
//# sourceMappingURL=index.js.map