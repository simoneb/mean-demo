angular.module('meanDemo', [])
	.controller('mainCtrl', function($scope, $http, $q){
		var main = this;
		
		loadTodos();
		
		main.addTodo = function(text) {
			$http.post('/todo', { text: text })
				.then(loadTodos);
		};
		
		main.changeCompleted = function(todo) {
			$http.put('/todo/' + todo._id, todo)
				.then(loadTodos);
		};
		
		main.clearCompleted = function() {
			$q.all(main.todos
					.filter(function(todo) { return todo.completed; })
					.map(function(todo) {
						return $http.delete('/todo/' + todo._id);
					})).then(loadTodos);
		};
		
		function loadTodos() {			
			$http.get('/todo').then(function(res) {
				main.todos = res.data;
			});
		}
	});