chrome.tabs.onActivated.addListener(function () {
	chrome.contextMenus.removeAll();
});
chrome.extension.onMessage.addListener(function (msg) {
	if (msg.command !== 'createContextMenu') {
		return;
	}
	chrome.contextMenus.removeAll();
	createMenus('Script', msg.scripts, msg.domain);
	createMenus('CSS', msg.links, msg.domain);
});
chrome.contextMenus.onClicked.addListener(function(clickData) {
	if (clickData.menuItemId.match(/^root:/)) {
		return;
	}
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
	urls.map(function (url) {
		return Location.parse(url);
	}).filter(function (loc) {
		var path = loc.pathname
			? loc.host + loc.pathname
			: loc.href
		;
		filter[path] = ~~filter[path] + 1;
		return filter[path] === 1;
	}).forEach(function (loc) {
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
		file = file || url.pathname;
		file = file || url.host;
		chrome.contextMenus.create({
			'id' : url.href,
			'title' : file,
			'contexts' : ['page'],
			'parentId' : parentId
		});
	});
}