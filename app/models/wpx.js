import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  wpxIntRes: DS.attr('number'),
  wpxPower: DS.attr('number')
});
