# Recursive Inscription boilerplate

Let's build some [recursive inscriptions!](https://protos.com/what-are-recursive-inscriptions-on-bitcoin/)

Made with ❤️ by [Bitcoin Burials](https://bitcoinburials.com)

The main intention of this repository is to provide a minimalist boilerplate that handles developing locally as well as performing a production build
that gracefully replaces any dependencies that are already inscribed on chain and handles injecting these as recursive inscription sources. This currently works
with both JS and images.

## Getting started

1. Fork this repo, clone it locally etc

2. Install the dependencies:

```
// If you use NVM
nvm use

npm install
```

3. Run the development server:

```
npm run dev
```

You can then freely add and extend any JavaScript that your recursive inscription needs in `index.js`, update styles in `styles/index.css` and add any extra HTML markup you need to the base template in `view/main.html`

4. When you are happy, to create a production build with an output `index.html` in the `./dist` folder with all styles and javascript inline ready to be inscribed:

```
npm run build
```

## ord.config.js

The main addition to this boilerplate is the inclusion of the `ord.config.js`. In this file we can provide mappins for two types of recursive inscription: JavaScript dependencies and images.

You can add to it like so:

```js
{
  dependencies: {
    // The name of our module: The corresponding on chain inscription Id of this dependency
    "lodash": "123456i0"     
  },
  img: {
    // The filename of our local image, including file extension: The corresponding on chain inscription Id for this image
    "imageName.webp": "891011i0"
  }
}
```

When running locally the development server handles serving these assets from your local disk by serving anything located in the `public` directory. When we are ready for production, it will replace the sources of any images found in this `ord.config.js` file and similarly exclude any JS dependencies from the resulting production bundle and link these modules in `<script>` tags in the head of the output html file.

This provides an easy to use local development environment while also doing the heavy lifting for any production bundles. Just make sure that you keep your `ord.config.js` up to date!

## Points of note

This boilerplate attempts to utilise webpack to create some easy to use defaults for minified production builds - thus reducing the weight of our final recursive inscription (`dist/index.html`) that will be inscribed on chain.

The largest part of this currently is the inclusion of [Reset.css](https://meyerweb.com/eric/tools/css/reset/) - this adds about 800 bytes to the final built `index.html`. You potentially will not need this for any created recursive inscriptions, so feel free to nuke it if it's entirely unnecessary. This piece of css is also absolutely prime for inscription to be included as a recursive inscription.

The whole point of this boilerplate is to strip back everything to the bare minimum we need so as to reduce the filesize of our final product and to build on this iteratively as a community. PRs are very welcome!

