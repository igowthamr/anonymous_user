
exports.getUser = function(req, res) {
	var db = req.db;
	var collection = db.collection('users');
	var name = req.params.name;
	collection.findOne({
		'ip': req.ip
	}, function(err, item) {
		if (item) {
			res.render('success', {
				ip: item.ip,
				details: item.other
			});
		}
		else {
			res.render('error', {
				message: 'Not Found'
			});
		}
	});
};

getUser = function(req,res){
	var db = req.db;
	var collection = db.collection('users');
	var name = req.params.name;
	return collection.findOne({
		'ip': req.ip
	});
}


exports.createUser = function(req, res) {
	var db = req.db;
	var collection = db.collection('users');
	var post = {ip:req.ip,other:req.headers};
	var user = getUser(req,res).then((user)=>{
		res.render("success",{
			message: "User exists already!!",
			ip:user.ip,
			details: user.other
		});
	}).catch(()=>{
		collection.insert(post, {
			safe: true
		}, function(error, result) {
			if (error) {
				res.render('error', {
					message: 'User Save Failed!'
				});
			}
			else {
				res.render("success",{
					ip: req.ip,
					details: req.headers
				});
			}
		});
	});
};

