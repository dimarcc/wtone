import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  jmpIntRes: DS.attr('number')
});
