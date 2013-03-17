chrome.extension.onMessage.addListener(function (msg) {
	if (msg.command !== 'createContextMenu') {
		return;
	}
	chrome.contextMenus.removeAll();
	createMenus('Script', msg.scripts, msg.domain);
	createMenus('CSS', msg.links, msg.domain);
});
chrome.contextMenus.onClicked.addListener(function(clickData) {
	chrome.tabs.create({
		'url' : clickData.menuItemId
	});
});
function createMenus (type, urls, domain) {
	var type_id = 'root:' + type;
	chrome.contextMenus.create({
		'title' : type,
		'contexts' : ['page'],
		'id' : type_id
	});
	var filter = {};
	var map = {};
	urls.filter(function (url) {
		return filter[url] = ~~filter[url] + 1;
	}).forEach(function (url) {
		var loc = Location.parse(url);
		map[loc.host] = map[loc.host] || [];
		map[loc.host].push(loc);
	});
	if (map[domain]) {
		addContextmenu(type_id, map[domain]);
		delete map[domain];
	}
	Object.keys(map).sort().forEach(function (domain) {
		var domain_id = type_id + ':domain:' + domain;
		chrome.contextMenus.create({
			'id' : domain_id,
			'title' : domain,
			'contexts' : ['page'],
			'enabled' : false,
			'parentId' : type_id
		});
		addContextmenu(domain_id, map[domain]);
	});
};
function addContextmenu (parentId, urls) {
	urls.forEach(function (url) {
		var file = url.pathname.split('/').pop();
		chrome.contextMenus.create({
			'id' : url.href,
			'title' : file,
			'contexts' : ['page'],
			'parentId' : parentId
		});
	});
}