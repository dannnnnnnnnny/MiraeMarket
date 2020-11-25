var rockets = [
	{ country: 'Russia', launches: 32 },
	{ country: 'US', launches: 23 },
	{ country: 'China', launches: 16 },
	{ country: 'Europe(ESA)', launches: 7 },
	{ country: 'India', launches: 4 },
	{ country: 'Japan', launches: 3 },
];

var launchOptimistic = rockets.map(function (elem) {
	return {
		country: elem.country,
		launches: elem.launches + 10,
	};
});

console.log(launchOptimistic);
