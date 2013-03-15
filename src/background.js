chrome.extension.onMessage.addListener(function (msg) {
	chrome.contextMenus.removeAll();
	createMenus('Script', msg.scripts);
	createMenus('CSS', msg.links);
});
chrome.contextMenus.onClicked.addListener(function(clickData) {
	chrome.tabs.create({
		'url' : clickData.menuItemId
	});
});
function createMenus (type, urls) {
	chrome.contextMenus.create({
		'title' : type,
		'contexts' : ['page'],
		'id' : type + '-root'
	});
	urls.filter(function (url) {
		return urls[url] = ~~urls[url] + 1;
	}).forEach(function (url) {
		var file = url.split('?').shift().split('/').pop();
		chrome.contextMenus.create({
			'id' : url,
			'title' : file,
			'contexts' : ['page'],
			'parentId' : type + '-root'
		});
	});
};
