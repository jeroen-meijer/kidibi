import {Option, Some, None, Result} from '../models';

export const waitForElement = async (
  selector: string,
  timeout: number = 10000,
  interval: number = 100,
): Promise<Result<Element, string>> => {
  let _timeout = timeout || 10000;
  let _interval = interval || 100;

  let element: Option<Element> = None();
  while (_timeout > 0 && element.isNone()) {
    element = await _attemptGetElement(selector);
    if (element.isNone()) {
      await new Promise((resolve) => setTimeout(resolve, _interval));
      _timeout -= _interval;
    }
  }

  return element.okOr('Element not found');
};

const _attemptGetElement = async (
  selector: string,
): Promise<Option<Element>> => {
  let element: Option<Element> = None();
  try {
    element = Option.fromValue(
      document.querySelector(selector) as Element | undefined | null,
    );
  } catch (error) {
    element = None();
  }

  return element;
};
