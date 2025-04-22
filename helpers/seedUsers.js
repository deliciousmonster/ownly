const { Users } = tables;

const seedUsers = [{
  'email': 'johnmoore@nbetween.art',
  'name': 'John',
  'blocks': 6,
  'priority': 1,
  'id': 'd546899f-84e9-4e02-9244-a92773b27018',
}, {
  'email': 'mdgbaja@gmail.com',
  'name': 'Eric',
  'blocks': 6,
  'priority': 2,
  'id': '1c63ad5e-55e1-42fe-a0be-90e11b70272a',
}, {
  'email': 'carey@marvidaproperties.com',
  'name': 'Carey',
  'blocks': 6,
  'priority': 3,
  'id': '448b4ce8-e900-40d8-86e2-6d638dce4589',
}, {
  'email': 'jaxon@deliciousmonster.com',
  'name': 'Jaxon',
  'blocks': 6,
  'priority': 4,
  'id': '495b2ca2-2938-4436-b3d7-f8fbc939bba5',
}, {
  'email': 'mmartines@builddominion.com',
  'name': 'Mike',
  'blocks': 6,
  'priority': 5,
  'id': '85a47448-299d-445e-95d4-93d8a88894c8',
}, {
  'email': 'mmartines1@builddominion.com',
  'name': 'Mike',
  'blocks': 6,
  'priority': 6,
  'id': '89084745-5dc3-4dbc-95d4-66f39a7f46f7',
}, {
  'email': 'mmartines2@builddominion.com',
  'name': 'Mike',
  'blocks': 6,
  'priority': 7,
  'id': 'b4bccbc3-44e8-44fc-b191-c616f1497fd6',
}, {
  'email': 'mmartines3@builddominion.com',
  'name': 'Mike',
  'blocks': 6,
  'priority': 8,
  'id': 'b4bccbc3-44e8-44fc-b191-c616f1497fd5',
}];

export default () => seedUsers.forEach((user) => Users.patch(user));
