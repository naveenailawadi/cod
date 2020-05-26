/**
 * Extend the base Actor entity by defining custom roll structures.
 * @extends {Actor}
 */

export class ActorCoD extends Actor {
	prepareData() {
		super.prepareData();

		const actorData = this.data;
		const data = actorData.data;
		const flags = actorData.flags;

		// Make separate methods for each Actor type (character, npc, etc.) to keep
		// things organized.
		if (actorData.type === 'character') this._prepareCharacterData(actorData);
	}

	// Prepare character data
	_prepareCharacterData(actorData) {
		const data = actorData.data;
		const attributes = data.attributes;
		const skills = data.skills;
		const advantages = data.advantages;

		// Define derived character values
		advantages.wp.max = attributes.res.value + attributes.com.value;
		advantages.speed.value = attributes.str.value + attributes.dex.value + 5;
		advantages.hp.max = advantages.size.value + attributes.sta.value;
		advantages.init.value = attributes.dex.value + attributes.com.value;
		advantages.def.value =
			Math.min(attributes.wits.value, attributes.dex.value) +
			skills.athletics.value;

		//Check to see if current HP/WP > max, correct if so
		if (advantages.hp.value > advantages.hp.max)
			advantages.hp.value = advantages.hp.max;
		if (advantages.hp.value < 0) advantages.hp.value = 0;
		if (advantages.wp.value > advantages.wp.max)
			advantages.wp.value = advantages.wp.max;
		if (advantages.wp.value < 0) advantages.wp.value = 0;
	}

	rollPool(attribute, skill, modifier, exploder) {
		// Ex: 'int', 'animalken', 'ten'. Define global roll pool, assume valid att
		// & skill sent even if 0 or negative value.
		let name = this.name;
		let pool = 0;
		let attVal = parseInt(this.data.data.attributes[attribute].value, 10);
		let skillVal = parseInt(this.data.data.skills[skill].value, 10);
		let attGroup = CONFIG.groupMapping[attribute];
		let skillGroup = CONFIG.groupMapping[skill];
		let modVal = parseInt(modifier, 10) || 0;
		let penalty = 0;
		let penaltyStr = '';
		let explodeStr = 'x10';

		// Determine if inadequate skill
		if (skillVal < 1) {
			if (skillGroup === 'mental') penalty = -3;
			else penalty = -1;
		}
		if (penalty < 0)
			penaltyStr = `<br> Insufficient skill! Penalty of ${penalty}`;

		// Determine exploder
		switch (exploder) {
			case 'none':
				explodeStr = '';
				break;
			case 'ten':
				explodeStr = 'x10';
				break;
			case 'nine':
				explodeStr = 'x>=9';
				break;
			case 'eight':
				explodeStr = 'x>=8';
				break;
		}

		console.log(`--------------`);
		console.log(
			`Initial roll pool: ${attribute} : ${attVal}, ${skill} : ${skillVal}, Mod : ${modVal}`
		);
		console.log(`Att: ${attGroup}, Skill: ${skillGroup}`);
		console.log(`Exploder: ${exploder}`);
		if (penalty < 0) console.log(`Penalty assessed: ${penalty}`);
		console.log(`--------------`);

		// Determine final roll pool
		pool = pool + attVal + skillVal + modVal + penalty;
		console.log(`Final roll pool: ${pool}`);
		console.log(`--------------`);

		if (pool > 0) {
			// Regular roll
			let roll = new Roll(`${pool}d10${explodeStr}cs>=8`).roll();
			roll.toMessage({
				flavor: `<b>${name}</b> makes a roll!<br>
					${CONFIG.attributes[attribute]}: ${attVal}<br>
					${CONFIG.skills[skill]}: ${skillVal}<br>
					Modifier: ${modVal}${penaltyStr}`,
			});
		} else {
			// Chance roll
			let roll = new Roll(`1d10cs=10`).roll();
			roll.toMessage({
				flavor: `<b>${name}</b> makes a roll!<br>
				${CONFIG.attributes[attribute]}: ${attVal}<br>
				${CONFIG.skills[skill]}: ${skillVal}<br> 
				Modifier: ${modVal} ${penaltyStr}<br>
			  Roll is reduced to a chance die!`,
			});
		}
	}

