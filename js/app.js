data = [{
			id: 1,
			name: "Kanye West", 
			votes: {
					up: 0, 
					down: 0
				}, 
			date: '1 month ago',
			section: 'Entertainment',
			description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
			image: 'images/Kanye.jpg'
		},
		{
			id: 2,
			name: "Mark Zuckerberg", 
			votes: {
					up: 0, 
					down: 0
				}, 
			date: '1 month ago',
			section: 'Business',
			description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
			image: 'images/Mark.png'
		},
		{
			id: 3,
			name: "Cristina Fernandez de Kirchner", 
			votes: {
					up: 0, 
					down: 0
				}, 
			date: '1 month ago',
			section: 'Politics',
			description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
			image: 'images/Cristina.jpeg'
		},
		{
			id: 4,
			name: "Malala Yousafzai", 
			votes: {
					up: 0, 
					down: 0
				}, 
			date: '1 month ago',
			section: 'Entertainment',
			description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
			image: 'images/Malala.jpg'
		}
];

angular.module('VotingApp', [])

.controller('mainController', ['$scope', function($scope){
	$scope.candidates = data;

	$scope.candidatesGroupByRow = [];
	while($scope.candidates.length){
		$scope.candidatesGroupByRow.push($scope.candidates.splice(0,2));
	}
	
}])

.controller('candidateController', ['$scope', 'persistence', function($scope, persistence){

	$scope.tentativeUp = false;
	$scope.tentativeDown = false;
	$scope.hideElements = false;
	$scope.buttonMessage = '';

	if($scope.$parent.candidate !== undefined){
		var total;

		$scope.alreadyVoteState = {
			description: 'Thank you for voting!',
			hideElements: true,
			buttonMessage: "Vote again"
		};

		$scope.voteState = {
			description: $scope.$parent.candidate.description,
			hideElements: false,
			buttonMessage: "Vote now"
		};

		var dataStored = persistence.get($scope.$parent.candidate.id);

		if(dataStored !== undefined){
			$scope.$parent.candidate.votes.up = dataStored.up;
			$scope.$parent.candidate.votes.down = dataStored.down;
		}

		setState('voteState');
		$scope.$parent.$watchGroup(['candidate.votes.up', 'candidate.votes.down'], function(some) {
		    $scope.thereIsVoting = ($scope.$parent.candidate.votes.up + $scope.$parent.candidate.votes.down !== 0)?true: false; 
		    total = $scope.candidate.votes.down + $scope.candidate.votes.up;
		    $scope.upPercentage = calculatePercentage($scope.$parent.candidate.votes.up, total);
		    $scope.downPercentage = calculatePercentage($scope.$parent.candidate.votes.down, total);
		}, true);	
	}

	$scope.upVote = function(){
		$scope.tentativeUp = true;
		$scope.tentativeDown = false;
	}

	$scope.downVote = function(){
		$scope.tentativeDown = true;
		$scope.tentativeUp = false;
	}

	$scope.vote = function(){
		if(!$scope.hideElements){
			if($scope.tentativeUp){
				$scope.$parent.candidate.votes.up += 1;
			}else if($scope.tentativeDown){
				$scope.$parent.candidate.votes.down += 1;
			}
			persistence.save($scope.$parent.candidate.id, 
							{
								up: $scope.$parent.candidate.votes.up,
								down: $scope.$parent.candidate.votes.down	
							});
			setState('alreadyVoteState');
		}else{
			setState('voteState');
		}
	}

	function setState(state){
		$scope.description = $scope[state].description;
		$scope.hideElements = $scope[state].hideElements;
		$scope.buttonMessage = $scope[state].buttonMessage;
	}

	function calculatePercentage(value, total){
		return (value !== 0)? (value*100/total).toFixed(1)+'%': '0%';
	}
}])

/*.factory('contestant', [function(){
	function ContestantRate(id, upVotes, downVotes){
		this.id = id;
		this.upVotes = upVotes;
		this.downVotes = downVotes;
	}

	ContestantRate.prototype.hydrate = function(){
		var memento =  JSON.stringify(this);
		return memento;
	}

	ContestantRate.prototype.dehydrate = function(memento){
		var m = JSON.parse(memento);
        this.id = m.id;
        this.upVotes = m.upVotes;
        this.downVotes = m.downVotes;
	}

	return ContestantRate;
}])*/

.factory('persistence',['$window', function(win){
	var space = 'test-UI';

	return {
		get: function(key){
			var data = JSON.parse(win.localStorage.getItem(space));
			return (data !== null && data !== undefined )?data[key]: undefined;
		},
		save: function(key, value){
			var data = JSON.parse(win.localStorage.getItem(space)) || {};
			data[key] = value;
			win.localStorage.setItem(space, JSON.stringify(data));
			return {key: key, value: value};
		}
	};
}]);




