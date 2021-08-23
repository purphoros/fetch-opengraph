import { queryParams, fetch, metaTags } from '../index';
import axios, { AxiosResponse } from 'axios';

jest.mock('axios');

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

const url = 'https://github.com/purphoros/fetch-opengraph';
const getFields = (version: number = 1) => {
  const image =
    'https://repository-images.githubusercontent.com/339901906/793fa680-7329-11eb-9502-974e5c68aaa1';
  const fields: any = {
    title: 'purphoros/fetch-opengraph',
    description: 'Fetch opengraph information from an url.',
    fake: 'not open graph'
  };

  if (version <= 2) {
    fields[twitterCard] = 'summary_large_image';
    fields[twitterDomain] = 'github.com';
    fields[twitterUrl] = url;
    fields[twitterTitle] = fields[title];
    fields[twitterDescription] = fields[description];
    fields[twitterImage] = image;
  }

  if (version <= 1) {
    fields[ogUrl] = url;
    fields[ogType] = 'website';
    fields[ogTitle] = fields[title];
    fields[ogDescription] = fields[description];
    fields[ogImage] = image;
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
    config: {}
  };

  return mockedSuccessfullyResponse;
};

const mockedFailedResponse: AxiosResponse = {
  data: '',
  status: 400,
  statusText: 'Meh',
  headers: {},
  config: {}
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

it('Returns 400', async () => {
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

it('Returns query params from query string', async () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  mockedAxios.get.mockResolvedValue(mockedFailedResponse);
  const params: any = queryParams(`${url}?key1=val1&key2=val2`);
  expect(params.key1).toEqual("val1");
  expect(params.key2).toEqual("val2");
});