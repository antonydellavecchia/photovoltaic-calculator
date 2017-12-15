import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'table',

	totalEnergy: Ember.computed('photovoltaics.length', function()
	{
		return this.get('photovoltaics').reduce((sum, element) => sum += element.get('energy'), 0);
	}),
				
	actions:{
		deletePV(photovoltaic)
		{
			// Send action for controller to remove
			this.sendAction('delete', photovoltaic);
		}
	}
});

