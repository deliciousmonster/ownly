const { Properties } = tables;

const seedProperties = [{
  'id': 1730657007,
  'price': '$800,000 USD',
  'purchasedShares': 1,
  'totalShares': 8,
  'address': 'Gavilon, El Pescadero BCS',
  'image': 'gavilon.jpg',
  'name': 'Mountain Rey',
}, {
  'id': 1730657008,
  'price': '$280,000 USD',
  'purchasedShares': 0,
  'totalShares': 8,
  'address': 'San Pedrito, El Pescadero BCS',
  'image': 'solito.jpg',
  'name': 'Solito',
}, {
  'id': 1730657009,
  'price': '$150,000 USD',
  'purchasedShares': 0,
  'totalShares': 8,
  'address': 'Cerritos, El Pescadero BCS',
  'image': 'saltbreeze.jpeg',
  'name': 'Salt Breeze',
}, {
  'id': 1730657010,
  'price': '$650,000 USD',
  'purchasedShares': 0,
  'totalShares': 8,
  'address': 'San Pedrito, El Pescadero BCS',
  'image': 'constellation.png',
  'name': 'Constellation',
}, {
  'price': '$1,000,000 USD',
  'purchasedShares': 0,
  'totalShares': 8,
  'address': 'San Pedrito, El Pescadero BCS',
  'image': 'casablanca.jpeg',
  'name': 'Casablanca',
  'id': 1730657011,
}];

export default () => seedProperties.forEach((property) => Properties.patch(property));
