(function(window, document) {

  var inputs = document.getElementsByTagName('input');
  var textareas = document.getElementsByTagName('textarea');
  var regex = inputs[0];
  var flags = inputs[1];
  var ast = textareas[0];
  var regjsparser = window.regjsparser;
  var permalink = document.getElementById('permalink');
  // https://mathiasbynens.be/notes/localstorage-pattern
  var storage = (function() {
    var uid = new Date;
    var storage;
    var result;
    try {
      (storage = window.localStorage).setItem(uid, uid);
      result = storage.getItem(uid) == uid;
      storage.removeItem(uid);
      return result && storage;
    } catch (exception) {}
  }());

  function encode(string) {
    // URL-encode some more characters to avoid issues when using permalink URLs in Markdown
    return encodeURIComponent(string).replace(/['()_*]/g, function(character) {
      return '%' + character.charCodeAt().toString(16);
    });
  }

  function update() {
    var regexSource = regex.value;
    var regexFlags = flags.value;
    var regexAst;
    var isError = false;
    try {
      regexAst = regjsparser.parse(regexSource, regexFlags);
    } catch (exception) {
      isError = true;
    }
    if (isError) {
      regex.className = flags.className = ast.className = 'invalid';
      ast.value = '// Error during parsing.';
    } else {
      regex.className = flags.className = ast.className = '';
      ast.value = JSON.stringify(regexAst, null, 2);
    }
    permalink.hash = encode('/' + regexSource + '/' + regexFlags);
    storage && (storage.regexSource = regexSource) && (storage.regexFlags = regexFlags);
  };

  regex.oninput = flags.oninput = update;

  if (storage) {
    storage.regexSource && (regex.value = storage.regexSource) && (flags.value = storage.regexFlags);
    update();
  }

  window.onhashchange = function() {
    var value = decodeURIComponent(location.hash.slice(1));
    var lastSlashIndex = value.lastIndexOf('/');
    regex.value = value.slice(1, lastSlashIndex);
    flags.value = value.slice(lastSlashIndex + 1);
    update();
  };

  if (location.hash) {
    window.onhashchange();
  }

}(this, document));
