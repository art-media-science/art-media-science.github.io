# Art, Media, Science.

This is the site repository for [*Art, Media, Science*](https://artmediascience.com), the conservation practice of Chris McGlinchey.

## Build

The site is built with stock [Jekyll *(4.2.2)*](https://jekyllrb.com) , with the addition of the `sass-embedded` [Dart compiler *(1.0)*](https://github.com/jekyll/jekyll-sass-converter). There are no other external dependencies, libraries, or package managers—all the bespoke HTML, CSS, and JavaScript files are included here.

The source files live on the [`main`](../../tree/main) branch; they are compiled automatically to the root of [`public`](../../tree/public) on any commit [via a custom GitHub Action](.github/workflows/github-pages.yml). (They are also [beautified](https://github.com/beautify-web/js-beautify).) This is what [GitHub Pages serves](../../settings/pages) at the custom domain, [artmediascience.com](https://https://artmediascience.com), managed over at [GoDaddy](https://dcc.godaddy.com/control/artmediascience.com/settings) (with the `CNAME` here).
