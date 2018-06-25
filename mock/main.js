scenario = require('./scenario');

function setDefaultHeaders(forHandler, req, res) {
  res.type('application/json');
  res.status(200);
  return forHandler(req, res);
}

scenario.routes.forEach(function (routeDefinition) {
  Sandbox.define(
    routeDefinition.route,
    routeDefinition.verb,
    function (req, res) {
      setDefaultHeaders(routeDefinition.handler, req, res);
    });
});
