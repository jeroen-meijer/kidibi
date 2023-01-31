import {None, Option, Some} from './';

export type Result<T, E> = (
  | {
      type: 'Ok';
      value: T;
    }
  | {
      type: 'Err';
      error: E;
    }
) & {
  map: <U>(fn: (value: T) => U) => Result<U, E>;
  mapErr: <F>(fn: (error: E) => F) => Result<T, F>;
  isOk: () => boolean;
  isErr: () => boolean;
  unwrap: () => T;
  unwrapOr: (defaultValue: T) => T;
  unwrapOrElse: (fn: () => T) => T;
  unwrapErr: () => E;
  unwrapErrOr: (defaultValue: E) => E;
  unwrapErrOrElse: (fn: () => E) => E;
  expect: (message: string) => T;
  ok: () => Option<T>;
  err: () => Option<E>;
};

// Export an object called 'Result' that contains a function .fromValue(v: any)
// that takes a value and returns an Result<T, E> object.
export const Result = {
  fromFunction: <T, E>(fn: () => T): Result<T, E> => {
    try {
      return Ok(fn());
    } catch (error) {
      return Err(error as E);
    }
  },
};

export const Ok = <T, E>(value: T): Result<T, E> => ({
  type: 'Ok',
  value,
  map: function (fn) {
    return Ok(fn(this.value));
  },
  mapErr: function () {
    return Ok(this.value);
  },
  isOk: function () {
    return true;
  },
  isErr: function () {
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
  unwrapErr: function () {
    throw new Error('Cannot unwrapErr Ok');
  },
  unwrapErrOr: function (defaultValue) {
    return defaultValue;
  },
  unwrapErrOrElse: function (fn) {
    return fn();
  },
  expect: function () {
    return this.value;
  },
  ok: function () {
    return Some(this.value);
  },
  err: function () {
    return None();
  },
});

export const Err = <T, E>(error: E): Result<T, E> => ({
  type: 'Err',
  error,
  map: function () {
    return Err(this.error);
  },
  mapErr: function (fn) {
    return Err(fn(this.error));
  },
  isOk: function () {
    return false;
  },
  isErr: function () {
    return true;
  },
  unwrap: function () {
    throw new Error('Cannot unwrap Err');
  },
  unwrapOr: function (defaultValue) {
    return defaultValue;
  },
  unwrapOrElse: function (fn) {
    return fn();
  },
  unwrapErr: function () {
    return this.error;
  },
  unwrapErrOr: function () {
    return this.error;
  },
  unwrapErrOrElse: function () {
    return this.error;
  },
  expect: function (message) {
    throw new Error(message);
  },
  ok: function () {
    return None();
  },
  err: function () {
    return Some(this.error);
  },
});
