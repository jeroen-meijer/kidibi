import {fromEvent, timer} from 'rxjs';
import {debounceTime, takeUntil, tap} from 'rxjs/operators';

export function observeElement(
  element: Element,
  options: {
    debounce: number;
    expires?: number;
  } = {
    debounce: 100,
  },
) {
  options = Object.assign({debounce: 100, expires: 2000}, options);

  const observer = new MutationObserver((list) => {
    element.dispatchEvent(new CustomEvent('dom-change', {detail: list}));
  });
  observer.observe(element, {
    attributes: false,
    childList: true,
    subtree: true,
  });

  let pipeFn;
  if (options.expires) {
    setTimeout((_) => observer.disconnect(), options.expires);
    pipeFn = takeUntil(timer(options.expires));
  } else {
    pipeFn = tap((_) => _);
  }

  return fromEvent(element, 'dom-change').pipe(
    pipeFn,
    debounceTime(options.debounce),
  );
}
