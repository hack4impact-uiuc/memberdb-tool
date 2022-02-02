// eslint-disable-next-line import/prefer-default-export
export const titleCaseFormatter = (value) => {
  if (value?.substring) {
    const values = value.split('_');
    const capitalizedValues = values.map(
      (val) =>
        val.substring(0, 1).toUpperCase() + val.substring(1).toLowerCase(),
    );
    return capitalizedValues.join(' ');
  }
  return value;
};
