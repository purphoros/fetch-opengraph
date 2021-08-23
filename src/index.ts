import axios, { AxiosResponse } from 'axios';
import { decode } from 'html-entities';

export const metaTags = {
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

export const queryParams = (str: string) => {
  const url = str.replace(/^([^#]*).*/, "$1").replace(/^[^?]*\??(.*)/, "$1");
  let result = {};
  const regex = /([^=]+)=([^&]+)&?/g;
  let match: RegExpExecArray | null;
  do {
    match = regex.exec(url);
    if (match) {
      // This is to prevent an possible endless loop,
      //   avoid "If path not taken" from code coverage since you're unable to reproduce this and it's required to prevent endless loops
      /* istanbul ignore next */
      if (match.index === regex.lastIndex) regex.lastIndex++;
      result = { ...result, [match[1]]: match[2] }
    }
  } while (match);

  return result;
}

export const fetchRaw = async (url: string, headers?: any): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response: AxiosResponse<any> = await axios.get(url.replace(/^([^?#]*).*/, "$1"), {
        params: queryParams(url),
        headers: {
          'User-Agent': 'OpenGraph',
          'Cache-Control': 'no-cache',
          Accept: '*/*',
          Connection: 'keep-alive',
          ...headers
        }
      });

      if (response.status >= 400) {
        throw response;
      }

      return await resolve(response.data);

    } catch (error) {
      return reject({ message: error.message });
    }
  });
}

export const fetch = async (url: string, headers?: any): Promise<any> => {
  const {
    title,
    description,
    ogUrl,
    ogType,
    ogTitle,
    ogDescription,
    ogImage,
    twitterCard,
    twitterDomain,
    twitterUrl,
    twitterTitle,
    twitterDescription,
    twitterImage
  } = metaTags;

  return new Promise(async (resolve, reject) => {
    try {
      const html = await fetchRaw(url, headers);

      let siteTitle = '';

      const tagTitle = html.match(
        /<title[^>]*>[\r\n\t\s]*([^<]+)[\r\n\t\s]*<\/title>/gim
      );
      siteTitle = tagTitle[0].replace(
        /<title[^>]*>[\r\n\t\s]*([^<]+)[\r\n\t\s]*<\/title>/gim,
        '$1'
      );

      const og = [];
      const metas: any = html.match(/<meta[^>]+>/gim);

      // There is no else statement
      /* istanbul ignore else */
      if (metas) {
        for (const meta of metas) {
          let properties: any = {};

          const split = meta.replace(/<meta[\s\t\r\n]+(.*)/g, "$1").replace(/\s*\/?>/, "").split(/([\w:]+)=/);
          for (let i=1; i<split.length; i = i + 2) {
            const key = split[i].trim().replace(/(["']?)(.*?)\1/, "$2");
            const value = split[i+1].trim().replace(/(["']?)(.*?)\1/, "$2")
            properties = {
              ...properties,
              [key]: typeof value !== 'undefined' && value !== 'undefined' ? value : undefined
            }
          }

          const reName = new RegExp(
            `(${title}|${description}|${twitterCard}|${twitterTitle}|${twitterDescription}|${twitterImage})`
          );
          if (properties.name && properties.name.match(reName)) {
            og.push({ name: properties.name, value: properties.content });
          }

          const reProperty = new RegExp(
            `(${ogUrl}|${ogType}|${ogTitle}|${ogDescription}|${ogImage}|${twitterDomain}|${twitterUrl})`
          );
          if (properties.property && properties.property.match(reProperty)) {
            og.push({ name: properties.property, value: properties.content });
          }
        }
      }

      const result = og.reduce(
        (chain: any, meta: any) => ({ ...chain, [meta.name]: decode(meta.value) }),
        {
          url
        }
      );

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
    } catch (error) {
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
  });
};

export default {
  fetch,
  fetchRaw
};
