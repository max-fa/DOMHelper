MainComponent.directives.register("another",function($) {
	$(this).on("click",function(evt) {
		console.log(this);
	});
});