# fetch-opengraph

[![npm version](https://badgen.net/npm/v/fetch-opengraph)](https://npm.im/fetch-opengraph) [![CI-CD](https://github.com/purphoros/fetch-opengraph/actions/workflows/main.yml/badge.svg)](https://github.com/purphoros/fetch-opengraph/actions/workflows/main.yml) [![Coverage Status](https://coveralls.io/repos/github/purphoros/fetch-opengraph/badge.svg?branch=master)](https://coveralls.io/github/purphoros/fetch-opengraph?branch=master) [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)


Fetch opengraph information from an url.

## Install

```
npm install fetch-opengraph --save
```

or

```
yarn add fetch-opengraph
```

## Usage

### Node example

Just a basic index.js running `node .`
```javascript
const fetchOpengraph = require('fetch-opengraph');

(async () => {
  const data = await fetchOpengraph.fetch('https://github.com/purphoros/fetch-opengraph');
  console.log(data)
})()

```

Running in a web environment

```javascript
import { fetch } from 'fetch-opengraph';

(async () => {
  const data = await fetch('https://github.com/purphoros/fetch-opengraph');
  console.log(data)
})()
```

### Expected result

```javascript
{
  description: 'Fetch opengraph information from an url.',
  'twitter:image:src': 'https://avatars.githubusercontent.com/u/4297636?s=400&amp;v=4',
  'twitter:card': 'summary',
  'twitter:title': 'purphoros/fetch-opengraph',
  'twitter:description': 'Fetch opengraph information from an url.',
  'og:image': 'https://avatars.githubusercontent.com/u/4297636?s=400&amp;v=4',
  'og:type': 'object',
  'og:title': 'purphoros/fetch-opengraph',
  'og:url': 'https://github.com/purphoros/fetch-opengraph',
  'og:description': 'Fetch opengraph information from an url.',
  image: 'https://avatars.githubusercontent.com/u/4297636?s=400&amp;v=4',
  url: 'https://github.com/purphoros/fetch-opengraph'
}