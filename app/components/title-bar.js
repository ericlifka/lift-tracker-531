import Component from '@ember/component';

// import { computed } from '@ember/object';

export default Component.extend({
    classNames: [ 'title-bar' ],
    showBackButton: true,
    settingsNavsBack: false,

    actions: {
        navigateBack() {
            window.history.back();
        }
    }
});
