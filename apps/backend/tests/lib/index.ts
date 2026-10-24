const randomInteger = (min: number, max: number) => {
  return Math.floor(Math.random() * max) + min;
};

export { randomInteger };
