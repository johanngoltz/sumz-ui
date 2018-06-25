scenario = require('./scenario');
console.log(scenario.routes);

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

Sandbox.define('/project', 'GET', function (req, res) {
  // Set the type of response, sets the content type.
  res.type('application/json');

  // Set the status code of the response.
  res.status(200);

  // Send the response body.
  res.json(state.projects);
})

Sandbox.define('/project/{id}', 'GET', function (req, res) {
  res.type('application/json');
  res.status(200);
  var project = "placeholder";
  for (var i = 0; i < state.projects.length; i++) {
    if (state.projects[i].id == req.params.id) {
      project = state.projects[i];
      break;
    }
  }
  return res.json(project);
})

Sandbox.define('/project/{id}', 'DELETE', function (req, res) {
  res.status(404);
  for (var i = 0; i < state.projects.length; i++) {
    if (state.projects[i].id == req.params.id) {
      state.projects.splice(i, 1);
      res.status(200);
      break;
    }
  }
  return res.json({});
})

Sandbox.define('/project/{id}', 'PATCH', function (req, res) {
  for (var i = 0; i < state.projects.length; i++) {
    if (state.projects[i].id == req.params.id) {
      state.projects[i] = req.body;
      res.status(200);
      break;
    }
  }
})

Sandbox.define('/project', 'POST', function (req, res) {
  // Check the request, make sure it is a compatible type
  if (!req.is('application/json')) {
    return res.send(400, 'Invalid content type, expected application/json');
  }

  // Set the type of response, sets the content type.
  res.type('application/json');

  req.body.id = Math.random();
  req.body.scenarios = [];
  state.projects.push(req.body);

  // Set the status code of the response.
  res.status(200);

  // Send the response body.
  res.json(req.body);
})

// Login
Sandbox.define('/oauth/token', 'POST', function (req, res) {
  // Check the request, make sure it is a compatible type
  if (!req.is('application/json')) {
    return res.send(400, 'Invalid content type, expected application/json');
  }

  // Check login credentials
  if (!(req.body.email === 'tomastepa@web.de' && req.body.password === '123' && req.body.grant_type === 'password')) {
    return res.send(401, 'Invalid username or password')
  }

  // Set the type of response, sets the content type.
  res.type('application/json');

  // Set the status code of the response.
  res.status(200);

  // Send the response body.
  res.json(
    {
      access_token: "214vg3hg2v123f123f4ghv",
      refresh_token: "dfshbfhb367gfvagfasf",
      token_type: "bearer",
      expires_in: 1234,			
	    scope: "read write",			 
	    jti: "",	
	    id: 1,
    }
  );

})

// Registration
Sandbox.define('/users', 'POST', function (req, res) {
  // Check the request, make sure it is a compatible type
  if (!req.is('application/json')) {
    return res.send(400, 'Invalid content type, expected application/json');
  }

  // Set the type of response, sets the content type.
  res.type('application/json');

  // Set the status code of the response.
  res.status(302); //redirect to page like "successful registration"

  res.json(
    {
      
    }
  );

})