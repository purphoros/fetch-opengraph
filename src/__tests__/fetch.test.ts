import { fetch } from '../index';
import axios, { AxiosResponse } from 'axios';

jest.mock('axios');

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

const url = 'https://github.com/purphoros/fetch-opengraph';
const getFields = (version: number = 1) => {
  const fields: any = {
    title: 'purphoros/fetch-opengraph',
    description: 'Fetch opengraph information from an url.',
    fake: 'not open graph',
  };

  if (version <= 2) {
    fields[twitterCard] = 'summary_large_image';
    fields[twitterDomain] = 'github.com';
    fields[twitterUrl] = url;
    fields[twitterTitle] = 'purphoros/fetch-opengraph';
    fields[twitterDescription] = 'Fetch opengraph information from an url.';
    fields[twitterImage] = 'https://avatars.githubusercontent.com/u/4297636?s=400&v=4';
  }

  if (version <= 1) {
    fields[ogType] = 'website';
    fields[ogUrl] = url;
    fields[ogType] = 'website';
    fields[ogTitle] = 'purphoros/fetch-opengraph';
    fields[ogDescription] = 'Fetch opengraph information from an url.';
    fields[ogImage] = 'https://avatars.githubusercontent.com/u/4297636?s=400&v=4';
  }

  return fields;
};

const getMock = (fields: any): AxiosResponse => {
  const mockedSuccessfullyResponse: AxiosResponse = {
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

  return mockedSuccessfullyResponse;
};

const mockedFailedResponse: AxiosResponse = {
  data: '',
  status: 400,
  statusText: 'OK',
  headers: {},
  config: {},
};

it('Returns successfully', async () => {
  const fields = getFields(1);
  const mockedSuccessfullyResponse = getMock(fields);
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  mockedAxios.get.mockResolvedValue(mockedSuccessfullyResponse);

  const result = await fetch(url);

  expect(result[description]).toEqual(fields[description]);

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

it('Returns successfully twitter only', async () => {
  const fields = getFields(2);
  const mockedSuccessfullyResponse = getMock(fields);
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  mockedAxios.get.mockResolvedValue(mockedSuccessfullyResponse);

  const result = await fetch(url);

  expect(result[description]).toEqual(fields[description]);

  expect(result[twitterCard]).toEqual(fields[twitterCard]);
  expect(result[twitterDomain]).toEqual(fields[twitterDomain]);
  expect(result[twitterUrl]).toEqual(fields[twitterUrl]);
  expect(result[twitterTitle]).toEqual(fields[twitterTitle]);
  expect(result[twitterDescription]).toEqual(fields[twitterDescription]);
  expect(result[twitterImage]).toEqual(fields[twitterImage]);
});

it('Returns successfully no opengraph', async () => {
  const fields = getFields(3);
  const mockedSuccessfullyResponse = getMock(fields);
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  mockedAxios.get.mockResolvedValue(mockedSuccessfullyResponse);

  const result = await fetch(url);

  expect(result[description]).toEqual(fields[description]);
});

it('returns 400', async () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  mockedAxios.get.mockResolvedValue(mockedFailedResponse);

  try {
    await fetch(url);
  } catch (error) {
    expect(error.status).toEqual(400);
  } finally {
    expect(axios.get).toHaveBeenCalled();
  }
});
