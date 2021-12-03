export declare const metaTags: any;
export declare const queryParams: (str: string) => {};
export declare const fetchRaw: (url: string, headers?: any) => Promise<any>;
export declare const fetch: (url: string, headers?: any, includeRaw?: boolean) => Promise<any>;
declare const _default: {
    fetch: (url: string, headers?: any, includeRaw?: boolean) => Promise<any>;
    fetchRaw: (url: string, headers?: any) => Promise<any>;
};
export default _default;
