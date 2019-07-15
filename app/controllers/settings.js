import Controller from '@ember/controller';

export default Controller.extend({
  showAccountTab: true,
  showLiftsTab: false,
  showBarLoadingTab: false,

  actions: {
    showAccountTab() {
      this.setProperties({
        showAccountTab: true,
        showLiftsTab: false,
        showBarLoadingTab: false,
      });
    },
    showLiftsTab() {
      this.setProperties({
        showAccountTab: false,
        showLiftsTab: true,
        showBarLoadingTab: false,
      });
    },
    showBarLoadingTab() {
      this.setProperties({
        showAccountTab: false,
        showLiftsTab: false,
        showBarLoadingTab: true,
      });
    }
  }
});