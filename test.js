Array.prototype.asyncFilter = async function (callback) {
	const fail = Symbol();
	return (
		await Promise.all(
			this.map(async (item) => ((await callback(item)) ? item : fail)),
		)
	).filter((i) => i !== fail);
};

const testFunction2 = () => {
	const num = Promise.all(
		[1, 2, 3].asyncFilter(async (i) => {
			return (await i) * 2;
		}),
	);

	console.log(num);
};

testFunction2();


