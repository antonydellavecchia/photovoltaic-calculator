import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
	power: DS.attr('number'),
	orientation: DS.attr('string'),
	elevation: DS.attr('number'),
	overshading: DS.attr('string'),

	// Find A, B, C values and return [a, b, c]
	abcArr: Ember.computed('orientation', 'elevation', function()
	{
		let	orient = this.get('orientation');
		let elev = this.get('elevation');
			
		// Table U5, keys are orientation, values are [[ k1, k2, k3], [k4, k5, k6], [k7, k8, k9]]
		let kValues =  {
			'north': [[26.3, -38.5, 14.8], [-16.5, 27.3, -11.9], [-1.06, 0.0872, -0.191]],
			'north east':  [[0.165, -3.68, 3.0], [6.38, -4.53, -0.405], [-4.38, 4.89, -1.99]],
			'north west': [[0.165, -3.68, 3.0], [6.38, -4.53, -0.405], [-4.38, 4.89, -1.99]],
			'east': [[1.44, -2.36, 1.07], [-0.514, 1.89, -1.64], [-0.542, -0.757, 0.604]],
			'west': [[1.44, -2.36, 1.07], [-0.514, 1.89, -1.64], [-0.542, -0.757, 0.604]],
			'south east': [[-2.95, 2.89, 1.17], [5.67, -3.54, -4.28], [-2.72, -0.25, 3.07]],
			'south west': [[-2.95, 2.89, 1.17], [5.67, -3.54, -4.28], [-2.72, -0.25, 3.07]],
			'south': [[-0.66, -0.106, 2.93], [3.63, -0.374, -7.4], [-2.71, -0.991, 4.59]],
			'horizontal': [[1, 1, 1], [1, 1, 1], [1, 1, 1]]
		};

		let tiltAngle = elev * (Math.PI / 180);
		let sinValue = Math.sin(tiltAngle / 2);
		let sinVector = [Math.pow(sinValue, 3), Math.pow(sinValue, 2), sinValue];
		let kMatrix = kValues[orient];

		let a = this.dot(sinVector, kMatrix[0]);
		let b = this.dot(sinVector, kMatrix[1]);
		let c = this.dot(sinVector, kMatrix[2]) + 1;
			
		return [a, b, c];
	}),												 

	// Calculate energy generated by PV
	energy: Ember.computed('power', 'overshading', 'abcArr', function()
	{
		let overshading = this.get('overshading');
		let abcArr = this.get('abcArr');
		let power = this.get('power');
			
		// Table U3 west of scotland index is the month 0 is jan , 1 is feb ... entries [solarIr, delta]
		let sDelta = [[19, -20.7],
									[46, -12.8],
									[88, -1.8],
									[148, 9.8],
									[196, 18.8],
									[193, 23.1],
	  							[185, 21.2],
									[150, 13.7],
									[101, 2.9],
									[55, -8.7],
									[25, -18.4],
									[14, -23.0]];	
			
		// Table H2
		let overshadingValues = {
			'heavy': 0.5,
			'significant': 0.65,
			'modest': 0.8,
			'little or none': 1.0
		};
			
		// Calculate annual Solar radiation  
		let solarMonth = sDelta.map( x => x[0] * this.calculateR(x[1], abcArr));
		let	solarAnnual = 0.028 * solarMonth.reduce((sum, element, index) => sum += element * this.daysInMonth(index), 0);
		
		return 0.8 * power * solarAnnual * overshadingValues[overshading];
	}),

	// Return  R factor by month
	calculateR(delta, abcArr)
	{
		// Latitude west of scotland value from table U4 in degrees
		let latitude = 55.9;
			
		let angle = (latitude - delta) * (Math.PI / 180);
		let cosValue = Math.cos(angle);
		let cosVector = [Math.pow(cosValue, 2), cosValue, 1];

		return this.dot(cosVector, abcArr);
	},
				 											 
	// Returns the dot product of two number arrays 
	dot(arr1, arr2)
	{
		return arr1.reduce((sum, element, index) => sum += element * arr2[index], 0);
	},

	// Calculate days per Month
	daysInMonth(month)
	{
		let year = 2017;			
		return new Date(year, month + 1, 0).getDate();
	}												 
});