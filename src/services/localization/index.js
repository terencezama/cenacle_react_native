// import RNLanguages from 'react-native-languages';
import i18n from 'i18n-js';

import en from './translations/en.json';
import fr from './translations/fr.json';
import moment from 'moment-with-locales-es6';

// i18n.locale = RNLanguages.language;
i18n.locale = 'fr';
i18n.fallbacks = true;
i18n.translations = { en, fr };
moment.locale('fr')
export default i18n;