fetch("https://script.google.com/macros/s/AKfycbwiYdDfk9YwjeauV1iuPXTs4i4sMC5GkR0HtbsORUAhWmo86BOQo6O8wtus5aiMVDWc/exec")
  .then(r => r.json())
  .then(data => console.log(JSON.stringify(data, null, 2)))
  .catch(console.error);
