var utils = require('./utils');

exports.routes = [{
  route: '/scenario',
  verb: 'GET',
  handler: function (req, res) {
    res.json(state.scenarios);

    // Interceptor test
    if(req.headers.Authorization === undefined || req.headers.Authorization !== 'bearer 214vg3hg2v123f123f4ghv_') {
      return res.send(401, 'Invalid token at /scenario');
    }
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
