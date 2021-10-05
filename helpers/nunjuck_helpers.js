const nunjucks = require('nunjucks');

const setUpNunjucks = (expressApp) => {
    const env = nunjucks.configure('views', {
        autoescape: true,
        express: expressApp
      });

      env.addFilter('render', function (template, ctx) {
        try {
            return env.filters.safe(env.render(template, ctx));
        } catch (err) {
            return err.message;
        }
    });
}

module.exports = setUpNunjucks;