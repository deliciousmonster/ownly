const { Users, Weeks } = tables;

const weeksIterable = await Weeks.get({
	conditions: [{ attribute: 'maintenance', comparator: 'not_equal', value: true }],
	sort: { attribute: 'value', descending: true }
});
const weeksArray = await Array.fromAsync(weeksIterable);

export class lockstatus extends Users {
	async get() {
		const users = await Array.fromAsync(Users.get({ select: ['locked'] }));
		return { locked: users.filter((u) => u.locked).length, total: users.length }
	}
}

export class getUser extends Users {
	async get(query) {
		if(!this.weeks?.length) {
			this.weeks = weeksArray;
		}
		return super.get();
	}
}

export class getAllocations extends Users {
	async get() {
		const allocations = await Array.fromAsync(Users.get({ select: ['name', 'allocations', 'totalValue'] }));
		return allocations;
	}
}

export class draft extends Users {
	async get() {
		const users = super.get({ select: ['id', 'weeks', 'blocks', 'priority'] });
		const draftObject = {};

		await Array.fromAsync(users.map(({ id, weeks, blocks, priority }) => draftObject[id] = ({ weeks: weeks?.length ? weeks.map(({ id, value }) => ({ id, value })) : weeksArray.map(({ id, value }) => ({ id, value })), blocks, priority })));

		const allocations = distributeWeeks(draftObject);
		Object.keys(allocations).forEach((id) => {
			Users.patch(id, { allocations: allocations[id].allocations.map((a) => weeksArray.find((w) => w.id === a.id)), totalValue: allocations[id].totalValue })
		});
		return allocations;
	}
}

function distributeWeeks(users) {
	const sortedUsers = Object.entries(users).sort((a, b) => a[1].priority - b[1].priority);
	let allocatedWeeks = new Set();
	let results = {};
	let rounds = 3;
	let snakeOrder = [...sortedUsers, ...sortedUsers.slice().reverse()];

	for (let i = 0; i < rounds; i++) {
		for (let [userId, userData] of snakeOrder) {
			if (!results[userId]) {
				results[userId] = { allocations: [], totalValue: 0 };
			}

			let preferredWeek = userData.weeks.find(week => !allocatedWeeks.has(week.id));
			if (preferredWeek) {
				results[userId].allocations.push(preferredWeek);
				results[userId].totalValue += preferredWeek.value;
				allocatedWeeks.add(preferredWeek.id);
			}
		}
		snakeOrder.reverse();
	}

	return results;
}


const seedUsers = [{"email":"user6@gmail.com","name":"user6","blocks":3,"priority":6,"id":"00133b7c-5d03-45a6-aa79-a28de5061a1a"},{"email":"mdgbaja@gmail.com","name":"Eric","blocks":1,"priority":4,"id":"1c63ad5e-55e1-42fe-a0be-90e11b70272a"},{"email":"kimawiley@gmail.com","name":"Kimberly","blocks":1,"priority":2,"id":"448b4ce8-e900-40d8-86e2-6d638dce4589"},{"email":"santo@theplacenowaste.com","name":"Azzura","blocks":3,"priority":3,"id":"495b2ca2-2938-4436-b3d7-f8fbc939bba5"},{"email":"jaxon@deliciousmonster.com","name":"Jaxon","blocks":2,"priority":1,"id":"85a47448-299d-445e-95d4-93d8a88894c8"},{"email":"user7@gmail.com","name":"user7","blocks":1,"priority":7,"id":"89084745-5dc3-4dbc-95d4-66f39a7f46f8"},{"email":"user8@gmail.com","name":"user8","blocks":3,"priority":8,"id":"b4bccbc3-44e8-44fc-b191-c616f1497fd8"},{"email":"user5@gmail.com","name":"user5","blocks":2,"priority":5,"id":"d546899f-84e9-4e02-9244-a92773b27018"}];

console.log('seeding users');
seedUsers.forEach((user) => Users.patch(user));

const seedWeeks = [{"value":18,"id":1,"label":{"weeks":"1-2","description":"New Year’s Recovery / High Season Start"}},{"value":22,"id":2,"label":{"weeks":"3-4","description":"Whale Watching Season Peak 1"}},{"value":21,"id":3,"label":{"weeks":"5-6","description":"Whale Watching Season Peak 2"}},{"value":20,"id":4,"label":{"weeks":"7-8","description":"Whale Watching Season Peak 3"}},{"value":19,"id":5,"label":{"weeks":"9-10","description":"Whale Watching Season Peak 4"}},{"value":17,"id":6,"label":{"weeks":"11-12","description":"Spring Break"}},{"value":25,"id":7,"label":{"weeks":"13-14","description":"Semana Santa / Easter"}},{"value":11,"id":8,"label":{"weeks":"15-16","description":"Peak Season 1"}},{"value":10,"id":9,"label":{"weeks":"17-18","description":"Peak Season 2"}},{"value":9,"id":10,"label":{"weeks":"19-20","description":"Peak Season 3"}},{"value":8,"id":11,"label":{"weeks":"21-22","description":"Peak Season 4"}},{"value":7,"id":12,"label":{"weeks":"23-24","description":"Peak Season 5"}},{"id":13,"value":12,"label":{"weeks":"25-26","description":"Peak Season 6"}},{"label":{"weeks":"27-28","description":"Hottest Summer Weeks 1"},"value":6,"id":14},{"label":{"weeks":"29-30","description":"Hottest Summer Weeks 2"},"value":5,"id":15},{"label":{"weeks":"31-32","description":"Hottest Summer Weeks 3"},"value":4,"id":16,"maintenance":true},{"label":{"weeks":"33-34","description":"Hottest Summer Weeks 4"},"value":3,"id":17,"maintenance":true},{"value":2,"id":18,"label":{"weeks":"35-36","description":"Labor Day Weekend"}},{"value":1,"id":19,"label":{"weeks":"37-38","description":"October Shoulder Season"}},{"value":15,"id":20,"label":{"weeks":"39-40","description":"Whale Shark & Diving Peak Season 1"}},{"value":14,"id":21,"label":{"weeks":"41-42","description":"Whale Shark & Diving Peak Season 2"}},{"value":13,"id":22,"label":{"weeks":"43-44","description":"Whale Shark & Diving Peak Season 3"}},{"value":16,"id":23,"label":{"weeks":"45-46","description":"Baja 1000 Race / Los Cabos Film Festival"}},{"value":24,"id":24,"label":{"weeks":"47-48","description":"Thanksgiving Week"}},{"value":23,"id":25,"label":{"weeks":"49-50","description":"Post-Thanksgiving / Early December"}},{"value":26,"id":26,"label":{"weeks":"51–52","description":"Christmas & New Year’s"}}]

console.log('seeding weeks');
seedWeeks.forEach((week) => Weeks.put(week));
