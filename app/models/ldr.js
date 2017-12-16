import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  ldrIntRes: DS.attr('number')
});
