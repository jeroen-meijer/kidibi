import {Err, Ok, Result} from './models';

export type L10nMessages = {
  /// The locale of the messages.
  locale: string;
  /// THe title of the playlist header key column, showing the musical key of every song.
  playlistHeaderKeyTitle: string;
};

const l10nEn: L10nMessages = {
  locale: 'en',
  playlistHeaderKeyTitle: 'Key',
};

const l10nFr: L10nMessages = {
  locale: 'fr',
  playlistHeaderKeyTitle: 'Clé',
};

const l10nNl: L10nMessages = {
  locale: 'nl',
  playlistHeaderKeyTitle: 'Toonsoort',
};

export const defaultL10n = l10nEn;

export const getL10n = (): Result<L10nMessages, string> => {
  // @ts-ignore
  const locale: string = Spicetify.Locale._locale;

  switch (locale) {
    case 'fr':
      return Ok(l10nFr);
    case 'nl':
      return Ok(l10nNl);
    case 'en':
      return Ok(l10nEn);
    default:
      return Err(`Unsupported locale: ${locale}`);
  }
};

export const getL10nOrDefault = (): L10nMessages => {
  return getL10n().unwrapOr(defaultL10n);
};
