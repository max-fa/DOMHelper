MainComponent.directives.register("alerty",function(jQuery) {
	var $ = jQuery;
	$(this).on("click",function(evt) {
		alert("Boo!!!!!!!!!!!!!!");
	});
});