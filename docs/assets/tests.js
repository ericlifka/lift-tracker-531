'use strict';

define("lift-tracker-531/tests/helpers/ember-simple-auth", ["exports", "ember-simple-auth/authenticators/test"], function (_exports, _test) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.authenticateSession = authenticateSession;
  _exports.currentSession = currentSession;
  _exports.invalidateSession = invalidateSession;
  const TEST_CONTAINER_KEY = 'authenticator:test';

  function ensureAuthenticator(app, container) {
    const authenticator = container.lookup(TEST_CONTAINER_KEY);

    if (!authenticator) {
      app.register(TEST_CONTAINER_KEY, _test.default);
    }
  }

  function authenticateSession(app, sessionData) {
    const {
      __container__: container
    } = app;
    const session = container.lookup('service:session');
    ensureAuthenticator(app, container);
    session.authenticate(TEST_CONTAINER_KEY, sessionData);
    return app.testHelpers.wait();
  }

  function currentSession(app) {
    return app.__container__.lookup('service:session');
  }

  function invalidateSession(app) {
    const session = app.__container__.lookup('service:session');

    if (session.get('isAuthenticated')) {
      session.invalidate();
    }

    return app.testHelpers.wait();
  }
});
define("lift-tracker-531/tests/lint/app.lint-test", [], function () {
  "use strict";

  QUnit.module('ESLint | app');
  QUnit.test('adapters/application.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'adapters/application.js should pass ESLint\n\n');
  });
  QUnit.test('app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint\n\n');
  });
  QUnit.test('authenticators/firebase.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'authenticators/firebase.js should pass ESLint\n\n');
  });
  QUnit.test('components/confirm-delete.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/confirm-delete.js should pass ESLint\n\n');
  });
  QUnit.test('components/finish-cycle.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/finish-cycle.js should pass ESLint\n\n');
  });
  QUnit.test('components/settings-account-control.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/settings-account-control.js should pass ESLint\n\n');
  });
  QUnit.test('components/settings-bar-loading-control.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/settings-bar-loading-control.js should pass ESLint\n\n');
  });
  QUnit.test('components/settings-lifts-control.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/settings-lifts-control.js should pass ESLint\n\n');
  });
  QUnit.test('components/title-bar.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/title-bar.js should pass ESLint\n\n');
  });
  QUnit.test('components/workout-logger.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/workout-logger.js should pass ESLint\n\n');
  });
  QUnit.test('components/workout-set.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/workout-set.js should pass ESLint\n\n');
  });
  QUnit.test('controllers/chart.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/chart.js should pass ESLint\n\n4:3 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)');
  });
  QUnit.test('controllers/import.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/import.js should pass ESLint\n\n40:11 - Unexpected console statement. (no-console)\n70:14 - \'_a\' is defined but never used. (no-unused-vars)\n70:27 - \'_c\' is defined but never used. (no-unused-vars)\n70:30 - \'_d\' is defined but never used. (no-unused-vars)\n70:33 - \'_e\' is defined but never used. (no-unused-vars)\n70:36 - \'_f\' is defined but never used. (no-unused-vars)\n70:39 - \'_g\' is defined but never used. (no-unused-vars)\n70:72 - \'_h\' is defined but never used. (no-unused-vars)\n70:75 - \'_i\' is defined but never used. (no-unused-vars)');
  });
  QUnit.test('controllers/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/index.js should pass ESLint\n\n');
  });
  QUnit.test('controllers/login.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/login.js should pass ESLint\n\n');
  });
  QUnit.test('controllers/settings.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/settings.js should pass ESLint\n\n');
  });
  QUnit.test('helpers/capitalize.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/capitalize.js should pass ESLint\n\n');
  });
  QUnit.test('helpers/eq.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/eq.js should pass ESLint\n\n');
  });
  QUnit.test('helpers/join.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/join.js should pass ESLint\n\n');
  });
  QUnit.test('helpers/not.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/not.js should pass ESLint\n\n');
  });
  QUnit.test('models/bar-loading.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/bar-loading.js should pass ESLint\n\n');
  });
  QUnit.test('models/completed-workout.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/completed-workout.js should pass ESLint\n\n');
  });
  QUnit.test('models/lift.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/lift.js should pass ESLint\n\n');
  });
  QUnit.test('resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass ESLint\n\n');
  });
  QUnit.test('router.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass ESLint\n\n');
  });
  QUnit.test('routes/application.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/application.js should pass ESLint\n\n');
  });
  QUnit.test('routes/chart.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/chart.js should pass ESLint\n\n');
  });
  QUnit.test('routes/import.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/import.js should pass ESLint\n\n');
  });
  QUnit.test('routes/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/index.js should pass ESLint\n\n');
  });
  QUnit.test('routes/lift.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/lift.js should pass ESLint\n\n');
  });
  QUnit.test('routes/login.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/login.js should pass ESLint\n\n');
  });
  QUnit.test('routes/settings.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/settings.js should pass ESLint\n\n');
  });
  QUnit.test('routes/week.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/week.js should pass ESLint\n\n');
  });
  QUnit.test('services/wendler.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/wendler.js should pass ESLint\n\n');
  });
  QUnit.test('session-stores/application.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'session-stores/application.js should pass ESLint\n\n');
  });
  QUnit.test('utils/one-rep-estimate.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'utils/one-rep-estimate.js should pass ESLint\n\n');
  });
  QUnit.test('utils/plate-math.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'utils/plate-math.js should pass ESLint\n\n');
  });
  QUnit.test('utils/workout-specs.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'utils/workout-specs.js should pass ESLint\n\n');
  });
});
define("lift-tracker-531/tests/lint/templates.template.lint-test", [], function () {
  "use strict";

  QUnit.module('TemplateLint');
  QUnit.test('lift-tracker-531/templates/application.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'lift-tracker-531/templates/application.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('lift-tracker-531/templates/chart.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'lift-tracker-531/templates/chart.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('lift-tracker-531/templates/components/confirm-delete.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'lift-tracker-531/templates/components/confirm-delete.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('lift-tracker-531/templates/components/finish-cycle.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'lift-tracker-531/templates/components/finish-cycle.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('lift-tracker-531/templates/components/settings-account-control.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'lift-tracker-531/templates/components/settings-account-control.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('lift-tracker-531/templates/components/settings-bar-loading-control.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'lift-tracker-531/templates/components/settings-bar-loading-control.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('lift-tracker-531/templates/components/settings-lifts-control.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'lift-tracker-531/templates/components/settings-lifts-control.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('lift-tracker-531/templates/components/title-bar.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'lift-tracker-531/templates/components/title-bar.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('lift-tracker-531/templates/components/workout-logger.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'lift-tracker-531/templates/components/workout-logger.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('lift-tracker-531/templates/components/workout-set.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'lift-tracker-531/templates/components/workout-set.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('lift-tracker-531/templates/import.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'lift-tracker-531/templates/import.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('lift-tracker-531/templates/index.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'lift-tracker-531/templates/index.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('lift-tracker-531/templates/lift.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'lift-tracker-531/templates/lift.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('lift-tracker-531/templates/login.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'lift-tracker-531/templates/login.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('lift-tracker-531/templates/settings.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'lift-tracker-531/templates/settings.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('lift-tracker-531/templates/week.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'lift-tracker-531/templates/week.hbs should pass TemplateLint.\n\n');
  });
});
define("lift-tracker-531/tests/lint/tests.lint-test", [], function () {
  "use strict";

  QUnit.module('ESLint | tests');
  QUnit.test('test-helper.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint\n\n');
  });
});
define("lift-tracker-531/tests/test-helper", ["lift-tracker-531/app", "lift-tracker-531/config/environment", "@ember/test-helpers", "ember-qunit"], function (_app, _environment, _testHelpers, _emberQunit) {
  "use strict";

  (0, _testHelpers.setApplication)(_app.default.create(_environment.default.APP));
  (0, _emberQunit.start)();
});
define('lift-tracker-531/config/environment', [], function() {
  var prefix = 'lift-tracker-531';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(decodeURIComponent(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

require('lift-tracker-531/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map
