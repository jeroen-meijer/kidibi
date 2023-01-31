/// <reference path="types/spicetify.d.ts" />

import {Subscription} from 'rxjs';
import {Api} from './api';
import {
  KIDIBI_PLAYLIST_COLUMN_HEADER_ID,
  PLAYLIST_ELEMENT_CLASS_NAMES,
  PLAYLIST_HEADER_ROW_CLASS_NAME,
  PLAYLIST_HEADER_SECTION_VARIABLE_CLASS_NAME,
} from './constants';
import {observeElement} from './functions';
import {
  toClassSelectors,
  toNestedClassSelectors,
} from './functions/toClassSelectors';
import {waitForElement} from './functions/waitForElement';
import {getL10nOrDefault} from './l10n';
import {Err, None, Ok, Option, Result, Some} from './models';

let kidibiElementSubscription: Option<Subscription> = None();

const api = new Api();

const isReady = () => {
  const dependencies = [
    Spicetify?.Platform?.History,
    Spicetify?.CosmosAsync,
    Spicetify?.Player,
    Spicetify?.showNotification,
    // @ts-ignore
    Spicetify?.Locale?._locale,
  ];
  return dependencies.every((dependency) => !!dependency);
};

const main = async () => {
  while (!isReady()) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  const {History} = Spicetify.Platform;

  History.listen(attemptAddKeyColumn);
  attemptAddKeyColumn(History.location as Location);

  // History.listen(onNavigate);
  // onNavigate(History.location as Location);
};

// const onTableColumnCountChanged = (playlistTable: Element) => async () => {
//   console.log('onTableColumnCountChanged');

//   const colCountString = playlistTable.getAttribute('aria-colcount');
//   if (!colCountString) {
//     console.log('no col count');
//     return;
//   }

//   const colCount = parseInt(colCountString);
//   if (colCount < 3) {
//     console.log('col count < 3');
//     return;
//   }

//   const headerRowChildren = Array.from(
//     playlistTable.getElementsByClassName(PLAYLIST_HEADER_ROW_CLASS_NAME)[0]
//       .children,
//   );
//   console.log('headerRowChildren ', headerRowChildren);

//   if (colCount >= headerRowChildren.length) {
//     console.log('col count === children.length');
//     return;
//   }

//   playlistTable.setAttribute(
//     'aria-colcount',
//     headerRowChildren.length.toString(),
//   );
// };

const checkIsPlaylistView = async (e: Location) => {
  const {pathname} = e;
  const [, type, uid] = pathname.split('/');

  console.log('checkIsPlaylistView', pathname, type, uid);

  return type === 'playlist';
};

// const onNavigate = async (e: Location) => {
//   if (kidibiElementSubscription.isNone()) {
//     return;
//   }

//   const subscription = kidibiElementSubscription.unwrap();
//   subscription.unsubscribe();
//   kidibiElementSubscription = None();
// };

const attemptAddKeyColumn = async (
  e: Location,
): Promise<Result<boolean, string>> => {
  if (!checkIsPlaylistView(e)) {
    return Ok(false);
  }

  const headerRes = await addKeyColumnHeader();
  if (headerRes.isErr()) {
    Spicetify.showNotification(headerRes.unwrapErr(), true);
    return Err(headerRes.unwrapErr());
  } else {
    Spicetify.showNotification('Added key column header.');
  }

  const contentRes = await addKeyColumnContent();
  if (contentRes.isErr()) {
    Spicetify.showNotification(contentRes.unwrapErr(), true);
    return Err(contentRes.unwrapErr());
  } else {
    Spicetify.showNotification('Added key column content.');
  }

  return Ok(true);
};

const addKeyColumnHeader = async (): Promise<Result<{}, string>> => {
  const l10n = getL10nOrDefault();

  const maybePlaylistTable = await waitForElement(
    toClassSelectors(PLAYLIST_ELEMENT_CLASS_NAMES),
  );

  if (maybePlaylistTable.isErr()) {
    return Err('Failed to find playlist view.');
  }

  const playlistTable = maybePlaylistTable.unwrap();

  const maybeHeaderElement = await waitForElement(
    toClassSelectors([PLAYLIST_HEADER_ROW_CLASS_NAME]),
  );

  if (maybeHeaderElement.isErr()) {
    return Err('Failed to find playlist header.');
  }

  const headerElement = maybeHeaderElement.unwrap();

  const maybeTemplateElement = await waitForElement(
    toNestedClassSelectors([
      PLAYLIST_ELEMENT_CLASS_NAMES,
      [PLAYLIST_HEADER_ROW_CLASS_NAME],
      [PLAYLIST_HEADER_SECTION_VARIABLE_CLASS_NAME],
    ]),
  );

  if (maybeTemplateElement.isErr()) {
    return Err('Failed to find playlist header template.');
  }

  const templateElement = maybeTemplateElement.unwrap();

  const maybeHeaderLastElement = Option.fromValue(
    headerElement.lastElementChild,
  );
  if (maybeHeaderLastElement.isNone()) {
    return Err('Failed to find last element of playlist header.');
  }

  const headerLastElement = maybeHeaderLastElement.unwrap();

  // - Create a new header element with the content of the template element
  const keyColumnHeader = templateElement.cloneNode(true) as Element;

  // - Place the new header element as the second to last element of the header element
  headerElement.insertBefore(keyColumnHeader, headerLastElement);

  // - Update every element's `aria-colindex` attribute to its position in the list (1-indexed)
  const headerElements = Array.from(headerElement.children);
  headerElements.forEach((element, index) => {
    element.setAttribute('aria-colindex', (index + 1).toString());
  });

  // - Set the key column header's inner button's inner span's text to l10n.playlistHeaderKeyTitle
  const keyColumnHeaderButtonSpan = keyColumnHeader.querySelector(
    'button > span',
  ) as HTMLSpanElement;
  keyColumnHeaderButtonSpan.textContent = l10n.playlistHeaderKeyTitle;

  // - Add identifier class to key column header to check for existence later
  keyColumnHeader.classList.add(KIDIBI_PLAYLIST_COLUMN_HEADER_ID);

  // Update the playlist table element's `aria-colcount` attribute to the number of columns
  playlistTable.setAttribute('aria-colcount', headerElements.length.toString());

  // Set up kidibi element subscription, which observes the playlist table's column count
  // const subscription = observeElement(playlistTable).subscribe(
  //   onTableColumnCountChanged(playlistTable),
  // );
  // kidibiElementSubscription = Some(subscription);

  return Ok({});
};

const addKeyColumnContent = async (): Promise<Result<{}, string>> => {
  return Ok({});
};

export default main;
