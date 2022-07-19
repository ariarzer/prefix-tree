module.exports = function unique(arr) {
    return arr.filter((value, index, self) => self.indexOf(value) === index);
}
