var getPaths = function (s, k) {
	return Array.prototype.map.call(document.querySelectorAll(s), function (elem) {
		return elem[k];
	});
};
chrome.extension.sendMessage({
	'command' : 'loadElements',
	'scripts' : getPaths('script[src]', 'src'),
	'links' : getPaths('link[href][rel="stylesheet"]', 'href')
});
