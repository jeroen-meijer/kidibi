export const toClassSelectors = (classNames: string[]) =>
  classNames.map((className) => `.${className}`).join('');

export const toNestedClassSelectors = (classNames: string[][]) => {
  const selectors = classNames.map((classNames) =>
    toClassSelectors(classNames),
  );
  return selectors.join(' ');
};
