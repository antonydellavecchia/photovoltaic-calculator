export default function() {
	this.namespace = '/api';

	// Search for stored photovolatics
	this.get('/photovoltaics');
}
