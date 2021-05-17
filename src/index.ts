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
      const response: AxiosResponse<any> = await axios.get(url, {
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

      let siteTitle = '';
      const html = await response.data;

      const tagTitle = html.match(
        /<title[^>]*>[\r\n\t\s]*([^<]+)[\r\n\t\s]*<\/title>/gim
      );
      siteTitle = tagTitle[0].replace(
        /<title[^>]*>[\r\n\t\s]*([^<]+)[\r\n\t\s]*<\/title>/gim,
        '$1'
      );

      const metas = html.match(/<meta[^>]+>/gim);
      const og = [];

      // There is no else statement
      /* istanbul ignore else */
      if (metas) {
        for (const meta of metas) {
          let properties: any = {};

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

          let match: RegExpExecArray | null;
          do {
            match = regex.exec(meta);
            if (match) {
              // This is to prevent an possible endless loop,
              //   avoid "If path not taken" from code coverage since you're unable to reproduce this and it's required to prevent endless loops
              /* istanbul ignore next */
              if (match.index === regex.lastIndex) regex.lastIndex++;
              properties = {
                ...properties,
                [match[2]]: match[4] !== 'undefined' ? match[4] : null
              };
            }
          } while (match);

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
        {}
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
    } catch (error) {
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
  });
};

export default {
  fetch
};
