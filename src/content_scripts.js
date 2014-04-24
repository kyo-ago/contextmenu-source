var getPaths = function (s, k) {
	return Array.prototype.map.call(document.querySelectorAll(s), function (elem) {
		return elem[k];
	}).filter(function (url) {
		return !url.match(/^chrome-extension:\/\//);
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
var delayLoad = function () {
	setTimeout(loadScript, 500);
};
document.addEventListener('webkitvisibilitychange', loadScript);
window.addEventListener('load', delayLoad);
if (document.readyState === 'complete') {
	delayLoad();
}
loadScript();