// load the things we need
var mongoose = require('mongoose');

// define the schema for our location model
var locationSchema = mongoose.Schema({
    created_time 	: Date,
    title 			: String,
    lat 		    : Number,
    lng             : Number,
    address         : String,
    hash 			: Array,
    user_id         : String,
    comments 		: [
    	{
			user_id: String,
			comment: String,
			created_time: Date,
			rating: Number
    	}
    ]


});

locationSchema.id = mongoose.Types.ObjectId();

// create the model for users and expose it to our app
module.exports = mongoose.model('Location', locationSchema);
