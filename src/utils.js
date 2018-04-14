module.exports = {
  toUpper: str => {
    return str
      .toLowerCase()
      .split(" ")
      .map(function(word) {
        return word[0].toUpperCase() + word.substr(1);
      })
      .join(" ");
  },

  addSpace: str => {
    return str.replace("_", " ");
  }
};
