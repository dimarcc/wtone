import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  supplyPower: DS.attr('number'),
  supplyVoltage: DS.attr('number')
});
