module.exports = {
  toUpper: str => {
    if (!str) return str;
    return str
      .toLowerCase()
      .split(" ")
      .map(function(word) {
        return word[0].toUpperCase() + word.substr(1);
      })
      .join(" ");
  },

  addSpace: str => {
    if (!str) return str;
    if (str.indexOf("_") !== -1) {
      return str.replace("_", " ");
    }
    return str;
  }
};
