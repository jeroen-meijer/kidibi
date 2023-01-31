import {Err, Ok, Result} from './';

export type Option<T> = (
  | {
      type: 'Some';
      value: T;
    }
  | {
      type: 'None';
    }
) & {
  map: <U>(fn: (value: T) => U) => Option<U>;
  isSome: () => boolean;
  isNone: () => boolean;
  unwrap: () => T;
  unwrapOr: (defaultValue: T) => T;
  unwrapOrElse: (fn: () => T) => T;
  expect: (message: string) => T;
  okOr: <E>(err: E) => Result<T, E>;
  okOrElse: <E>(fn: () => E) => Result<T, E>;
};

// Export an object called 'Option' that contains a function .fromValue(v: any)
// that takes a value and returns an Option<T> object.
export const Option = {
  fromValue: <T>(value: T | undefined | null): Option<T> => {
    if (value === null || value === undefined) {
      return None();
    } else {
      return Some<T>(value);
    }
  },
};

export const Some = <T>(value: T): Option<T> => ({
  type: 'Some',
  value,
  map: function (fn) {
    return Some(fn(this.value));
  },
  isSome: function () {
    return true;
  },
  isNone: function () {
    return false;
  },
  unwrap: function () {
    return this.value;
  },
  unwrapOr: function () {
    return this.value;
  },
  unwrapOrElse: function () {
    return this.value;
  },
  expect: function () {
    return this.value;
  },
  okOr: function (err) {
    return Ok(this.value);
  },
  okOrElse: function (fn) {
    return Ok(this.value);
  },
});

export const None = <T>(): Option<T> => ({
  type: 'None',
  map: function () {
    return None();
  },
  isSome: function () {
    return false;
  },
  isNone: function () {
    return true;
  },
  unwrap: function () {
    throw new Error('Cannot unwrap None');
  },
  unwrapOr: function (defaultValue) {
    return defaultValue;
  },
  unwrapOrElse: function (fn) {
    return fn();
  },
  expect: function (message) {
    throw new Error(message);
  },
  okOr: function (err) {
    return Err(err);
  },
  okOrElse: function (fn) {
    return Err(fn());
  },
});
