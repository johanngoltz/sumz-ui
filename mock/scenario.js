var utils = require('./utils');

exports.routes = [{
  route: '/scenario',
  verb: 'GET',
  handler: function (req, res) {
    res.json(state.scenarios);
  },
},
{
  route: '/scenario',
  verb: 'POST',
  handler: function (req, res) {
    state.scenarios.push(req.body)
    res.json(req.body);
    res.status(201);
  },
},
{
  route: '/scenario/:sId',
  verb: 'GET',
  handler: function (req, res) {
    var scenario = utils.getById(req.params.sId, state.scenarios);
    res.json(scenario);
  },
},
{
  route: '/scenario/:sId',
  verb: 'PUT',
  handler: function (req, res) {
    utils.setById(req.params.sId, state.scenarios, req.body);
    res.json(req.body);
  }
},
{
  route: '/scenario/:sId',
  verb: 'DELETE',
  handler: function (req, res) {
    state.scenarios.splice(
      utils.findIndex(state.scenarios, function (scenario) {
        return scenario.id === req.params.sId;
      }),
      0);
    res.send(true);
  }
}
];
