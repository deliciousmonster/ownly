import allocateWeeks from './helpers/allocateWeeks.js';
import seedUsers from './helpers/seedUsers.js';
import seedWeeks from './helpers/seedWeeks.js';
import seedProperties from './helpers/seedProperties.js';
const { Users, Weeks } = tables;

seedUsers();
seedWeeks();
seedProperties();

const weeksIterable = await Weeks.get({
	sort: { attribute: 'value', descending: true }
});
const weeksArray = await Array.fromAsync(weeksIterable);

export class lockstatus extends Users {
	allowRead() {}
	async get() {
		const users = await Array.fromAsync(Users.get({ select: ['locked'] }));
		return { locked: users.filter((u) => u.locked).length, total: users.length }
	}
}

export class getUser extends Users {
	allowRead() {}
	async get(query) {
		if(!this.weeks?.length) {
			this.weeks = weeksArray;
		}
		return super.get();
	}
}

export class getAllocations extends Users {
	allowRead() {}
	async get() {
		return Array.fromAsync(Users.get({ select: ['name', 'allocations', 'totalValue'] }));
	}
}

export class draft extends Users {
	allowRead() {}
	async get() {
		const users = Users.get({ select: ['id', 'name', 'weeks', 'blocks', 'priority'] });
		const draftObject = {};

		await Array.fromAsync(users.map(({ id, name, weeks, blocks, priority }) => draftObject[id] = ({ weeks: weeks?.length ? weeks.map(({ id, value }) => ({ id, value })) : weeksArray.map(({ id, value }) => ({ id, value })), blocks, priority, name })));

		const { allocated, unallocated } = allocateWeeks(draftObject);

		Object.keys(allocated).forEach((id) => {
			Users.patch(id, { allocations: allocated[id].allocations.map((a) => weeksArray.find((w) => w.id === a.id)), totalValue: allocated[id].totalValue })
		});

		unallocated.forEach((week) => {
			Weeks.patch(week.id, {maintenance: true })
		});

		return allocated;
	}
}
