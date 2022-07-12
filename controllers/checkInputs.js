const checkInputs = (...inputs) => {
  const isEmpty = inputs.some(
    (input) => input?.length === 0 || input === undefined
  );
  if (isEmpty) throw new Error('not enough data provided');
};

module.exports = { checkInputs };
