"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetch = void 0;
var axios_1 = require("axios");
var fetch = function (url) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
                var response, html, metas, og, _i, metas_1, meta, properties, regex, match, result, error_1;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, axios_1.default.get(url)];
                        case 1:
                            response = _b.sent();
                            if (response.status >= 400)
                                return [2 /*return*/, reject(response)];
                            return [4 /*yield*/, response.data];
                        case 2:
                            html = _b.sent();
                            metas = html.match(/<meta[^>]+>/gim);
                            og = [];
                            if (metas) {
                                for (_i = 0, metas_1 = metas; _i < metas_1.length; _i++) {
                                    meta = metas_1[_i];
                                    properties = {};
                                    regex = /((?<key>[^\s]+)=(['"])\s*(?<value>.*?)(?=\3)\3)+/gm;
                                    match = void 0;
                                    do {
                                        match = regex.exec(meta);
                                        if (match) {
                                            if (match.index === regex.lastIndex)
                                                regex.lastIndex++;
                                            properties = __assign(__assign({}, properties), (_a = {}, _a[match[2]] = match[4], _a));
                                        }
                                    } while (match);
                                    // Filter out valid name and properties
                                    if (properties.name &&
                                        properties.name.match(/(description|twitter:card|twitter:title|twitter:description|twitter:image)/)) {
                                        og.push({ name: properties.name, value: properties.content });
                                    }
                                    else if (properties.property &&
                                        properties.property.match(/(og:url|og:type|og:title|og:description|og:image|twitter:domain|twitter:url)/)) {
                                        og.push({ name: properties.property, value: properties.content });
                                    }
                                }
                            }
                            result = og.reduce(function (chain, meta) {
                                var _a;
                                return (__assign(__assign({}, chain), (_a = {}, _a[meta.name] = meta.value, _a)));
                            }, {});
                            result.image = result['og:image'] ? result['og:image'] : result['twitter:image'] ? result['twitter:image'] : null;
                            result.url = result['og:url'] ? result['og:url'] : result['twitter:url'] ? result['twitter:url'] : url;
                            return [2 /*return*/, resolve(result)];
                        case 3:
                            error_1 = _b.sent();
                            return [2 /*return*/, reject(error_1)];
                        case 4: return [2 /*return*/];
                    }
                });
            }); })];
    });
}); };
exports.fetch = fetch;
