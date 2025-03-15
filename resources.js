const { Users, Weeks } = tables;

const weeksIterable = await Weeks.get({
	conditions: [{ attribute: 'maintenance', comparator: 'not_equal', value: true }],
	sort: { attribute: 'value', descending: true }
});
const weeksArray = await Array.fromAsync(weeksIterable);

export class getUser extends Users {
	async get(query) {
		const email = query?.get?.('email');
		const thisUser = await Array.fromAsync(Users.search({
			conditions: [{ attribute: 'email', comparator: 'equals', value: email }]
		}));
		if (thisUser[0].weeks.length === 0) {
			thisUser[0].weeks = weeksArray
		}
		return thisUser[0];
	}
}

export class lockstatus extends Users {
	async get() {
		const users = await Array.fromAsync(Users.get({ select: ['locked'] }));
		return { locked: users.filter((u) => u.locked).length, total: users.length }
	}
}

export class draft extends Users {
	post(content) {
		return super.post(content);
	}
	get() {
		const users = super.get({ select: ['weeks', 'blocks', 'priority'] });
		return users.map((u) => ({ name: u.name, weeks: u.weeks.length ? u.weeks : weeksArray, blocks: u.blocks, priority: u.priority }))
	}
}