	attTaskPool(attribute1, attribute2, modifier, exploder) {
		// Ex: 'wits', 'composure', 'ten'. Define global roll pool, assume 2 valid att's sent even if 0 or negative value.
		let name = this.name;
		let pool = 0;
		let att1Val;
		let att2Val;
		let att1String;
		let att2String;

		if (attribute1 == 'none') {
			att1Val = 0;
			att1String = 'None';
		} else {
			att1Val = parseInt(this.data.data.attributes[attribute1].value, 10);
			att1String = `${CONFIG.attributes[attribute1]}: ${att1Val}`;
		}

		if (attribute2 == 'none') {
			att2Val = 0;
			att2String = 'None';
		} else {
			att2Val = parseInt(this.data.data.attributes[attribute2].value, 10);
			att2String = `${CONFIG.attributes[attribute2]}: ${att2Val}`;
		}

		let att1Group = CONFIG.groupMapping[attribute1];
		let att2Group = CONFIG.groupMapping[attribute2];
		let modVal = parseInt(modifier, 10) || 0;
		let explodeStr = 'x10';

		// Determine exploder
		switch (exploder) {
			case 'none':
				explodeStr = '';
				break;
			case 'ten':
				explodeStr = 'x10';
				break;
			case 'nine':
				explodeStr = 'x>=9';
				break;
			case 'eight':
				explodeStr = 'x>=8';
				break;
		}

		console.log(`--------------`);
		console.log(
			`Initial roll pool: ${attribute1} : ${att1Val}, ${attribute2} : ${att2Val}, Mod : ${modVal}`
		);
		console.log(
			`Attribute 1 Group: ${att1Group}, Attribute 2 Group: ${att2Group}`
		);
		console.log(`Exploder: ${exploder}`);
		console.log(`--------------`);

		// Determine final roll pool
		pool = pool + att1Val + att2Val + modVal;
		console.log(`Final roll pool: ${pool}`);
		console.log(`--------------`);

		if (pool > 0) {
			// Regular roll
			let roll = new Roll(`${pool}d10${explodeStr}cs>=8`).roll();
			roll.toMessage({
				flavor: `<b>${name}</b> makes an Attribute roll!<br>
				${att1String}<br>
				${att2String}<br>
				Modifier: ${modVal}`,
			});
		} else {
			// Chance roll
			let roll = new Roll(`1d10cs=10`).roll();
			roll.toMessage({
				flavor: `<b>${name}</b> makes an Attribute roll!<br>
				${att1String}<br>
				${att2String}<br>
				Modifier: ${modVal}<br>
			  Roll is reduced to a chance die!`,
			});
		}
	}

	weaponRollPool(attribute, skill, modifier, exploder, weapon, damage, target) {
		// Ex: 'int', 'animalken', -1, 'ten', 'Axe', 'Ben'. Define global roll pool, assume valid att & skill sent even if 0 or negative value.
		let name = this.name;
		let pool = 0;
		let attVal = parseInt(this.data.data.attributes[attribute].value, 10);
		let skillVal = parseInt(this.data.data.skills[skill].value, 10);
		let attGroup = CONFIG.groupMapping[attribute];
		let skillGroup = CONFIG.groupMapping[skill];
		let modVal = parseInt(modifier, 10) || 0;
		let penalty = 0;
		let penaltyStr = '';
		let explodeStr = 'x10';
		let rollString;

		// Determine if inadequate skill
		if (skillVal < 1) {
			if (skillGroup === 'mental') penalty = -3;
			else penalty = -1;
		}
		if (penalty < 0)
			penaltyStr = `<br> Insufficient skill! Penalty of ${penalty}`;

		// Determine exploder
		switch (exploder) {
			case 'none':
				explodeStr = '';
				break;
			case 'ten':
				explodeStr = 'x10';
				break;
			case 'nine':
				explodeStr = 'x>=9';
				break;
			case 'eight':
				explodeStr = 'x>=8';
				break;
		}
		console.log(`Weapon roll: ${attribute}, ${skill}`);
		console.log(`Target: ${target}`);
		if (target == 'none')
			rollString = `<b>${name}</b> attacks with <b>${weapon}</b>! (${damage} dmg)`;
		else
			rollString = `<b>${name}</b> attacks <b>${target}</b> with <b>${weapon}</b>! (${damage} dmg)`;

		console.log(`--------------`);
		console.log(
			`Initial roll pool: ${attribute} : ${attVal}, ${skill} : ${skillVal}, Mod : ${modVal}`
		);
		console.log(`Att: ${attGroup}, Skill: ${skillGroup}`);
		console.log(`Exploder: ${exploder}`);
		if (penalty < 0) console.log(`Penalty assessed: ${penalty}`);
		console.log(`--------------`);

		// Determine final roll pool
		pool = pool + attVal + skillVal + modVal + penalty;
		console.log(`Final roll pool: ${pool}`);
		console.log(`--------------`);

		if (pool > 0) {
			// Regular roll
			let roll = new Roll(`${pool}d10${explodeStr}cs>=8`).roll();
			roll.toMessage({
				flavor: `${rollString}<br>
					${CONFIG.attributes[attribute]}: ${attVal}<br>
					${CONFIG.skills[skill]}: ${skillVal}<br>
					Modifier: ${modVal}${penaltyStr}`,
			});
		} else {
			// Chance roll
			let roll = new Roll(`1d10cs=10`).roll();
			roll.toMessage({
				flavor: `${rollString}<br>
				${CONFIG.attributes[attribute]}: ${attVal}<br>
				${CONFIG.skills[skill]}: ${skillVal}<br> 
				Modifier: ${modVal} ${penaltyStr}<br>
			  Roll is reduced to a chance die!`,
			});
		}
	}
}
