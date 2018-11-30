import i18n from 'i18next'
import ICU from 'i18next-icu'
import XHR from 'i18next-xhr-backend'

import en from 'i18next-icu/locale-data/en'

const localeData = [en]

i18n
  .use(new ICU({ localeData: localeData }))
  .use(XHR)
  .init({
    fallbackLng: {
      'default': ['en']
    },
    debug: process.env.NODE_ENV !== 'production',
    backend: {
      loadPath: 'locales/{{lng}}.json'
    },
    react: {
      wait: true,
      bindI18n: 'languageChanged loaded',
      bindStore: 'added removed',
      nsMode: 'default'
    }
  })

export default i18n
