/**
	
	Like all other nodes, the user has their own
	node, this one is featured at the bottom of the console.

*/
angular.module('OrbitalDrop').directive('clientUser', function() {

	return {
		restrict: 'E',
		replace: true,
		scope:false,
		controller: function(){},
		link: function( scope, element, attributes ){},
		templateUrl: '/orbital-drop/app/templates/client-user.tpl.html'
	}

});
