import Route from '@ember/routing/route';

export default Route.extend({
    model(params) {
        return { week: params.week_id, lift: params.lift_id };
    }
});
