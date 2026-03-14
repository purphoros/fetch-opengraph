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
export declare const metaTags: Record<string, string>;
export declare const queryParams: (str: string) => Record<string, string>;
export declare const fetchRaw: (url: string, headers?: FetchHeaders) => Promise<string>;
export declare const fetch: (url: string, headers?: FetchHeaders, includeRaw?: boolean) => Promise<OpenGraphResult>;
declare const _default: {
    fetch: (url: string, headers?: FetchHeaders, includeRaw?: boolean) => Promise<OpenGraphResult>;
    fetchRaw: (url: string, headers?: FetchHeaders) => Promise<string>;
};
export default _default;
