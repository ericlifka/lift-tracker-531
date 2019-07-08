import Component from '@ember/component';

export default Component.extend({
  classNames: ['title-bar'],
  showBackButton: true,
  settingsNavsBack: false,

  actions: {
    navigateBack() {
      history.back();
    }
  }
});