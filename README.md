# Division renderer

Use this spreadsheet:

https://docs.google.com/spreadsheets/d/1erErylnClQlXipwvbPjFe6oPo9tXVZsNrIw08-VrD8M/edit#gid=0

"Recent divisions" has a list of recent divisions including some metadata like the ayes and noes. Once you've found the one you're interested in, grab the id and copy it over to a new row on Sheet1. You can copy down every other column and they will populate themselves. 

Now deploy.

Now take the deployurl from the spreadsheet and embed it in an article. There is purposely no furniture in the table to allow you to write that in the article: Eg "MPs voted tonight on whether to commendably allow the splitting of infinitives. The motion won by 301 votes to 109; find out how your MP voted."





# Interactive atom template

```
npm install
```

### Running locally
```
npm start
```

Go to <http://localhost:8000>

### Deploying
Fill out `config.json`:
```json
{
    "title": "Title of your interactive",
    "docData": "Any associated external data",
    "path": "year/month/unique-title"
}
```

Then run
```
npm run deploy
```

#### Checking the deploy
You can check the deploy log by running
```
npm run log
```
<b>NOTE:</b> Updates can take up to 30 seconds to show in the logs

#### Embedding into Composer
Run the command below, copy the URL into Composer and click embed.
```
npm run url
```

## Usage guide
We use [SASS](http://sass-lang.com/) for better CSS, [Babel](https://babeljs.io/) for next
generation JavaScript and [Rollup](http://rollupjs.org/) for bundling.

Interactive atoms have three components:
- CSS - `src/css/main.scss`
- HTML - `src/render.js` should generate some HTML (by default returns the contents of `src/templates/main.html`)
- JS - `src/js/main.js`, by default this simply loads `src/js/app.js`

### Loading resources (e.g. assets)
Resources must be loaded with absolute paths, otherwise they won't work when deployed.
Use the template string `<%= path %>` in any CSS, HTML or JS, it will be replaced
with the correct absolute path.

```html
<img src="<%= path %>/assets/image.png" />
```

```css
.test {
    background-image: url('<%= path %>/assets/image.png');
}
```

```js
var url = '<%= path %>/assets/image.png';
```

### Atom size
Interactive atoms are baked into the initial page response so you need to be careful about
how much weight you are adding. While CSS and HTML are unlikely to ever be that large,
you should worry about the size of your JS.

The difference between `src/js/main.js` and `src/js/app.js` is that the former is baked into
the page and the latter is not. <b>Never</b> load large libraries (such as d3) in `src/js/main.js`.
In most cases, the majority of the work should happen in `src/js/app.js` and `src/js/main.js`
should be reserved for simple initialisation.
