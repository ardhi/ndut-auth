module.exports = text => {
  return /^[a-f0-9]{32}$/i.test(text)
}
