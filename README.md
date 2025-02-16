## Development

### SMTP

To test mail sending features, you can use any local SMTP server (like [mailtutan](https://github.com/mailtutan/mailtutan)).
SMTP variables need to be set in `.env`.

### i18n

In `static/locales/` we found all translations in json files.

During dev, i18next try to fetch a `dev.json` locale file. To avoid 404, create an empty json file with that name.
