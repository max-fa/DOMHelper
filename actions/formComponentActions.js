formComponent.actions.register("setUsers",function(data) {
	/*data.users = DataUtils.collection([
		"Max",
		"Ronald",
		"Linus"
	]);
	data.test = DataUtils.Map({
		name: "Foo"
	});*/
	data.userCount = 10;
}).register("getUsers",function(data) {
	console.log(data.users);
	console.log(data);
});

formComponent.setUsers();

