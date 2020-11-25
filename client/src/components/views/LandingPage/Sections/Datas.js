const continents = [
	{
		_id: 1,
		name: 'Africa',
	},
	{
		_id: 2,
		name: 'Europe',
	},
	{
		_id: 3,
		name: 'Asia',
	},
	{
		_id: 4,
		name: 'North America',
	},
	{
		_id: 5,
		name: 'South America',
	},
	{
		_id: 6,
		name: 'Australia',
	},
	{
		_id: 7,
		name: 'Antarctica',
	},
];

const price = [
	{
		"_id": 0,
		"name": "Any",
		"array": []
	},
	{
		"_id": 1,
		"name": "0 ~ 6999",
		"array": [0, 6999]			// [0, 199]
	},
	{
		"_id": 2,
		"name": "7000 ~ 13999",
		"array": [7000, 13999]
	},
	{
		"_id": 3,
		"name": "14000 ~ 49999",
		"array": [14000, 49999]
	},
	{
		"_id": 4,
		"name": "50000 ~ 99999",
		"array": [50000, 99999]
	},
	{
		"_id": 5,
		"name": "100000 ~ ",
		"array": [100000, 100000000]
	}
]

export {
	continents,
	price
}