'use strict';



;define("lift-tracker-531/adapters/application", ["exports", "emberfire/adapters/firestore"], function (_exports, _firestore) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _firestore.default.extend({// Uncomment the following lines to enable offline persistence and multi-tab support
    // enablePersistence: true,
    // persistenceSettings: { synchronizeTabs: true }
  });

  _exports.default = _default;
});
;define("lift-tracker-531/app", ["exports", "lift-tracker-531/resolver", "ember-load-initializers", "lift-tracker-531/config/environment"], function (_exports, _resolver, _emberLoadInitializers, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  const App = Ember.Application.extend({
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix,
    Resolver: _resolver.default
  });
  (0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);
  var _default = App;
  _exports.default = _default;
});
;define("lift-tracker-531/authenticators/firebase", ["exports", "ember-simple-auth/authenticators/base", "firebase/app"], function (_exports, _base, _app) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _base.default.extend({
    restore(data) {
      // I guess this works? idk
      if (_app.default.auth().currentUser) {
        return Ember.RSVP.resolve(data);
      } else {
        return Ember.RSVP.reject(false);
      }
    },

    authenticate({
      email,
      password
    }) {
      return _app.default.auth().signInWithEmailAndPassword(email, password).then(({
        user
      }) => user);
    },

    invalidate() {
      return _app.default.auth().signOut();
    }

  });

  _exports.default = _default;
});
;define("lift-tracker-531/components/confirm-delete", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({
    classNames: ['confirm-delete'],
    showConfirm: false,
    actions: {
      click() {
        if (!this.get('showConfirm')) {
          this.set('showConfirm', true);
        } else {
          this.set('showConfirm', false);
          this.deleteAction();
        }
      }

    }
  });

  _exports.default = _default;
});
;define("lift-tracker-531/components/finish-cycle", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({
    classNames: ['finish-cycle'],
    wendler: Ember.inject.service(),
    saving: false,
    showModal: false,
    increaseMaxes: true,

    init() {
      this._super(...arguments);

      window.component = this;
    },

    liftModels: Ember.computed('lifts.[]', function () {
      return this.get('lifts').map(lift => Ember.Object.create({
        name: lift.get('name'),
        max: lift.get('max'),
        increase: 5,
        model: lift
      }));
    }),
    actions: {
      showModal() {
        this.set('showModal', true);
      },

      closeModal() {
        this.set('showModal', false);
      },

      increment(liftModel, value) {
        liftModel.incrementProperty('increase', value);
      },

      submit() {
        if (this.get('saving')) {
          return;
        }

        this.set('saving', true);
        let weeks = this.wendler.weeks();
        let models = this.get('liftModels');
        let increaseMaxes = this.get('increaseMaxes');
        return Ember.RSVP.all(models.map(displayModel => {
          let model = displayModel.get('model');
          let increase = displayModel.get('increase');

          if (increaseMaxes) {
            model.incrementProperty('max', +increase);
          }

          weeks.forEach(week => model.set(week, false));
          return model.save();
        })).then(() => {
          this.set('showModal', false);
          this.set('saving', false);
          this.clearCompleted();
        });
      }

    }
  });

  _exports.default = _default;
});
;define("lift-tracker-531/components/high-charts", ["exports", "ember-highcharts/components/high-charts"], function (_exports, _highCharts) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = _highCharts.default;
  _exports.default = _default;
});
;define("lift-tracker-531/components/settings-account-control", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({
    classNames: ['settings-account-control'],
    session: Ember.inject.service(),
    actions: {
      signOut() {
        return this.get('session').invalidate();
      }

    }
  });

  _exports.default = _default;
});
;define("lift-tracker-531/components/settings-bar-loading-control", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({
    classNames: ['settings-bar-loading-control'],

    init(...args) {
      this._super(...args);

      this.setProperties({
        editing: false,
        newPlateValue: '',
        commonBarWeights: [15, 25, 35, 45, 55],
        commonRoundingThresholds: [1, 2.5, 5, 10]
      });
    },

    showWeightsWarning: Ember.computed('model.{rounding,plates.[]}', function () {
      let round = this.get('model.rounding');
      let smallestPlate = this.get('model.plates.0');
      return smallestPlate * 2 > round;
    }),
    actions: {
      showEdit() {
        this.set('editing', true);
      },

      cancelEdit() {
        this.get('model').rollbackAttributes();
        this.set('editing', false);
      },

      saveEdit() {
        this.get('model').save();
        this.set('editing', false);
      },

      setBarWeight(weight) {
        this.set('model.bar', weight);
      },

      setRoundingWeight(weight) {
        this.set('model.rounding', weight);
      },

      deletePlate(plate) {
        let plates = this.get('model.plates');
        plates = plates.filter(p => p != plate);
        this.set('model.plates', plates);
      },

      addNewPlate() {
        let plate = parseFloat(this.get('newPlateValue'));

        if (!Number.isNaN(plate) && plate > 0) {
          let plates = this.get('model.plates').slice();
          plates.push(plate);
          plates.sort((a, b) => a - b);
          this.set('model.plates', plates);
        }

        this.set('newPlateValue', '');
      }

    }
  });

  _exports.default = _default;
});
;define("lift-tracker-531/components/settings-lifts-control", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({
    classNames: ['settings-lifts-control'],
    store: Ember.inject.service(),
    session: Ember.inject.service(),
    editingLifts: false,

    didInsertElement(...args) {
      this._super(...args);

      this.set('pendingLifts', []);
      this.set('toDelete', []);
    },

    lifts: Ember.computed('model', function () {
      return this.get('model').toArray();
    }),
    actions: {
      addToLift(lift, amount) {
        lift.incrementProperty('max', amount);
        lift.save();
      },

      showEdit() {
        this.set('editingLifts', true);
      },

      saveEdit() {
        let lifts = this.get('lifts');
        let pending = this.get('pendingLifts');
        let toDelete = this.get('toDelete');
        pending.forEach(lift => {
          if (!lift.get('name')) {
            lift.set('name', 'new lift');
          }

          if (!lift.get('max')) {
            lift.set('max', 45);
          }

          lifts.pushObject(lift);
        });
        toDelete.forEach(lift => {
          lift.deleteRecord();
          lift.save();
        });
        lifts.forEach(lift => {
          lift.save();
        });
        this.set('toDelete', []);
        this.set('pendingLifts', []);
        this.set('editingLifts', false);
      },

      cancelEdit() {
        this.get('lifts').forEach(lift => {
          lift.rollbackAttributes();
        });
        this.get('toDelete').forEach(lift => {
          this.get('lifts').pushObject(lift);
        });
        this.set('toDelete', []);
        this.set('pendingLifts', []);
        this.set('editingLifts', false);
      },

      deleteLift(lift) {
        this.get('lifts').removeObject(lift);
        this.get('toDelete').pushObject(lift);
      },

      deletePending(lift) {
        this.get('pendingLifts').removeObject(lift);
      },

      addEmptyLift() {
        let lift = this.store.createRecord('lift', {
          userId: this.session.get('data.authenticated.user.uid'),
          name: '',
          max: ''
        });
        this.get('pendingLifts').pushObject(lift);
      }

    }
  });

  _exports.default = _default;
});
;define("lift-tracker-531/components/title-bar", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({
    classNames: ['title-bar'],
    showBackButton: true,
    showSettingsButton: true,
    settingsNavsBack: false,
    actions: {
      navigateBack() {
        history.back();
      }

    }
  });

  _exports.default = _default;
});
;define("lift-tracker-531/components/workout-logger", ["exports", "lift-tracker-531/utils/one-rep-estimate"], function (_exports, _oneRepEstimate) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({
    classNames: ['workout-logger'],
    store: Ember.inject.service(),
    session: Ember.inject.service(),
    showForm: false,
    saving: false,
    showSuccess: false,

    didReceiveAttrs() {
      this._super(...arguments);

      this.setInitialValues();
    },

    estimate: Ember.computed('weight', 'reps', function () {
      return (0, _oneRepEstimate.oneRepEstimate)(this.get('weight'), this.get('reps'));
    }),
    actions: {
      openForm() {
        this.set('showForm', true);
      },

      cancel() {
        this.set('showForm', false);
        this.setInitialValues();
      },

      submit() {
        this.set('saving', true);
        this.set('showForm', false);
        let userId = this.session.get('data.authenticated.user.uid');
        let weight = this.get('weight');
        let reps = this.get('reps');
        let estimate = this.get('estimate');
        let lift = this.get('lift');
        let week = this.get('week');
        let logEntry = this.store.createRecord('completed-workout', {
          userId,
          weight,
          reps,
          lift,
          estimatedMax: estimate,
          date: new Date()
        });
        return logEntry.save().then(() => {
          lift.set(week, true);
          return lift.save();
        }).then(() => {
          this.set('showSuccess', true);
          this.set('saving', false);
          Ember.run.later(this, function () {
            history.back();
          }, 1000);
        });
      }

    },

    setInitialValues() {
      let weight = this.get('workout.movements.lastObject.weight');
      let reps = this.get('workout.movements.lastObject.reps');
      this.setProperties({
        weight,
        reps
      });
    }

  });

  _exports.default = _default;
});
;define("lift-tracker-531/components/workout-set", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({
    classNames: ['workout-set'],
    classNameBindings: ['isCompleted:complete']
  });

  _exports.default = _default;
});
;define("lift-tracker-531/controllers/import", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  const _mappings_ = {
    squat: "Squat",
    press: "Military Press",
    deadlift: "Dead Lift",
    bench: "Bench Press"
  };

  const createMapping = lifts => {
    let mapping = {};
    lifts.forEach(lift => {
      mapping[_mappings_[lift.get('name')]] = lift;
    });
    return mapping;
  };

  var _default = Ember.Controller.extend({
    store: Ember.inject.service(),
    session: Ember.inject.service(),
    processing: false,
    deleteOld: true,
    importCSV: '',
    actions: {
      processText() {
        if (!this.get('importCSV')) return;
        this.set('processing', true);
        let userId = this.session.get('data.authenticated.user.uid');
        return Ember.RSVP.resolve().then(() => this.dropData(userId)).then(() => this.importData(userId)).then(() => {
          console.log('all done');
          this.set('processing', false);
        });
      }

    },

    dropData(userId) {
      if (!this.get('deleteOld')) {
        return Ember.RSVP.resolve();
      }

      return this.store.query('completed-workout', {
        filter: {
          userId
        }
      }).then(records => Ember.RSVP.all(records.map(record => {
        record.deleteRecord();
        return record.save();
      })));
    },

    importData(userId) {
      let modelMappings = createMapping(this.get('model'));
      let text = this.get('importCSV');
      let promises = text.split('\n').slice(6, -1).map(row => row.split(',')).map(row => row.map(str => str.slice(1, -1))).map(([_a, week, lift, _c, _d, _e, _f, _g, reps, weight, estimatedMax, date, _h, _i]) => week === "4" || estimatedMax <= 0 ? null // skip deload workouts
      : this.store.createRecord('completed-workout', {
        userId,
        lift: modelMappings[lift],
        reps: parseInt(reps, 10),
        weight: parseInt(weight, 10),
        estimatedMax: parseInt(estimatedMax, 10),
        date: new Date(date + "T12:00:00.000Z")
      })).filter(model => !!model).map(record => record.save());
      return Ember.RSVP.all(promises);
    }

  });

  _exports.default = _default;
});
;define("lift-tracker-531/controllers/index", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Controller.extend({
    actions: {
      clearCompleted() {
        this.get('model.weeks').forEach(week => {
          Ember.set(week, 'isCompleted', false);
        });
      }

    }
  });

  _exports.default = _default;
});
;define("lift-tracker-531/controllers/login", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Controller.extend({
    session: Ember.inject.service(),
    email: "",
    password: "",
    actions: {
      login(email, password) {
        return this.get('session').authenticate('authenticator:firebase', {
          email,
          password
        });
      }

    }
  });

  _exports.default = _default;
});
;define("lift-tracker-531/controllers/settings", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Controller.extend({
    showAccountTab: false,
    showLiftsTab: true,
    showBarLoadingTab: false,
    actions: {
      showAccountTab() {
        this.setProperties({
          showAccountTab: true,
          showLiftsTab: false,
          showBarLoadingTab: false
        });
      },

      showLiftsTab() {
        this.setProperties({
          showAccountTab: false,
          showLiftsTab: true,
          showBarLoadingTab: false
        });
      },

      showBarLoadingTab() {
        this.setProperties({
          showAccountTab: false,
          showLiftsTab: false,
          showBarLoadingTab: true
        });
      }

    }
  });

  _exports.default = _default;
});
;define("lift-tracker-531/helpers/app-version", ["exports", "lift-tracker-531/config/environment", "ember-cli-app-version/utils/regexp"], function (_exports, _environment, _regexp) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.appVersion = appVersion;
  _exports.default = void 0;

  function appVersion(_, hash = {}) {
    const version = _environment.default.APP.version; // e.g. 1.0.0-alpha.1+4jds75hf
    // Allow use of 'hideSha' and 'hideVersion' For backwards compatibility

    let versionOnly = hash.versionOnly || hash.hideSha;
    let shaOnly = hash.shaOnly || hash.hideVersion;
    let match = null;

    if (versionOnly) {
      if (hash.showExtended) {
        match = version.match(_regexp.versionExtendedRegExp); // 1.0.0-alpha.1
      } // Fallback to just version


      if (!match) {
        match = version.match(_regexp.versionRegExp); // 1.0.0
      }
    }

    if (shaOnly) {
      match = version.match(_regexp.shaRegExp); // 4jds75hf
    }

    return match ? match[0] : version;
  }

  var _default = Ember.Helper.helper(appVersion);

  _exports.default = _default;
});
;define("lift-tracker-531/helpers/capitalize", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.capitalize = capitalize;
  _exports.default = void 0;

  function capitalize([str = ""]) {
    return Ember.String.capitalize(str);
  }

  var _default = Ember.Helper.helper(capitalize);

  _exports.default = _default;
});
;define("lift-tracker-531/helpers/eq", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.eq = eq;
  _exports.default = void 0;

  function eq([left, right]) {
    return left === right;
  }

  var _default = Ember.Helper.helper(eq);

  _exports.default = _default;
});
;define("lift-tracker-531/helpers/join", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.join = join;
  _exports.default = void 0;

  function join([str = "", list = []]) {
    return list.join(str);
  }

  var _default = Ember.Helper.helper(join);

  _exports.default = _default;
});
;define("lift-tracker-531/helpers/not", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.not = not;
  _exports.default = void 0;

  function not([bool]) {
    return !bool;
  }

  var _default = Ember.Helper.helper(not);

  _exports.default = _default;
});
;define("lift-tracker-531/helpers/pluralize", ["exports", "ember-inflector/lib/helpers/pluralize"], function (_exports, _pluralize) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = _pluralize.default;
  _exports.default = _default;
});
;define("lift-tracker-531/helpers/singularize", ["exports", "ember-inflector/lib/helpers/singularize"], function (_exports, _singularize) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = _singularize.default;
  _exports.default = _default;
});
;define("lift-tracker-531/index", [], function () {
  "use strict";
});
;define("lift-tracker-531/initializers/app-version", ["exports", "ember-cli-app-version/initializer-factory", "lift-tracker-531/config/environment"], function (_exports, _initializerFactory, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  let name, version;

  if (_environment.default.APP) {
    name = _environment.default.APP.name;
    version = _environment.default.APP.version;
  }

  var _default = {
    name: 'App Version',
    initialize: (0, _initializerFactory.default)(name, version)
  };
  _exports.default = _default;
});
;define("lift-tracker-531/initializers/container-debug-adapter", ["exports", "ember-resolver/resolvers/classic/container-debug-adapter"], function (_exports, _containerDebugAdapter) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = {
    name: 'container-debug-adapter',

    initialize() {
      let app = arguments[1] || arguments[0];
      app.register('container-debug-adapter:main', _containerDebugAdapter.default);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }

  };
  _exports.default = _default;
});
;define("lift-tracker-531/initializers/ember-data", ["exports", "ember-data/setup-container", "ember-data"], function (_exports, _setupContainer, _emberData) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  /*
  
    This code initializes Ember-Data onto an Ember application.
  
    If an Ember.js developer defines a subclass of DS.Store on their application,
    as `App.StoreService` (or via a module system that resolves to `service:store`)
    this code will automatically instantiate it and make it available on the
    router.
  
    Additionally, after an application's controllers have been injected, they will
    each have the store made available to them.
  
    For example, imagine an Ember.js application with the following classes:
  
    ```app/services/store.js
    import DS from 'ember-data';
  
    export default DS.Store.extend({
      adapter: 'custom'
    });
    ```
  
    ```app/controllers/posts.js
    import { Controller } from '@ember/controller';
  
    export default Controller.extend({
      // ...
    });
  
    When the application is initialized, `ApplicationStore` will automatically be
    instantiated, and the instance of `PostsController` will have its `store`
    property set to that instance.
  
    Note that this code will only be run if the `ember-application` package is
    loaded. If Ember Data is being used in an environment other than a
    typical application (e.g., node.js where only `ember-runtime` is available),
    this code will be ignored.
  */
  var _default = {
    name: 'ember-data',
    initialize: _setupContainer.default
  };
  _exports.default = _default;
});
;define("lift-tracker-531/initializers/ember-simple-auth", ["exports", "lift-tracker-531/config/environment", "ember-simple-auth/configuration", "ember-simple-auth/initializers/setup-session", "ember-simple-auth/initializers/setup-session-service", "ember-simple-auth/initializers/setup-session-restoration"], function (_exports, _environment, _configuration, _setupSession, _setupSessionService, _setupSessionRestoration) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = {
    name: 'ember-simple-auth',

    initialize(registry) {
      const config = _environment.default['ember-simple-auth'] || {};
      config.rootURL = _environment.default.rootURL || _environment.default.baseURL;

      _configuration.default.load(config);

      (0, _setupSession.default)(registry);
      (0, _setupSessionService.default)(registry);
      (0, _setupSessionRestoration.default)(registry);
    }

  };
  _exports.default = _default;
});
;define("lift-tracker-531/initializers/emberfire", ["exports", "emberfire/initializers/emberfire"], function (_exports, _emberfire) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _emberfire.default;
    }
  });
});
;define("lift-tracker-531/initializers/export-application-global", ["exports", "lift-tracker-531/config/environment"], function (_exports, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.initialize = initialize;
  _exports.default = void 0;

  function initialize() {
    var application = arguments[1] || arguments[0];

    if (_environment.default.exportApplicationGlobal !== false) {
      var theGlobal;

      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _environment.default.exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember.String.classify(_environment.default.modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;
        application.reopen({
          willDestroy: function () {
            this._super.apply(this, arguments);

            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  var _default = {
    name: 'export-application-global',
    initialize: initialize
  };
  _exports.default = _default;
});
;define("lift-tracker-531/instance-initializers/ember-data", ["exports", "ember-data/initialize-store-service"], function (_exports, _initializeStoreService) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = {
    name: 'ember-data',
    initialize: _initializeStoreService.default
  };
  _exports.default = _default;
});
;define("lift-tracker-531/instance-initializers/ember-simple-auth", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  // This is only needed for backwards compatibility and will be removed in the
  // next major release of ember-simple-auth. Unfortunately, there is no way to
  // deprecate this without hooking into Ember's internals…
  var _default = {
    name: 'ember-simple-auth',

    initialize() {}

  };
  _exports.default = _default;
});
;define("lift-tracker-531/models/bar-loading", ["exports", "ember-data"], function (_exports, _emberData) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  const {
    Model,
    attr
  } = _emberData.default;

  var _default = Model.extend({
    bar: attr('number'),
    rounding: attr('number'),
    plates: attr()
  });

  _exports.default = _default;
});
;define("lift-tracker-531/models/completed-workout", ["exports", "ember-data"], function (_exports, _emberData) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  const {
    Model,
    attr,
    belongsTo
  } = _emberData.default;

  var _default = Model.extend({
    userId: attr('string'),
    date: attr('date'),
    weight: attr('number'),
    reps: attr('number'),
    estimatedMax: attr('number'),
    lift: belongsTo('lift')
  });

  _exports.default = _default;
});
;define("lift-tracker-531/models/lift", ["exports", "ember-data"], function (_exports, _emberData) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  const {
    Model,
    attr,
    hasMany
  } = _emberData.default;

  var _default = Model.extend({
    name: attr('string'),
    max: attr('number'),
    userId: attr('string'),
    completedWorkouts: hasMany('completed-workout'),
    '5-5-5': attr('boolean'),
    '3-3-3': attr('boolean'),
    '5-3-1': attr('boolean'),
    'deload': attr('boolean')
  });

  _exports.default = _default;
});
;define("lift-tracker-531/resolver", ["exports", "ember-resolver"], function (_exports, _emberResolver) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = _emberResolver.default;
  _exports.default = _default;
});
;define("lift-tracker-531/router", ["exports", "lift-tracker-531/config/environment"], function (_exports, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  const Router = Ember.Router.extend({
    location: _environment.default.locationType,
    rootURL: _environment.default.rootURL
  });
  Router.map(function () {
    this.route('week', {
      path: 'week/:week_id'
    });
    this.route('lift', {
      path: 'lift/:week_id/:lift_id'
    });
    this.route('settings');
    this.route('login');
    this.route('chart');
    this.route('import');
  });
  var _default = Router;
  _exports.default = _default;
});
;define("lift-tracker-531/routes/application", ["exports", "ember-simple-auth/mixins/application-route-mixin"], function (_exports, _applicationRouteMixin) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Route.extend(_applicationRouteMixin.default, {});

  _exports.default = _default;
});
;define("lift-tracker-531/routes/chart", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  const chartOptions = {
    chart: {
      type: 'line',
      height: "600px"
    },
    title: {
      text: ''
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        month: '%e. %b',
        year: '%b'
      },
      title: {
        text: ''
      }
    },
    yAxis: {
      title: {
        text: ''
      }
    },
    tooltip: {
      headerFormat: '<b>{series.name}</b><br>{point.x:%e. %b}<br>',
      pointFormat: 'lifted:{point.weight}lbs x{point.reps}<br>1 rep: {point.y}lbs'
    },
    plotOptions: {
      line: {
        animation: {
          duration: 0
        },
        dataLabels: {
          enabled: true,
          align: "center",

          formatter() {
            return this.y;
          },

          padding: 3,
          style: {
            fontSize: "10px",
            fontWeight: "normal",
            color: "contrast",
            textOutline: "2px contrast"
          },
          verticalAlign: "bottom",
          x: 0,
          y: 0
        },
        lineWidth: 3,
        marker: {
          enabled: true,
          symbol: "circle"
        }
      }
    }
  };

  var _default = Ember.Route.extend({
    wendler: Ember.inject.service(),

    model() {
      return this.wendler.getLifts().then(liftsRecords => {
        let recordsPromises = liftsRecords.map(lift => lift.get('completedWorkouts'));
        return Ember.RSVP.all(recordsPromises).then(workoutLiftRecords => {
          let lifts = liftsRecords.toArray();
          let series = [];

          for (let i = 0; i < lifts.length; i++) {
            let lift = lifts[i];
            let data = workoutLiftRecords[i];
            data = data.map(record => record.getProperties('date', 'estimatedMax', 'weight', 'reps')).map(({
              date,
              estimatedMax,
              weight,
              reps
            }) => ({
              x: new Date(date),
              y: estimatedMax,
              weight,
              reps
            })).sort((l, r) => l.x - r.x);
            series.push({
              data,
              name: lift.get('name')
            });
          }

          return {
            chartOptions,
            series
          };
        });
      });
    }

  });

  _exports.default = _default;
});
;define("lift-tracker-531/routes/import", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Route.extend({
    wendler: Ember.inject.service(),

    model() {
      return this.wendler.getLifts();
    }

  });

  _exports.default = _default;
});
;define("lift-tracker-531/routes/index", ["exports", "ember-simple-auth/mixins/authenticated-route-mixin"], function (_exports, _authenticatedRouteMixin) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  const allComplete = (week, lifts) => lifts.reduce((accumulator, lift) => accumulator && lift.get(week), true);

  var _default = Ember.Route.extend(_authenticatedRouteMixin.default, {
    wendler: Ember.inject.service(),

    model() {
      return Ember.RSVP.hash({
        weekIds: this.wendler.getWeeks(),
        lifts: this.wendler.getLifts()
      }).then(({
        weekIds,
        lifts
      }) => {
        let weeks = weekIds.map(week => ({
          name: week,
          isCompleted: allComplete(week, lifts)
        }));
        return {
          lifts,
          weeks
        };
      });
    }

  });

  _exports.default = _default;
});
;define("lift-tracker-531/routes/lift", ["exports", "ember-simple-auth/mixins/authenticated-route-mixin", "lift-tracker-531/helpers/capitalize"], function (_exports, _authenticatedRouteMixin, _capitalize) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Route.extend(_authenticatedRouteMixin.default, {
    store: Ember.inject.service(),
    wendler: Ember.inject.service(),

    model({
      week_id,
      lift_id
    }) {
      return Ember.RSVP.hash({
        lift: this.store.find('lift', lift_id),
        barLoading: this.wendler.getBarLoading()
      }).then(({
        lift,
        barLoading
      }) => {
        let sets = this.wendler.createWorkout(week_id, lift.get('max'), barLoading);
        let title = "".concat((0, _capitalize.capitalize)([lift.get('name')]), " ").concat((0, _capitalize.capitalize)([week_id]));
        return {
          title,
          sets,
          lift,
          week: week_id
        };
      });
    }

  });

  _exports.default = _default;
});
;define("lift-tracker-531/routes/login", ["exports", "ember-simple-auth/mixins/unauthenticated-route-mixin"], function (_exports, _unauthenticatedRouteMixin) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Route.extend(_unauthenticatedRouteMixin.default, {});

  _exports.default = _default;
});
;define("lift-tracker-531/routes/settings", ["exports", "ember-simple-auth/mixins/authenticated-route-mixin"], function (_exports, _authenticatedRouteMixin) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Route.extend(_authenticatedRouteMixin.default, {
    store: Ember.inject.service(),
    session: Ember.inject.service(),
    wendler: Ember.inject.service(),

    model() {
      let userId = this.session.get('data.authenticated.user.uid');
      let email = this.session.get('data.authenticated.user.email');
      return Ember.RSVP.hash({
        email: Ember.RSVP.resolve(email),
        lifts: this.store.query('lift', {
          filter: {
            userId
          }
        }),
        barLoading: this.wendler.getBarLoading()
      });
    }

  });

  _exports.default = _default;
});
;define("lift-tracker-531/routes/week", ["exports", "ember-simple-auth/mixins/authenticated-route-mixin"], function (_exports, _authenticatedRouteMixin) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Route.extend(_authenticatedRouteMixin.default, {
    wendler: Ember.inject.service(),

    model({
      week_id
    }) {
      return this.wendler.getLifts().then(lifts => ({
        lifts,
        week: week_id
      }));
    }

  });

  _exports.default = _default;
});
;define("lift-tracker-531/services/ajax", ["exports", "ember-ajax/services/ajax"], function (_exports, _ajax) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _ajax.default;
    }
  });
});
;define("lift-tracker-531/services/cookies", ["exports", "ember-cookies/services/cookies"], function (_exports, _cookies) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = _cookies.default;
  _exports.default = _default;
});
;define("lift-tracker-531/services/firebase-app", ["exports", "emberfire/services/firebase-app"], function (_exports, _firebaseApp) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _firebaseApp.default;
    }
  });
});
;define("lift-tracker-531/services/firebase", ["exports", "emberfire/services/firebase"], function (_exports, _firebase) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _firebase.default;
    }
  });
});
;define("lift-tracker-531/services/session", ["exports", "ember-simple-auth/services/session"], function (_exports, _session) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = _session.default;
  _exports.default = _default;
});
;define("lift-tracker-531/services/wendler", ["exports", "lift-tracker-531/utils/workout-specs"], function (_exports, _workoutSpecs) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Service.extend({
    store: Ember.inject.service(),
    session: Ember.inject.service(),
    barLoading: null,

    getBarLoading() {
      let barLoading = this.get('barLoading');

      if (barLoading) {
        return Ember.RSVP.resolve(barLoading);
      }

      let userId = this.session.get('data.authenticated.user.uid');
      return this.store.findRecord('bar-loading', userId).then(barLoading => {
        this.set('barLoading', barLoading);
        return barLoading;
      }).catch(() => {
        // clear fake record before creating new one
        this.store.unloadRecord(this.store.getReference('bar-loading', userId).internalModel);
        let barLoading = this.store.createRecord('bar-loading', {
          id: userId,
          bar: 45,
          rounding: 5,
          plates: [2.5, 5, 10, 25, 35, 45]
        });
        barLoading.save();
        this.set('barLoading', barLoading);
        return barLoading;
      });
    },

    weeks() {
      return _workoutSpecs.WEEK_IDS;
    },

    getWeeks() {
      // for routes and things that want a promise
      return Ember.RSVP.resolve(this.weeks());
    },

    getLifts() {
      return this.store.query('lift', {
        filter: {
          userId: this.session.get('data.authenticated.user.uid')
        }
      });
    },

    createWorkout(weekId, max, barLoading) {
      let barWeight = barLoading.get('bar');
      let userPlates = barLoading.get('plates').slice().sort((a, b) => b - a);
      let roundingFactor = barLoading.get('rounding');
      let sets = [{
        name: "Workout",
        movements: (0, _workoutSpecs.applyWorkoutSpec)(weekId, max, barWeight, userPlates, roundingFactor)
      }];

      if (weekId !== "deload") {
        sets.unshift({
          name: "Warmup",
          movements: (0, _workoutSpecs.applyWorkoutSpec)('warmup', max, barWeight, userPlates, roundingFactor)
        });
      }

      return sets;
    }

  });

  _exports.default = _default;
});
;define("lift-tracker-531/session-stores/application", ["exports", "emberfire/session-stores/firebase"], function (_exports, _firebase) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _firebase.default.extend();

  _exports.default = _default;
});
;define("lift-tracker-531/templates/application", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "YVETg06/",
    "block": "{\"symbols\":[],\"statements\":[[1,[23,\"outlet\"],false]],\"hasEval\":false}",
    "meta": {
      "moduleName": "lift-tracker-531/templates/application.hbs"
    }
  });

  _exports.default = _default;
});
;define("lift-tracker-531/templates/chart", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "8MV6bju+",
    "block": "{\"symbols\":[],\"statements\":[[5,\"title-bar\",[],[[\"@title\"],[\"History\"]]],[0,\"\\n\\n\"],[7,\"div\"],[11,\"class\",\"chart-view\"],[9],[0,\"\\n  \"],[5,\"high-charts\",[],[[\"@chartOptions\",\"@content\"],[[25,[\"model\",\"chartOptions\"]],[25,[\"model\",\"series\"]]]]],[0,\"\\n\\n  \"],[7,\"div\"],[11,\"class\",\"row\"],[9],[0,\"\\n    \"],[7,\"button\"],[11,\"class\",\"link-button\"],[9],[0,\"\\n      \"],[7,\"span\"],[9],[0,\"Records\"],[10],[0,\"\\n      \"],[7,\"span\"],[11,\"class\",\"icon\"],[9],[7,\"ion-icon\"],[11,\"name\",\"calendar\"],[9],[10],[10],[0,\"\\n    \"],[10],[0,\"\\n  \"],[10],[0,\"\\n\"],[10]],\"hasEval\":false}",
    "meta": {
      "moduleName": "lift-tracker-531/templates/chart.hbs"
    }
  });

  _exports.default = _default;
});
;define("lift-tracker-531/templates/components/confirm-delete", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "6xoPpFoa",
    "block": "{\"symbols\":[],\"statements\":[[7,\"button\"],[12,\"class\",[29,\"if\",[[25,[\"showConfirm\"]],\"secondary\",\"initial\"],null]],[9],[0,\"\\n\"],[4,\"if\",[[25,[\"showConfirm\"]]],null,{\"statements\":[[0,\"    confirm \"],[7,\"ion-icon\"],[11,\"name\",\"close\"],[9],[10],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"    \"],[7,\"ion-icon\"],[11,\"name\",\"remove\"],[9],[10],[0,\"\\n\"]],\"parameters\":[]}],[3,\"action\",[[24,0,[]],\"click\"]],[10]],\"hasEval\":false}",
    "meta": {
      "moduleName": "lift-tracker-531/templates/components/confirm-delete.hbs"
    }
  });

  _exports.default = _default;
});
;define("lift-tracker-531/templates/components/finish-cycle", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "LrAWRM+J",
    "block": "{\"symbols\":[\"lift\"],\"statements\":[[7,\"button\"],[11,\"class\",\"open-button\"],[9],[0,\"\\n  \"],[7,\"span\"],[9],[0,\"Next cycle\"],[10],[0,\"\\n  \"],[7,\"ion-icon\"],[11,\"name\",\"arrow-dropright-circle\"],[9],[10],[0,\"\\n\"],[3,\"action\",[[24,0,[]],\"showModal\"]],[10],[0,\"\\n\\n\"],[4,\"if\",[[25,[\"showModal\"]]],null,{\"statements\":[[0,\"\\n  \"],[7,\"div\"],[11,\"class\",\"page-overlay\"],[9],[0,\"\\n    \"],[7,\"div\"],[11,\"class\",\"modal\"],[9],[0,\"\\n\\n      \"],[7,\"div\"],[11,\"class\",\"row title\"],[9],[0,\"\\n        \"],[7,\"span\"],[9],[0,\"Start New Cycle\"],[10],[0,\"\\n        \"],[7,\"button\"],[11,\"class\",\"close-button\"],[9],[0,\"\\n          \"],[7,\"ion-icon\"],[11,\"name\",\"close-circle\"],[9],[10],[0,\"\\n        \"],[3,\"action\",[[24,0,[]],\"closeModal\"]],[10],[0,\"\\n      \"],[10],[0,\"\\n\\n      \"],[7,\"label\"],[11,\"class\",\"row\"],[9],[0,\"\\n        \"],[7,\"span\"],[9],[0,\"Increase max values?\"],[10],[0,\"\\n        \"],[5,\"input\",[],[[\"@type\",\"@checked\"],[\"checkbox\",[23,\"increaseMaxes\"]]]],[0,\"\\n      \"],[10],[0,\"\\n\\n\"],[4,\"each\",[[25,[\"liftModels\"]]],null,{\"statements\":[[0,\"        \"],[7,\"div\"],[12,\"class\",[29,\"if\",[[29,\"not\",[[25,[\"increaseMaxes\"]]],null],\"row disabled\",\"row\"],null]],[9],[0,\"\\n          \"],[7,\"span\"],[9],[1,[29,\"capitalize\",[[24,1,[\"name\"]]],null],false],[10],[0,\"\\n\\n          \"],[7,\"div\"],[11,\"class\",\"increment-group\"],[9],[0,\"\\n            \"],[7,\"button\"],[11,\"class\",\"increment\"],[12,\"disabled\",[29,\"if\",[[29,\"not\",[[25,[\"increaseMaxes\"]]],null],\"true\"],null]],[9],[0,\"\\n              -5\\n            \"],[3,\"action\",[[24,0,[]],\"increment\",[24,1,[]],-5]],[10],[0,\"\\n\\n            \"],[7,\"span\"],[9],[1,[24,1,[\"increase\"]],false],[10],[0,\"\\n\\n            \"],[7,\"button\"],[11,\"class\",\"increment\"],[12,\"disabled\",[29,\"if\",[[29,\"not\",[[25,[\"increaseMaxes\"]]],null],\"true\"],null]],[9],[0,\"\\n              +5\\n            \"],[3,\"action\",[[24,0,[]],\"increment\",[24,1,[]],5]],[10],[0,\"\\n          \"],[10],[0,\"\\n        \"],[10],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"\\n      \"],[7,\"div\"],[11,\"class\",\"row footer\"],[9],[0,\"\\n        \"],[7,\"button\"],[11,\"class\",\"cancel\"],[9],[0,\"cancel\"],[3,\"action\",[[24,0,[]],\"closeModal\"]],[10],[0,\"\\n        \"],[7,\"button\"],[11,\"class\",\"submit\"],[9],[0,\"\\n          \"],[7,\"span\"],[9],[0,\"Start cycle\"],[10],[0,\"\\n\"],[4,\"if\",[[25,[\"saving\"]]],null,{\"statements\":[[0,\"            \"],[7,\"div\"],[11,\"class\",\"lds-dual-ring\"],[9],[10],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"            \"],[7,\"ion-icon\"],[11,\"name\",\"arrow-dropright-circle\"],[9],[10],[0,\"\\n\"]],\"parameters\":[]}],[0,\"        \"],[3,\"action\",[[24,0,[]],\"submit\"]],[10],[0,\"\\n      \"],[10],[0,\"\\n\\n    \"],[10],[0,\"\\n  \"],[10],[0,\"\\n\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}",
    "meta": {
      "moduleName": "lift-tracker-531/templates/components/finish-cycle.hbs"
    }
  });

  _exports.default = _default;
});
;define("lift-tracker-531/templates/components/settings-account-control", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "m9nobQHx",
    "block": "{\"symbols\":[\"@model\"],\"statements\":[[7,\"div\"],[11,\"class\",\"row\"],[9],[0,\"\\n  \"],[7,\"label\"],[9],[0,\"Account:\"],[10],[0,\"\\n  \"],[7,\"span\"],[9],[1,[24,1,[]],false],[10],[0,\"\\n\"],[10],[0,\"\\n\"],[7,\"div\"],[11,\"class\",\"row right\"],[9],[0,\"\\n  \"],[7,\"button\"],[11,\"class\",\"logout\"],[9],[0,\"\\n    \"],[7,\"ion-icon\"],[11,\"name\",\"log-out\"],[9],[10],[0,\" logout\\n  \"],[3,\"action\",[[24,0,[]],\"signOut\"]],[10],[0,\"\\n\"],[10]],\"hasEval\":false}",
    "meta": {
      "moduleName": "lift-tracker-531/templates/components/settings-account-control.hbs"
    }
  });

  _exports.default = _default;
});
;define("lift-tracker-531/templates/components/settings-bar-loading-control", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "FJ3eNpLs",
    "block": "{\"symbols\":[\"plate\",\"plate\",\"weight\",\"weight\",\"@model\"],\"statements\":[[4,\"if\",[[25,[\"editing\"]]],null,{\"statements\":[[0,\"\\n  \"],[7,\"div\"],[11,\"class\",\"row left\"],[9],[0,\"\\n    \"],[7,\"span\"],[11,\"class\",\"title\"],[9],[0,\"Bar weight\"],[10],[0,\"\\n  \"],[10],[0,\"\\n  \"],[7,\"div\"],[11,\"class\",\"row space-around hug\"],[9],[0,\"\\n\"],[4,\"each\",[[25,[\"commonBarWeights\"]]],null,{\"statements\":[[0,\"      \"],[7,\"button\"],[12,\"class\",[29,\"if\",[[29,\"eq\",[[24,4,[]],[24,5,[\"bar\"]]],null],\"weight-chooser active\",\"weight-chooser\"],null]],[9],[0,\"\\n        \"],[1,[24,4,[]],false],[0,\"\\n      \"],[3,\"action\",[[24,0,[]],\"setBarWeight\",[24,4,[]]]],[10],[0,\"\\n\"]],\"parameters\":[4]},null],[0,\"  \"],[10],[0,\"\\n\\n  \"],[7,\"div\"],[11,\"class\",\"row left\"],[9],[0,\"\\n    \"],[7,\"span\"],[11,\"class\",\"title\"],[9],[0,\"Round to nearest\"],[10],[0,\"\\n  \"],[10],[0,\"\\n  \"],[7,\"div\"],[11,\"class\",\"row space-around hug\"],[9],[0,\"\\n\"],[4,\"each\",[[25,[\"commonRoundingThresholds\"]]],null,{\"statements\":[[0,\"      \"],[7,\"button\"],[12,\"class\",[29,\"if\",[[29,\"eq\",[[24,3,[]],[24,5,[\"rounding\"]]],null],\"weight-chooser active\",\"weight-chooser\"],null]],[9],[0,\"\\n        \"],[1,[24,3,[]],false],[0,\"\\n      \"],[3,\"action\",[[24,0,[]],\"setRoundingWeight\",[24,3,[]]]],[10],[0,\"\\n\"]],\"parameters\":[3]},null],[0,\"  \"],[10],[0,\"\\n\\n  \"],[7,\"div\"],[11,\"class\",\"row left\"],[9],[0,\"\\n    \"],[7,\"span\"],[11,\"class\",\"title\"],[9],[0,\"Available plates\"],[10],[0,\"\\n  \"],[10],[0,\"\\n  \"],[7,\"div\"],[11,\"class\",\"row space-around hug wrap\"],[9],[0,\"\\n\"],[4,\"each\",[[24,5,[\"plates\"]]],null,{\"statements\":[[0,\"      \"],[7,\"div\"],[11,\"class\",\"plate-editor\"],[9],[0,\"\\n        \"],[7,\"span\"],[11,\"class\",\"delete-container\"],[9],[0,\"\\n          \"],[5,\"confirm-delete\",[],[[\"@deleteAction\"],[[29,\"action\",[[24,0,[]],\"deletePlate\",[24,2,[]]],null]]]],[0,\"\\n        \"],[10],[0,\"\\n        \"],[7,\"span\"],[11,\"class\",\"plate\"],[9],[1,[24,2,[]],false],[10],[0,\"\\n      \"],[10],[0,\"\\n\"]],\"parameters\":[2]},null],[0,\"  \"],[10],[0,\"\\n  \"],[7,\"div\"],[11,\"class\",\"row right hug\"],[9],[0,\"\\n    \"],[7,\"button\"],[11,\"class\",\"add-plate\"],[9],[0,\"\\n      \"],[7,\"ion-icon\"],[11,\"name\",\"add-circle-outline\"],[9],[10],[0,\"\\n    \"],[3,\"action\",[[24,0,[]],\"addNewPlate\"]],[10],[0,\"\\n    \"],[5,\"input\",[[13,\"class\",\"new-plate\"]],[[\"@value\"],[[23,\"newPlateValue\"]]]],[0,\"\\n  \"],[10],[0,\"\\n\\n  \"],[7,\"div\"],[11,\"class\",\"row spread\"],[9],[0,\"\\n    \"],[7,\"button\"],[11,\"class\",\"cancel-edit\"],[9],[0,\"\\n      \"],[7,\"ion-icon\"],[11,\"name\",\"close-circle-outline\"],[9],[10],[0,\" cancel\\n    \"],[3,\"action\",[[24,0,[]],\"cancelEdit\"]],[10],[0,\"\\n    \"],[7,\"button\"],[11,\"class\",\"save-edit\"],[9],[0,\"\\n      \"],[7,\"ion-icon\"],[11,\"name\",\"save\"],[9],[10],[0,\" save\\n    \"],[3,\"action\",[[24,0,[]],\"saveEdit\"]],[10],[0,\"\\n  \"],[10],[0,\"\\n\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"\\n  \"],[7,\"div\"],[11,\"class\",\"row spread\"],[9],[0,\"\\n    \"],[7,\"span\"],[11,\"clas\",\"title\"],[9],[0,\"Bar weight\"],[10],[0,\"\\n    \"],[7,\"span\"],[11,\"class\",\"bar\"],[9],[1,[24,5,[\"bar\"]],false],[10],[0,\"\\n  \"],[10],[0,\"\\n\\n  \"],[7,\"div\"],[11,\"class\",\"row spread\"],[9],[0,\"\\n    \"],[7,\"span\"],[11,\"clas\",\"title\"],[9],[0,\"Round to nearest\"],[10],[0,\"\\n    \"],[7,\"span\"],[11,\"class\",\"max\"],[9],[1,[24,5,[\"rounding\"]],false],[10],[0,\"\\n  \"],[10],[0,\"\\n\\n  \"],[7,\"div\"],[11,\"class\",\"row left\"],[9],[0,\"\\n    \"],[7,\"span\"],[11,\"class\",\"title\"],[9],[0,\"Available plates\"],[10],[0,\"\\n  \"],[10],[0,\"\\n  \"],[7,\"div\"],[11,\"class\",\"plates row right hug\"],[9],[0,\"\\n\"],[4,\"each\",[[24,5,[\"plates\"]]],null,{\"statements\":[[0,\"      \"],[7,\"span\"],[11,\"class\",\"plate\"],[9],[1,[24,1,[]],false],[10],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"  \"],[10],[0,\"\\n\\n  \"],[7,\"div\"],[11,\"class\",\"row right\"],[9],[0,\"\\n    \"],[7,\"button\"],[11,\"class\",\"edit\"],[9],[0,\"\\n      \"],[7,\"ion-icon\"],[11,\"name\",\"create\"],[9],[10],[0,\" edit\\n    \"],[3,\"action\",[[24,0,[]],\"showEdit\"]],[10],[0,\"\\n  \"],[10],[0,\"\\n\\n\"],[4,\"if\",[[25,[\"showWeightsWarning\"]]],null,{\"statements\":[[0,\"    \"],[7,\"div\"],[11,\"class\",\"row warning\"],[9],[0,\"\\n      \"],[7,\"ion-icon\"],[11,\"name\",\"warning\"],[9],[10],[0,\"\\n      \"],[7,\"span\"],[9],[0,\"rounding too small for plates\"],[10],[0,\"\\n    \"],[10],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"]],\"parameters\":[]}]],\"hasEval\":false}",
    "meta": {
      "moduleName": "lift-tracker-531/templates/components/settings-bar-loading-control.hbs"
    }
  });

  _exports.default = _default;
});
;define("lift-tracker-531/templates/components/settings-lifts-control", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "/1wWAOKo",
    "block": "{\"symbols\":[\"lift\",\"lift\",\"lift\"],\"statements\":[[4,\"if\",[[25,[\"editingLifts\"]]],null,{\"statements\":[[0,\"\\n\"],[4,\"each\",[[25,[\"lifts\"]]],null,{\"statements\":[[0,\"    \"],[7,\"div\"],[11,\"class\",\"row\"],[9],[0,\"\\n      \"],[7,\"div\"],[11,\"class\",\"delete-container\"],[9],[0,\"\\n        \"],[5,\"confirm-delete\",[],[[\"@deleteAction\"],[[29,\"action\",[[24,0,[]],\"deleteLift\",[24,3,[]]],null]]]],[0,\"\\n      \"],[10],[0,\"\\n      \"],[5,\"input\",[[13,\"class\",\"lift-input name-input\"]],[[\"@value\",\"@placeholder\"],[[24,3,[\"name\"]],\"name\"]]],[0,\"\\n      \"],[5,\"input\",[[13,\"class\",\"lift-input max-input\"]],[[\"@type\",\"@value\",\"@placeholder\"],[\"number\",[24,3,[\"max\"]],\"45\"]]],[0,\"\\n    \"],[10],[0,\"\\n\"]],\"parameters\":[3]},null],[0,\"\\n\"],[4,\"each\",[[25,[\"pendingLifts\"]]],null,{\"statements\":[[0,\"    \"],[7,\"div\"],[11,\"class\",\"row\"],[9],[0,\"\\n      \"],[7,\"div\"],[11,\"class\",\"delete-container\"],[9],[0,\"\\n        \"],[5,\"confirm-delete\",[],[[\"@deleteAction\"],[[29,\"action\",[[24,0,[]],\"deletePending\",[24,2,[]]],null]]]],[0,\"\\n      \"],[10],[0,\"\\n      \"],[5,\"input\",[[13,\"class\",\"lift-input name-input\"]],[[\"@value\",\"@placeholder\"],[[24,2,[\"name\"]],\"name\"]]],[0,\"\\n      \"],[5,\"input\",[[13,\"class\",\"lift-input max-input\"]],[[\"@type\",\"@value\",\"@placeholder\"],[\"number\",[24,2,[\"max\"]],\"45\"]]],[0,\"\\n    \"],[10],[0,\"\\n\"]],\"parameters\":[2]},null],[0,\"\\n  \"],[7,\"div\"],[11,\"class\",\"row right\"],[9],[0,\"\\n    \"],[7,\"button\"],[11,\"class\",\"add-empty-lift\"],[9],[0,\"\\n      \"],[7,\"ion-icon\"],[11,\"name\",\"add-circle-outline\"],[9],[10],[0,\"\\n    \"],[3,\"action\",[[24,0,[]],\"addEmptyLift\"]],[10],[0,\"\\n  \"],[10],[0,\"\\n\\n  \"],[7,\"div\"],[11,\"class\",\"row spread\"],[9],[0,\"\\n    \"],[7,\"button\"],[11,\"class\",\"cancel-edit\"],[9],[0,\"\\n      \"],[7,\"ion-icon\"],[11,\"name\",\"close-circle-outline\"],[9],[10],[0,\" cancel\\n    \"],[3,\"action\",[[24,0,[]],\"cancelEdit\"]],[10],[0,\"\\n    \"],[7,\"button\"],[11,\"class\",\"save-edit\"],[9],[0,\"\\n      \"],[7,\"ion-icon\"],[11,\"name\",\"save\"],[9],[10],[0,\" save\\n    \"],[3,\"action\",[[24,0,[]],\"saveEdit\"]],[10],[0,\"\\n  \"],[10],[0,\"\\n\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"\\n\"],[4,\"each\",[[25,[\"lifts\"]]],null,{\"statements\":[[0,\"    \"],[7,\"div\"],[11,\"class\",\"row\"],[9],[0,\"\\n      \"],[7,\"button\"],[11,\"class\",\"increment\"],[9],[0,\"-5\"],[3,\"action\",[[24,0,[]],\"addToLift\",[24,1,[]],-5]],[10],[0,\"\\n      \"],[7,\"span\"],[11,\"class\",\"name\"],[9],[1,[29,\"capitalize\",[[24,1,[\"name\"]]],null],false],[10],[0,\"\\n      \"],[7,\"span\"],[11,\"class\",\"max\"],[9],[1,[24,1,[\"max\"]],false],[10],[0,\"\\n      \"],[7,\"button\"],[11,\"class\",\"increment\"],[9],[0,\"+5\"],[3,\"action\",[[24,0,[]],\"addToLift\",[24,1,[]],5]],[10],[0,\"\\n    \"],[10],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"\\n  \"],[7,\"div\"],[11,\"class\",\"row right\"],[9],[0,\"\\n    \"],[7,\"button\"],[11,\"class\",\"edit\"],[9],[0,\"\\n      \"],[7,\"ion-icon\"],[11,\"name\",\"create\"],[9],[10],[0,\" edit\\n    \"],[3,\"action\",[[24,0,[]],\"showEdit\"]],[10],[0,\"\\n  \"],[10],[0,\"\\n\\n\"]],\"parameters\":[]}]],\"hasEval\":false}",
    "meta": {
      "moduleName": "lift-tracker-531/templates/components/settings-lifts-control.hbs"
    }
  });

  _exports.default = _default;
});
;define("lift-tracker-531/templates/components/title-bar", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "C9FI7CCw",
    "block": "{\"symbols\":[\"@title\"],\"statements\":[[4,\"if\",[[25,[\"showBackButton\"]]],null,{\"statements\":[[0,\"  \"],[7,\"div\"],[11,\"class\",\"back-button-wrapper\"],[9],[0,\"\\n    \"],[7,\"button\"],[11,\"class\",\"nav-button\"],[9],[0,\"\\n      \"],[7,\"ion-icon\"],[11,\"name\",\"arrow-round-back\"],[9],[10],[0,\"\\n    \"],[3,\"action\",[[24,0,[]],\"navigateBack\"]],[10],[0,\"\\n  \"],[10],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[7,\"span\"],[9],[1,[24,1,[]],false],[10],[0,\"\\n\\n\"],[4,\"if\",[[25,[\"showSettingsButton\"]]],null,{\"statements\":[[0,\"  \"],[7,\"div\"],[11,\"class\",\"settings-button-wrapper\"],[9],[0,\"\\n\"],[4,\"if\",[[25,[\"settingsNavsBack\"]]],null,{\"statements\":[[0,\"      \"],[7,\"button\"],[11,\"class\",\"nav-button\"],[9],[0,\"\\n        \"],[7,\"ion-icon\"],[11,\"name\",\"settings\"],[9],[10],[0,\"\\n      \"],[3,\"action\",[[24,0,[]],\"navigateBack\"]],[10],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"      \"],[5,\"link-to\",[[13,\"class\",\"nav-button\"]],[[\"@tagName\",\"@route\"],[\"button\",\"settings\"]],{\"statements\":[[0,\"\\n        \"],[7,\"ion-icon\"],[11,\"name\",\"settings\"],[9],[10],[0,\"\\n      \"]],\"parameters\":[]}],[0,\"\\n\"]],\"parameters\":[]}],[0,\"  \"],[10],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}",
    "meta": {
      "moduleName": "lift-tracker-531/templates/components/title-bar.hbs"
    }
  });

  _exports.default = _default;
});
;define("lift-tracker-531/templates/components/workout-logger", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "DZPY6R/5",
    "block": "{\"symbols\":[],\"statements\":[[4,\"if\",[[25,[\"showForm\"]]],null,{\"statements\":[[0,\"\\n  \"],[7,\"div\"],[11,\"class\",\"row\"],[9],[0,\"\\n    \"],[7,\"div\"],[11,\"class\",\"column top\"],[9],[0,\"\\n      \"],[7,\"button\"],[11,\"class\",\"cancel\"],[9],[0,\"\\n        \"],[7,\"ion-icon\"],[11,\"name\",\"close\"],[9],[10],[0,\"\\n      \"],[3,\"action\",[[24,0,[]],\"cancel\"]],[10],[0,\"\\n    \"],[10],[0,\"\\n\\n    \"],[7,\"div\"],[11,\"class\",\"column\"],[9],[0,\"\\n      \"],[7,\"div\"],[11,\"class\",\"row center\"],[9],[0,\"\\n        \"],[7,\"label\"],[11,\"for\",\"track-weight\"],[9],[0,\"Weight\"],[10],[0,\"\\n        \"],[5,\"input\",[[13,\"class\",\"weight-input\"],[13,\"type\",\"number\"]],[[\"@id\",\"@value\"],[\"track-weight\",[23,\"weight\"]]]],[0,\"\\n      \"],[10],[0,\"\\n      \"],[7,\"div\"],[11,\"class\",\"row center\"],[9],[0,\"\\n        \"],[7,\"label\"],[11,\"for\",\"track-reps\"],[9],[0,\"Reps\"],[10],[0,\"\\n        \"],[5,\"input\",[[13,\"class\",\"reps-input\"],[13,\"type\",\"number\"]],[[\"@id\",\"@value\"],[\"track-reps\",[23,\"reps\"]]]],[0,\"\\n      \"],[10],[0,\"\\n      \"],[7,\"div\"],[11,\"class\",\"row center\"],[9],[0,\"\\n        \"],[7,\"label\"],[9],[0,\"Max estimate\"],[10],[0,\"\\n        \"],[7,\"span\"],[11,\"class\",\"estimate\"],[9],[1,[23,\"estimate\"],false],[10],[0,\"\\n      \"],[10],[0,\"\\n    \"],[10],[0,\"\\n\\n    \"],[7,\"div\"],[11,\"class\",\"column bottom\"],[9],[0,\"\\n      \"],[7,\"button\"],[11,\"class\",\"submit\"],[9],[0,\"\\n        \"],[7,\"ion-icon\"],[11,\"name\",\"save\"],[9],[10],[0,\"\\n      \"],[3,\"action\",[[24,0,[]],\"submit\"]],[10],[0,\"\\n    \"],[10],[0,\"\\n  \"],[10],[0,\"\\n\\n\"]],\"parameters\":[]},{\"statements\":[[4,\"if\",[[25,[\"saving\"]]],null,{\"statements\":[[0,\"\\n  \"],[7,\"div\"],[11,\"class\",\"pull-right\"],[9],[0,\"\\n    \"],[7,\"div\"],[11,\"class\",\"lds-dual-ring\"],[9],[10],[0,\"\\n  \"],[10],[0,\"\\n\\n\"]],\"parameters\":[]},{\"statements\":[[4,\"if\",[[25,[\"showSuccess\"]]],null,{\"statements\":[[0,\"\\n  \"],[7,\"div\"],[11,\"class\",\"pull-right\"],[9],[0,\"\\n    \"],[7,\"div\"],[11,\"class\",\"success-indicator\"],[9],[0,\"\\n      \"],[7,\"ion-icon\"],[11,\"name\",\"checkmark\"],[9],[10],[0,\"\\n    \"],[10],[0,\"\\n  \"],[10],[0,\"\\n\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"\\n  \"],[7,\"div\"],[11,\"class\",\"pull-right\"],[9],[0,\"\\n    \"],[7,\"button\"],[11,\"class\",\"open\"],[9],[0,\"\\n      \"],[7,\"ion-icon\"],[11,\"name\",\"create\"],[9],[10],[0,\"\\n    \"],[3,\"action\",[[24,0,[]],\"openForm\"]],[10],[0,\"\\n  \"],[10],[0,\"\\n\\n\"]],\"parameters\":[]}]],\"parameters\":[]}]],\"parameters\":[]}]],\"hasEval\":false}",
    "meta": {
      "moduleName": "lift-tracker-531/templates/components/workout-logger.hbs"
    }
  });

  _exports.default = _default;
});
;define("lift-tracker-531/templates/components/workout-set", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "dzVtNo3P",
    "block": "{\"symbols\":[\"movement\",\"@workoutSet\",\"@isCompleted\"],\"statements\":[[7,\"div\"],[11,\"class\",\"row title\"],[9],[0,\"\\n  \"],[7,\"span\"],[11,\"class\",\"name\"],[9],[1,[24,2,[\"name\"]],false],[10],[0,\"\\n  \"],[7,\"span\"],[11,\"class\",\"icon\"],[9],[0,\"\\n\"],[4,\"if\",[[24,3,[]]],null,{\"statements\":[[0,\"      \"],[7,\"ion-icon\"],[11,\"name\",\"checkmark-circle\"],[9],[10],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"  \"],[10],[0,\"\\n\"],[10],[0,\"\\n\\n\"],[4,\"each\",[[24,2,[\"movements\"]]],null,{\"statements\":[[0,\"  \"],[7,\"div\"],[11,\"class\",\"row lift\"],[9],[0,\"\\n    \"],[7,\"span\"],[11,\"class\",\"weight\"],[9],[1,[24,1,[\"weight\"]],false],[10],[0,\"\\n    \"],[7,\"span\"],[11,\"class\",\"label\"],[9],[0,\"lbs\"],[10],[0,\"\\n    \"],[7,\"span\"],[11,\"class\",\"count\"],[9],[0,\"x\"],[1,[24,1,[\"reps\"]],false],[1,[29,\"if\",[[24,1,[\"plusSet\"]],\"+\"],null],false],[10],[0,\"\\n    \"],[7,\"span\"],[11,\"class\",\"plates\"],[9],[0,\"[ \"],[1,[29,\"join\",[\", \",[24,1,[\"plates\"]]],null],false],[0,\" ]\"],[10],[0,\"\\n  \"],[10],[0,\"\\n\"]],\"parameters\":[1]},null]],\"hasEval\":false}",
    "meta": {
      "moduleName": "lift-tracker-531/templates/components/workout-set.hbs"
    }
  });

  _exports.default = _default;
});
;define("lift-tracker-531/templates/import", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "c1cZhj5/",
    "block": "{\"symbols\":[],\"statements\":[[7,\"div\"],[11,\"class\",\"import-view\"],[9],[0,\"\\n  \"],[5,\"textarea\",[],[[\"@value\"],[[23,\"importCSV\"]]]],[0,\"\\n  \"],[7,\"div\"],[11,\"class\",\"row\"],[9],[0,\"\\n    \"],[7,\"label\"],[9],[0,\"Delete Old Data \"],[5,\"input\",[],[[\"@type\",\"@checked\"],[\"checkbox\",[23,\"deleteOld\"]]]],[10],[0,\"\\n    \"],[7,\"button\"],[11,\"class\",\"process\"],[9],[0,\"import\"],[3,\"action\",[[24,0,[]],\"processText\"]],[10],[0,\"\\n  \"],[10],[0,\"\\n\\n\"],[4,\"if\",[[25,[\"processing\"]]],null,{\"statements\":[[0,\"    \"],[7,\"div\"],[11,\"class\",\"lds-dual-ring\"],[9],[10],[0,\"\\n\"]],\"parameters\":[]},null],[10]],\"hasEval\":false}",
    "meta": {
      "moduleName": "lift-tracker-531/templates/import.hbs"
    }
  });

  _exports.default = _default;
});
;define("lift-tracker-531/templates/index", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "DisNQBMx",
    "block": "{\"symbols\":[\"week\"],\"statements\":[[5,\"title-bar\",[],[[\"@title\",\"@showBackButton\"],[\"Lift Tracker\",false]]],[0,\"\\n\\n\"],[7,\"div\"],[11,\"class\",\"index-view\"],[9],[0,\"\\n  \"],[7,\"div\"],[11,\"class\",\"selection-list\"],[9],[0,\"\\n\"],[4,\"each\",[[25,[\"model\",\"weeks\"]]],null,{\"statements\":[[0,\"      \"],[5,\"link-to\",[[13,\"class\",[29,\"if\",[[24,1,[\"isCompleted\"]],\"complete\"],null]]],[[\"@route\",\"@model\"],[\"week\",[24,1,[\"name\"]]]],{\"statements\":[[0,\"\\n        \"],[1,[29,\"capitalize\",[[24,1,[\"name\"]]],null],false],[0,\"\\n\"],[4,\"if\",[[24,1,[\"isCompleted\"]]],null,{\"statements\":[[0,\"          \"],[7,\"ion-icon\"],[11,\"name\",\"checkmark-circle\"],[9],[10],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"      \"]],\"parameters\":[]}],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"  \"],[10],[0,\"\\n\\n  \"],[7,\"div\"],[11,\"class\",\"row\"],[9],[0,\"\\n    \"],[5,\"link-to\",[[13,\"class\",\"chart-button\"]],[[\"@route\",\"@tagName\"],[\"chart\",\"button\"]],{\"statements\":[[0,\"\\n      \"],[7,\"ion-icon\"],[11,\"name\",\"trending-up\"],[9],[10],[0,\"\\n    \"]],\"parameters\":[]}],[0,\"\\n    \"],[5,\"finish-cycle\",[],[[\"@lifts\",\"@clearCompleted\"],[[25,[\"model\",\"lifts\"]],[29,\"action\",[[24,0,[]],\"clearCompleted\"],null]]]],[0,\"\\n  \"],[10],[0,\"\\n\"],[10]],\"hasEval\":false}",
    "meta": {
      "moduleName": "lift-tracker-531/templates/index.hbs"
    }
  });

  _exports.default = _default;
});
;define("lift-tracker-531/templates/lift", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "8L6quWPF",
    "block": "{\"symbols\":[\"set\"],\"statements\":[[5,\"title-bar\",[],[[\"@title\"],[[25,[\"model\",\"title\"]]]]],[0,\"\\n\\n\"],[4,\"each\",[[25,[\"model\",\"sets\"]]],null,{\"statements\":[[0,\"  \"],[5,\"workout-set\",[],[[\"@workoutSet\",\"@isCompleted\"],[[24,1,[]],[29,\"get\",[[25,[\"model\",\"lift\"]],[25,[\"model\",\"week\"]]],null]]]],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"\\n\"],[5,\"workout-logger\",[],[[\"@workout\",\"@lift\",\"@week\"],[[25,[\"model\",\"sets\",\"lastObject\"]],[25,[\"model\",\"lift\"]],[25,[\"model\",\"week\"]]]]],[0,\"\\n\"]],\"hasEval\":false}",
    "meta": {
      "moduleName": "lift-tracker-531/templates/lift.hbs"
    }
  });

  _exports.default = _default;
});
;define("lift-tracker-531/templates/login", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "FnXe0I/X",
    "block": "{\"symbols\":[],\"statements\":[[5,\"title-bar\",[],[[\"@title\",\"@showBackButton\",\"@showSettingsButton\"],[\"Login\",false,false]]],[0,\"\\n\\n\"],[7,\"form\"],[11,\"class\",\"login\"],[9],[0,\"\\n  \"],[7,\"div\"],[11,\"class\",\"row\"],[9],[0,\"\\n    \"],[7,\"div\"],[11,\"class\",\"column\"],[9],[0,\"\\n      \"],[7,\"label\"],[11,\"for\",\"email\"],[9],[0,\"Email\"],[10],[0,\"\\n      \"],[7,\"label\"],[11,\"for\",\"password\"],[9],[0,\"Password\"],[10],[0,\"\\n    \"],[10],[0,\"\\n\\n    \"],[7,\"div\"],[11,\"class\",\"column grow\"],[9],[0,\"\\n      \"],[5,\"input\",[],[[\"@id\",\"@placeholder\",\"@value\"],[\"email\",\"you@example.com\",[23,\"email\"]]]],[0,\"\\n      \"],[5,\"input\",[],[[\"@id\",\"@placeholder\",\"@type\",\"@value\"],[\"password\",\"******\",\"password\",[23,\"password\"]]]],[0,\"\\n    \"],[10],[0,\"\\n  \"],[10],[0,\"\\n\\n  \"],[7,\"div\"],[11,\"class\",\"row\"],[9],[0,\"\\n    \"],[7,\"button\"],[11,\"type\",\"submit\"],[9],[0,\"\\n      \"],[7,\"ion-icon\"],[11,\"name\",\"log-in\"],[9],[10],[0,\" Login\\n    \"],[10],[0,\"\\n  \"],[10],[0,\"\\n\"],[3,\"action\",[[24,0,[]],\"login\",[25,[\"email\"]],[25,[\"password\"]]],[[\"on\"],[\"submit\"]]],[10]],\"hasEval\":false}",
    "meta": {
      "moduleName": "lift-tracker-531/templates/login.hbs"
    }
  });

  _exports.default = _default;
});
;define("lift-tracker-531/templates/settings", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "w3p94yY0",
    "block": "{\"symbols\":[],\"statements\":[[5,\"title-bar\",[],[[\"@title\",\"@settingsNavsBack\"],[\"Settings\",true]]],[0,\"\\n\\n\"],[7,\"div\"],[11,\"class\",\"settings-view\"],[9],[0,\"\\n  \"],[7,\"div\"],[11,\"class\",\"tabs\"],[9],[0,\"\\n    \"],[7,\"button\"],[12,\"class\",[29,\"if\",[[25,[\"showAccountTab\"]],\"active\"],null]],[9],[0,\"Account\"],[3,\"action\",[[24,0,[]],\"showAccountTab\"]],[10],[0,\"\\n    \"],[7,\"button\"],[12,\"class\",[29,\"if\",[[25,[\"showLiftsTab\"]],\"active\"],null]],[9],[0,\"Lifts\"],[3,\"action\",[[24,0,[]],\"showLiftsTab\"]],[10],[0,\"\\n    \"],[7,\"button\"],[12,\"class\",[29,\"if\",[[25,[\"showBarLoadingTab\"]],\"active\"],null]],[9],[0,\"Weights\"],[3,\"action\",[[24,0,[]],\"showBarLoadingTab\"]],[10],[0,\"\\n  \"],[10],[0,\"\\n\\n\"],[4,\"if\",[[25,[\"showAccountTab\"]]],null,{\"statements\":[[0,\"    \"],[5,\"settings-account-control\",[],[[\"@model\"],[[25,[\"model\",\"email\"]]]]],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[4,\"if\",[[25,[\"showLiftsTab\"]]],null,{\"statements\":[[0,\"    \"],[5,\"settings-lifts-control\",[],[[\"@model\"],[[25,[\"model\",\"lifts\"]]]]],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[4,\"if\",[[25,[\"showBarLoadingTab\"]]],null,{\"statements\":[[0,\"    \"],[5,\"settings-bar-loading-control\",[],[[\"@model\"],[[25,[\"model\",\"barLoading\"]]]]],[0,\"\\n  \"]],\"parameters\":[]},null]],\"parameters\":[]}]],\"parameters\":[]}],[10]],\"hasEval\":false}",
    "meta": {
      "moduleName": "lift-tracker-531/templates/settings.hbs"
    }
  });

  _exports.default = _default;
});
;define("lift-tracker-531/templates/week", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "lBNMl57t",
    "block": "{\"symbols\":[\"week\",\"lift\",\"isCompleted\"],\"statements\":[[4,\"let\",[[25,[\"model\",\"week\"]]],null,{\"statements\":[[0,\"  \"],[5,\"title-bar\",[],[[\"@title\"],[[29,\"capitalize\",[[24,1,[]]],null]]]],[0,\"\\n\\n  \"],[7,\"div\"],[11,\"class\",\"selection-list\"],[9],[0,\"\\n\"],[4,\"each\",[[25,[\"model\",\"lifts\"]]],null,{\"statements\":[[4,\"let\",[[29,\"get\",[[24,2,[]],[24,1,[]]],null]],null,{\"statements\":[[0,\"        \"],[5,\"link-to\",[[13,\"class\",[29,\"if\",[[24,3,[]],\"complete\"],null]]],[[\"@route\",\"@models\"],[\"lift\",[29,\"array\",[[24,1,[]],[24,2,[\"id\"]]],null]]],{\"statements\":[[0,\"\\n          \"],[1,[29,\"capitalize\",[[24,2,[\"name\"]]],null],false],[0,\"\\n\"],[4,\"if\",[[24,3,[]]],null,{\"statements\":[[0,\"            \"],[7,\"ion-icon\"],[11,\"name\",\"checkmark-circle\"],[9],[10],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"        \"]],\"parameters\":[]}],[0,\"\\n\"]],\"parameters\":[3]},null]],\"parameters\":[2]},null],[0,\"  \"],[10],[0,\"\\n\"]],\"parameters\":[1]},null]],\"hasEval\":false}",
    "meta": {
      "moduleName": "lift-tracker-531/templates/week.hbs"
    }
  });

  _exports.default = _default;
});
;define("lift-tracker-531/utils/one-rep-estimate", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.oneRepEstimate = void 0;

  const oneRepEstimate = (weight, reps) => Math.round(weight * (1 + Math.min(reps, 12) / 30));

  _exports.oneRepEstimate = oneRepEstimate;
});
;define("lift-tracker-531/utils/plate-math", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.calcPlates = calcPlates;
  _exports.roundToFactor = void 0;

  function calcPlates(plates, remaining) {
    if (plates.length === 0 || remaining <= 0) {
      return [];
    }

    let [largest, ...rest] = plates;

    if (2 * largest > remaining) {
      return calcPlates(rest, remaining);
    } else {
      return [largest, ...calcPlates(plates, remaining - 2 * largest)];
    }
  }

  const roundToFactor = (weight, factor = 5, half = factor / 2) => factor * Math.floor((weight + half) / factor);

  _exports.roundToFactor = roundToFactor;
});
;define("lift-tracker-531/utils/workout-specs", ["exports", "lift-tracker-531/utils/plate-math"], function (_exports, _plateMath) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.applyWorkoutSpec = _exports.getWorkoutSpec = _exports.WEEK_IDS = _exports.WEEK_SPECS = void 0;
  const WEEK_SPECS = {
    'warmup': [{
      percent: .4,
      reps: 5
    }, {
      percent: .5,
      reps: 5
    }, {
      percent: .6,
      reps: 3
    }],
    '5-5-5': [{
      percent: .65,
      reps: 5
    }, {
      percent: .75,
      reps: 5
    }, {
      percent: .85,
      reps: 5,
      plusSet: true
    }],
    '3-3-3': [{
      percent: .7,
      reps: 3
    }, {
      percent: .8,
      reps: 3
    }, {
      percent: .9,
      reps: 3,
      plusSet: true
    }],
    '5-3-1': [{
      percent: .75,
      reps: 5
    }, {
      percent: .85,
      reps: 3
    }, {
      percent: .95,
      reps: 1,
      plusSet: true
    }],
    'deload': [{
      percent: .4,
      reps: 5
    }, {
      percent: .5,
      reps: 5
    }, {
      percent: .6,
      reps: 5
    }]
  };
  _exports.WEEK_SPECS = WEEK_SPECS;
  const WEEK_IDS = Object.keys(WEEK_SPECS).filter(i => i !== 'warmup');
  _exports.WEEK_IDS = WEEK_IDS;

  const getWorkoutSpec = weekId => WEEK_SPECS[weekId] || WEEK_SPECS['warmup'];

  _exports.getWorkoutSpec = getWorkoutSpec;

  const applyWorkoutSpec = (week, max, bar, userPlates, roundingFactor, spec = getWorkoutSpec(week)) => spec.map(movement => {
    let appliedWeight = (0, _plateMath.roundToFactor)(movement.percent * max, roundingFactor);
    let weight = Math.max(appliedWeight, bar);
    let plates = (0, _plateMath.calcPlates)(userPlates, weight - bar);
    return { ...movement,
      weight,
      plates
    };
  });

  _exports.applyWorkoutSpec = applyWorkoutSpec;
});
;

;define('lift-tracker-531/config/environment', [], function() {
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

;
          if (!runningTests) {
            require("lift-tracker-531/app")["default"].create({"name":"lift-tracker-531","version":"0.0.0+0f76df90"});
          }
        
//# sourceMappingURL=lift-tracker-531.map
