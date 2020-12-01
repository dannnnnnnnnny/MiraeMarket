const mongoose = require('mongoose');
const bestSellerSchema = mongoose.Schema(
	{
        title: String,
        image: String
	}
);

const BestSeller = mongoose.model('BestSeller', bestSellerSchema);

module.exports = { BestSeller };
