import { fetch, metaTags } from "..";
import axios, { AxiosResponse } from 'axios';

jest.mock('axios');

const {
  title,
  description,
  ogUrl,
  ogType,
  ogTitle,
  ogSiteName,
  ogDescription,
  ogLocale,
  ogImage,
  articlePublishedTime,
  articleModifiedTime,
  articleAuthor,
  articleTag,
  twitterCard,
  twitterImage
} = metaTags;

const url = 'https://dev-academy.com/vue-router-best-practices/'


const getFields  = () => {
  const fields: any = {
    title: 'Vue Router Best Practices',
    description: 'Learn modern Vue best practices with vue-router to build reliable and well-designed route navigation.',
  }

  fields[ogType] = 'article'
  fields[ogTitle] = 'Vue Router Best Practices'
  fields[ogUrl] = 'https://dev-academy.com/vue-router-best-practices/index.html'
  fields[ogSiteName] = 'Dev-Academy.com - Web security | Testing & automation | Application architecture'
  fields[ogDescription] = 'Learn modern Vue best practices with vue-router to build reliable and well-designed route navigation.'
  fields[ogLocale] = 'en_US'
  fields[ogImage] = 'https://dev-academy.com/vue-router-best-practices/banner.png'
  fields[articlePublishedTime] = '2022-09-02T00:00:00.000Z'
  fields[articleModifiedTime] = '2023-01-13T17:11:37.833Z'
  fields[articleAuthor] = 'John Doe'
  fields[articleTag] = 'vue'
  fields[twitterCard] = 'summary'
  fields[twitterImage] = 'https://dev-academy.com/vue-router-best-practices/banner.png'

  return fields;
}

const getMock = (fields: any): AxiosResponse => {
  const mockedSuccessfullyResponse: AxiosResponse = {
    data: `
      <!-- HTML Meta Tags -->
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <link rel="canonical" href="https://dev-academy.com/vue-router-best-practices/">
      <title>${fields[title]}</title>
      <meta name="${description}" content="${fields[description]}">

      <!-- General Meta Tags -->
      <meta property="${ogType}" content="${fields[ogType]}">
      <meta property="${ogTitle}" content="${fields[ogTitle]}">
      <meta property="${ogUrl}" content="${fields[ogUrl]}">
      <meta property="${ogSiteName}" content="${fields[ogSiteName]}">
      <meta property="${ogDescription}" content="${fields[ogDescription]}">
      <meta property="${ogLocale}" content="${fields[ogLocale]}">
      <meta property="${ogImage}" content="${fields[ogImage]}">
      
      <!-- Article Meta Tags -->
      <meta property="${articlePublishedTime}" content="${fields[articlePublishedTime]}">
      <meta property="${articleModifiedTime}" content="${fields[articleModifiedTime]}">
      <meta property="${articleAuthor}" content="${fields[articleAuthor]}">
      <meta property="${articleTag}" content="${fields[articleTag]}">
      
      <!-- Twitter Meta Tags -->
      <meta name="${twitterCard}" content="${fields[twitterCard]}">
      <meta name="${twitterImage}" content="${fields[twitterImage]}">
    `,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {}
  };

  return mockedSuccessfullyResponse;
};


it.only('Article', async () => {
  const fields = getFields();
  const mockedSuccessfullyResponse = getMock(fields);
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  mockedAxios.get.mockResolvedValue(mockedSuccessfullyResponse);

  const result = await fetch(url);

  expect(result[description]).toEqual(fields[description]);

  expect(result[ogUrl]).toEqual(fields[ogUrl]);
  expect(result[ogType]).toEqual(fields[ogType]);
  expect(result[ogTitle]).toEqual(fields[ogTitle]);
  expect(result[ogSiteName]).toEqual(fields[ogSiteName]);
  expect(result[ogDescription]).toEqual(fields[ogDescription]);
  expect(result[ogImage]).toEqual(fields[ogImage]);

  expect(result[articlePublishedTime]).toEqual(fields[articlePublishedTime]);
  expect(result[articleModifiedTime]).toEqual(fields[articleModifiedTime]);
  expect(result[articleAuthor]).toEqual(fields[articleAuthor]);
  expect(result[articleTag]).toEqual(fields[articleTag]);

  expect(result[twitterCard]).toEqual(fields[twitterCard]);
  expect(result[twitterImage]).toEqual(fields[twitterImage]);
});