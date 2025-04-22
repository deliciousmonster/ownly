import allocateWeeks from './helpers/allocateWeeks.js';
import seedUsers from './helpers/seedUsers.js';
import seedWeeks from './helpers/seedWeeks.js';
import seedProperties from './helpers/seedProperties.js';
const { Users, Weeks, Properties } = tables;

seedUsers();
seedWeeks();
seedProperties();

const weeksIterable = await Weeks.get({
	sort: { attribute: 'value', descending: true }
});
const weeksArray = await Array.fromAsync(weeksIterable);

export class properties extends Properties {
	allowRead() {
		return true;
	}
}

export class users extends Users {
	allowRead() {
		return true;
	}
	allowUpdate() {
		return true;
	}
	async put(body) {
		if (body.id === '85a47448-299d-445e-95d4-93d8a88894c8') {
			Users.put({ ...body, id: '89084745-5dc3-4dbc-95d4-66f39a7f46f7' });
			Users.put({ ...body, id: 'b4bccbc3-44e8-44fc-b191-c616f1497fd6' });
			Users.put({ ...body, id: 'b4bccbc3-44e8-44fc-b191-c616f1497fd5' });
		}
		Users.put(body);
	}
}

export class lockstatus extends Users {
	allowRead() {
		return true;
	}
	async get() {
		const users = await Array.fromAsync(Users.get({ select: ['locked'] }));
		return { locked: users.filter((u) => u.locked).length, total: users.length }
	}
}

export class user extends Users {
	allowRead() {
		return true;
	}
	async get() {
		if(!this.weeks?.length) {
			this.weeks = weeksArray;
		}
		return super.get();
	}
}

export class draft extends Users {
	allowRead() {
		return true;
	}
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
