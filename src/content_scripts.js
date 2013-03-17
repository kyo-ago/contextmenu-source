var getPaths = function (s, k) {
	return Array.prototype.map.call(document.querySelectorAll(s), function (elem) {
		return elem[k];
	});
};
var loadScript = function () {
	if (document.webkitHidden) {
		return;
	}
	chrome.extension.sendMessage({
		'command' : 'createContextMenu',
		'scripts' : getPaths('script[src]', 'src'),
		'links' : getPaths('link[href][rel="stylesheet"]', 'href'),
		'domain' : location.host
	});
};
document.addEventListener('webkitvisibilitychange', loadScript);
loadScript();