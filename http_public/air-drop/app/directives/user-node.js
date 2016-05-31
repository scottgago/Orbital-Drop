/**

	The user-node, outlines the basic structure
	for all clien nodes that are active on the 
	network.

*/
angular.module('OrbitalDrop').directive('userNode', function() {


	return {
		restrict: 'E',
		link: function(scope, element, attrs) {

	        var config = {
	            url: '/files/upload?id='+scope.user.id,
	            id: scope.user.id,
	            type: 'POST',
	        };

	        dropzone = new Dropzone(element.context, config);
	        
	        dropzone.events.forEach(function(event_name){
	        	dropzone.on(event_name, function(){
	        		console.log(event_name + ' Biatch');
	        	})
	        })
	    },
		templateUrl: '/orbital-drop/app/templates/user-node.tpl.html',
	}

});
