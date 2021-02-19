import { fetch } from '../index';
import axios, { AxiosResponse } from 'axios';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

const title = 'title';
const description = 'description';
const ogUrl = 'og:url';
const ogType = 'og:type';
const ogTitle = 'og:title';
const ogDescription = 'og:description';
const ogImage = 'og:image';
const twitterCard = 'twitter:card';
const twitterDomain = 'twitter:domain';
const twitterUrl = 'twitter:url';
const twitterTitle = 'twitter:title';
const twitterDescription = 'twitter:description';
const twitterImage = 'twitter:image';

const fields = {
  title: 'purphoros/fetch-opengraph',
  description:
    '.fetch() to get opengraph information on a url. Contribute to purphoros/fetch-opengraph development by creating an account on GitHub.',
  [ogUrl]: 'https://github.com/purphoros/fetch-opengraph',
  [ogType]: 'website',
  [ogTitle]: 'purphoros/fetch-opengraph',
  [ogDescription]:
    '.fetch() to get opengraph information on a url. Contribute to purphoros/fetch-opengraph development by creating an account on GitHub.',
  [ogImage]: 'https://avatars.githubusercontent.com/u/4297636?s=400&v=4',
  [twitterCard]: 'summary_large_image',
  [twitterDomain]: 'github.com',
  [twitterUrl]: 'https://github.com/purphoros/fetch-opengraph',
  [twitterTitle]: 'purphoros/fetch-opengraph',
  [twitterDescription]:
    '.fetch() to get opengraph information on a url. Contribute to purphoros/fetch-opengraph development by creating an account on GitHub.',
  [twitterImage]: 'https://avatars.githubusercontent.com/u/4297636?s=400&v=4',
};

const mockedResponse: AxiosResponse = {
  data: `
    <!-- HTML Meta Tags -->
    <title>${fields[title]}</title>
    <meta name="${description}" content="${fields[description]}">

    <!-- Facebook Meta Tags -->
    <meta property="${ogUrl}" content="${fields[ogUrl]}">
    <meta property="${ogType}" content="${fields[ogType]}">
    <meta property="${ogTitle}" content="${fields[ogTitle]}">
    <meta property="${ogDescription}" content="${fields[ogDescription]}">
    <meta property="${ogImage}" content="${fields[ogImage]}">

    <!-- Twitter Meta Tags -->
    <meta name="${twitterCard}" content="${fields[twitterCard]}">
    <meta property="${twitterDomain}" content="${fields[twitterDomain]}">
    <meta property="${twitterUrl}" content="${fields[twitterUrl]}">
    <meta name="${twitterTitle}" content="${fields[twitterTitle]}">
    <meta name="${twitterDescription}" content="${fields[twitterDescription]}">
    <meta name="${twitterImage}" content="${fields[twitterImage]}">`,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {},
};

it('returns mocked name successfully', async () => {
  mockedAxios.get.mockResolvedValue(mockedResponse);

  expect(axios.get).not.toHaveBeenCalled();

  const result = await fetch('https://github.com/purphoros/fetch-opengraph');

  expect(axios.get).toHaveBeenCalled();

  expect(result[ogUrl]).toEqual(fields[ogUrl]);
  expect(result[ogType]).toEqual(fields[ogType]);
  expect(result[ogTitle]).toEqual(fields[ogTitle]);
  expect(result[ogDescription]).toEqual(fields[ogDescription]);
  expect(result[ogImage]).toEqual(fields[ogImage]);

  expect(result[twitterCard]).toEqual(fields[twitterCard]);
  expect(result[twitterDomain]).toEqual(fields[twitterDomain]);
  expect(result[twitterUrl]).toEqual(fields[twitterUrl]);
  expect(result[twitterTitle]).toEqual(fields[twitterTitle]);
  expect(result[twitterDescription]).toEqual(fields[twitterDescription]);
  expect(result[twitterImage]).toEqual(fields[twitterImage]);
});
