var utils = require('./utils');

exports.routes = [
    {
        route: '/project/:pId/scenario',
        verb: 'GET',
        handler: function (req, res) {
            var project = utils.byId(req.params.pId, state.projects);
            res.json(project.scenarios);
        },
    },
    {
        route: '/project/:pId/scenario',
        verb: 'POST',
        handler: function (req, res) {
            var project = utils.byId(req.params.pId, state.projects);
            if (project) {
                req.body.id = Math.random();
                project.scenarios.push(req.body)
                res.json(req.body);
            }
            else {
                req.status(404);
            }
        },
    },
    {
        route: '/project/:pId/scenario/:sId',
        verb: 'GET',
        handler: function (req, res) {
            var project = utils.byId(req.params.pId, state.projects);
            var scenario = utils.byId(req.params.sId, project.scenarios);
            res.json(scenario);
        },
    },
    {
        route: '/project/:pId/scenario/:sId',
        verb: 'PATCH',
        handler: function (req, res) {
            var project = utils.byId(req.params.pId, state.projects);
            for (var i = 0; i < project.scenarios.length; i++) {
                if (project.scenarios[i].id == req.params.sId) {
                    project.scenarios[i] = req.params.body;
                    res.json(req.params.body);
                    return;
                }
            }
        }
    }
];
