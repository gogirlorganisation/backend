var code = $(".codeeditor")[0];
var editor = CodeMirror.fromTextArea(code, {
	lineNumbers: true,
	mode: 'python'
});

editor.on('change', function() {
	editor.save();
});
