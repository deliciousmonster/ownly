export class weeks extends tables.Weeks {
	get() {
		return super.get({ sort: { attribute: 'valueorder' } });
	}
}

export class draft extends tables.Users {
	post(content) {
		return super.post(content);
	}
	get() {
		const users = super.get({ select: ['name', 'weeks', 'blocks', 'priority'] });
		return users.map((u) => ({ name: u.name, weeks: u.weeks.map((w) => w.calendarorder), blocks: u.blocks, priority: u.priority }))
	}
}
