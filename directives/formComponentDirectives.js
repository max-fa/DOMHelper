formComponent.directives.register("onClick",function($) {
	$(this).on("click",function(evt) {
		alert("You're about to submit the form");
		formComponent.getUsers();
	});		
});