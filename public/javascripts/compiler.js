$(document).ready(function(){
  var code = $(".codeeditor")[0];
  var editor = CodeMirror.fromTextArea(code, {
    lineNumbers : true,
    mode : 'python'
  });

});
