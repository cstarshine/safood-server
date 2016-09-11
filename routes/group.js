module.exports = group;

function group(app, db, randomStr) {

    app.post('/group/searchGroup', function (req, res) {
        var params = ['query'];
        if (checkParams(req.body, params)) {
            db.UserGroup.find({groupname: req.body.query}, function (err, docs) {
                if (docs.length != 0) res.send(docs);
                else res.sendStatus(401);
            })
        } else res.sendStatus(403);
    });

    app.post('/group/getGroupInfo', function (req, res) {
        var params = ['groupid'];
        if (checkParams(req.body, params)) {
            db.UserGroup.find({groupid: req.body.groupid}, function (err, doc) {
                if (doc.length != 0) res.send(doc);
                else res.sendStatus(401);
            })
        } else res.sendStatus(403);
    });

    app.post('/group/joinGroup', function (req, res) {
        var params = ['apikey', 'groupid'];
        if (checkParams(req.body, params)) {
            db.UserGroup.findOne({groupid: req.body.groupid}, function (err, doc) {
                if (err) throw err;
                else if (doc != null) {
                    if (doc.members.indexOf(req.body.apikey) == -1) {
                        db.UserGroup.update({groupid: req.body.groupid},
                            {$push: {members: req.body.apikey}}, function (err, numAff) {
                                if (err) throw err;
                                else if (numAff == 0) res.sendStatus(401);
                                else res.sendStatus(200);
                            });
                    } else res.sendStatus(409);
                } else res.sendStatus(401);
            });
        } else res.sendStatus(403);
    });
    app.post('/group/leaveGroup', function (req, res) {
        var params = ['apikey', 'groupid'];
        if (checkParams(req.body, params)) {
            db.UserGroup.findOne({groupid: req.body.groupid}, function (err, doc) {
                if (err) throw err;
                else if (doc != null) {
                    if (doc.members.indexOf(req.body.apikey) > -1) {
                        db.UserGroup.update({groupid: req.body.groupid},
                            {pull: {members: req.body.apikey}}, function (err, numAff) {
                                if (err) throw err;
                                else if (numAff == 0) res.sendStatus(401);
                                else res.sendStatus(200);
                            });
                    } else res.sendStatus(409);
                } else res.sendStatus(401);
            });
        } else res.sendStatus(403);
    });


    app.post('/group/admin/checkGroupName', function (req, res) {
        var params = ['groupname'];
        if (checkParams(req.body, params)) {
            db.UserGroup.find({groupname: req.body.groupname}, function (err, docs) {
                if (docs.length != 0) res.sendStatus(200);
                else res.sendStatus(409);
            })
        } else res.sendStatus(403);
    });
    function checkParams(body, params) {
        return params.forEach(str -> body[str] != undefined && body[str] != null);
    }
}