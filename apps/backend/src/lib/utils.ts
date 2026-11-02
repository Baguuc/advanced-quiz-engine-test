function ltrim(str: string, char: string) {
  while (str.startsWith(char)) {
    str = str.slice(char.length);
  }
  return str;
}

function rtrim(str: string, char: string) {
  while (str.endsWith(char)) {
    str = str.slice(0, str.length - char.length);
  }
  return str;
}

export { ltrim, rtrim };
