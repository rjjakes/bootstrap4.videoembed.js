# bootstrap4.videoembed.js

Embed Youtube and/or Vimeo videos into your Bootstrap 4 site. Creates a clickable
thumbnail that opens a modal containing the video. Supports autoplay.
    
## Installation 
  
```
npm install bootstrap4-videoembed 
npm run build
```

or 
```
yarn add bootstrap4-videoembed 
yarn run build
```

or 

Just copy `distribution/bootstrap4.videoembed.min.js` and include in your site 
just above the `</body>` tag if you don't want to recompile from source. 

## Usage

Once, you have the plugin included on your page, you can define your videos
like this:

```html
<a class="videoembed" href="https://www.youtube.com/watch?v=e452W2Kj-yg" data-autoplay="false">[video image goes here]</a>
<a class="videoembed" href="https://vimeo.com/158181618" data-autoplay="false">[video image goes here]</a>
```

And initialize them in Javascript like this:

```javascript
document.videoEmbed('a.videoembed');
```

## Demo
  
Run

```
npm run test
```

or 

```
yarn run test
```

## Why?

This could easily have been another jQuery plugin (it would have been smaller for 
sure), but I wanted to experiment with ES6, Babel and Webpack. 

## License

MIT