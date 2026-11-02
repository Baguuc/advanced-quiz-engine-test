function ltrim(str: string, char: string) {
  while (str.startsWith(char)) {
    str = str.slice(char.length);
  }
  return str;
}

export { ltrim };