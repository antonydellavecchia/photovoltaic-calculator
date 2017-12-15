import Ember from 'ember';

export default Ember.Controller.extend({
	orientation: null,
	orientations: ['north',
								'north east',
								'east',
								'south east',
								'south',
								'south west',
								'west',
								'north west',
								'horizontal'],

	elevation: null,
	elevations: [30,
							 45,
							 60,
							 0,
							 90],

	overshading: null,
	overshadings: ['little or none',
								 'modest',
								 'significant',
								 'heavy'],

	actions: {
		selectOrientation(orientation)
		{
			this.set('orientation', orientation);
		},

		selectElevation(elevation)
		{
			this.set('elevation', elevation);
		},

		selectOvershading(overshading)
		{
			this.set('overshading', overshading);
		},

		savePV()
		{
			// Get values from form
			let power = this.get('power');
			let orientation = this.get('orientation');
			let elevation = this.get('elevation');
			let overshading = this.get('overshading');

			// Clear input field
			this.set('power', null);

			// Create entry from values
			let photovoltaic = this.store.createRecord('photovoltaic', {
				power: power,
				orientation: orientation,
				elevation: elevation,
				overshading: overshading
			});
			
			photovoltaic.save();
		},

		delete(data)
		{
			data.destroyRecord();
		}
	}
});
