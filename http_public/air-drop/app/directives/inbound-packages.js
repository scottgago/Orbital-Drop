/**

	The user-node, outlines the basic structure
	for all clien nodes that are active on the 
	network

*/
angular.module('OrbitalDrop').directive('inboundPackages', function() {

	return {
		restrict: 'E',
		replace:true,
		controller: function(){},
		link:function(scope, element,attr){
			$(element).fadeIn(scope.$index*100);
		},
		templateUrl: '/orbital-drop/app/templates/inbound-packages.tpl.html',

	}
});