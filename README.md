# Art, Media, Science.

This is the site repository for [*Art, Media, Science*](https://artmediascience.com), the conservation practice of Chris McGlinchey.



<br>

## Build

The site is built with stock [Jekyll *(4.2.2)*](https://jekyllrb.com) , with the addition of the `sass-embedded` [Dart compiler *(1.0)*](https://github.com/jekyll/jekyll-sass-converter). There are no other external dependencies, libraries, or package managers—all the bespoke HTML, CSS, and JavaScript files are included here.

The source files live on the [`main`](../../tree/main) branch; they are compiled automatically to the root of [`public`](../../tree/public) on any commit [via a custom GitHub Action](.github/workflows/github-pages.yml). (They are also [beautified](https://github.com/beautify-web/js-beautify).) This is what [GitHub Pages serves](../../settings/pages) at the custom domain, [artmediascience.com](https://https://artmediascience.com), which is managed over at [GoDaddy](https://dcc.godaddy.com/control/artmediascience.com/settings) (with the [`CNAME`](CNAME) here).



<br>

## Content

All of the user-visible text content lives in the single [`index.md`](index.md) file. Simple changes can be made directly using [GitHub’s editor](https://github.com/art-media-science/art-media-science.github.io/edit/main/index.md).

The title and other metadata are in the [front matter](https://jekyllrb.com/docs/front-matter/); the rest of the text is in the [Markdown-formatted content](https://daringfireball.net/projects/markdown/syntax), below. The site uses the `#` *(headings)* and `---` *(horizontal rules)* there to structure the page content.

The first three headings are required for the main [*Art*](http://artmediascience.com/#art) / [*Media*](http://artmediascience.com/#media) / [*Science*](http://artmediascience.com/#science) sections on the page. Everything between the set of the dividers is used for the [*About*](https://artmediascience.com/#about) section. There are `##` *(level-two headings)* in there—though these are not required—and `###` *(level-three headings)* are used for the [intro](https://artmediascience.com/#intro) and [outro](https://artmediascience.com/#colophon) blurbs. Anything after the last divider is put in the [colophon](https://artmediascience.com/#colophon) at the bottom of the page.



<br>

## What Else

For any other questions you can contact [@mfehrenbach](https://github.com/mfehrenbach/) or [@eli8527](https://github.com/eli8527), who cobbled this all together. Cheers.

