Package.describe({
  name: 'liris-tech:create-collection',
  version: '0.0.1',
  summary: 'Create Meteor Collections in a more declarative way',
  git: 'https://github.com/liris-tech/create-collection.git',
  documentation: 'README.md'
});

Npm.depends({
  lodash: '4.17.21'
});

Package.onUse(function(api) {
  api.versionsFrom('2.15');
  api.use('ecmascript');
  api.mainModule('client.js', 'client');
  api.mainModule('server.js', 'server');
});