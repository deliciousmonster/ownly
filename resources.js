const { Users, Weeks } = tables;

const weeksIterable = await Weeks.get({ sort: { attribute: 'valueorder' } });
const weeksArray = await Array.fromAsync(weeksIterable);

export class getUser extends Users {
	async get(query) {
		const email = query?.get?.('email');
		const thisUser = await Array.fromAsync(Users.search({ conditions: [{ attribute: 'email', comparator: 'equals', value: email }]}));
		if (thisUser[0].weeks.length === 0) {
			thisUser[0].weeks = weeksArray
		}
		return thisUser[0];
	}
}

export class draft extends Users {
	post(content) {
		return super.post(content);
	}
	get() {
		const users = super.get({ select: ['weeks', 'blocks', 'priority'] });
		return users.map((u) => ({ name: u.name, weeks: u.weeks.length ? u.weeks : weeksArray.map((w) => {}), blocks: u.blocks, priority: u.priority }))
	}
}
