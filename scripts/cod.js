// Characteristic Names
CONFIG.attributes = {
	int: 'Intelligence',
	wits: 'Wits',
	res: 'Resolve',
	str: 'Strength',
	dex: 'Dexterity',
	sta: 'Stamina',
	pre: 'Presence',
	man: 'Manipulation',
	com: 'Composure',
};

// Skills Names
CONFIG.skills = {
	academics: 'Academics',
	computer: 'Computer',
	crafts: 'Crafts',
	investigation: 'Investigation',
	medicine: 'Medicine',
	occult: 'Occult',
	politics: 'Politics',
	science: 'Science',
	athletics: 'Athletics',
	brawl: 'Brawl',
	drive: 'Drive',
	firearms: 'Firearms',
	larceny: 'Larceny',
	stealth: 'Stealth',
	survival: 'Survival',
	weaponry: 'Weaponry',
	animalken: 'Animal Ken',
	empathy: 'Empathy',
	expression: 'Expression',
	intimidation: 'Intimidation',
	persuasion: 'Persuasion',
	socialize: 'Socialize',
	streetwise: 'Streetwise',
	subterfuge: 'Subterfuge',
};

// Group Names
CONFIG.groups = {
	mental: 'Mental',
	physical: 'Physical',
	social: 'Social',
};

// Group Mapping
CONFIG.groupMapping = {
	int: 'mental',
	wits: 'mental',
	res: 'mental',
	str: 'physical',
	dex: 'physical',
	sta: 'physical',
	pre: 'social',
	man: 'social',
	com: 'social',
	academics: 'mental',
	computer: 'mental',
	crafts: 'mental',
	investigation: 'mental',
	medicine: 'mental',
	occult: 'mental',
	politics: 'mental',
	science: 'mental',
	athletics: 'physical',
	brawl: 'physical',
	drive: 'physical',
	firearms: 'physical',
	larceny: 'physical',
	stealth: 'physical',
	survival: 'physical',
	weaponry: 'physical',
	animalken: 'social',
	empathy: 'social',
	expression: 'social',
	intimidation: 'social',
	persuasion: 'social',
	socialize: 'social',
	streetwise: 'social',
	subterfuge: 'social',
};

// Attack Categories
CONFIG.attacks = {
	brawl: 'Brawl',
	melee: 'Melee',
	ranged: 'Ranged',
	thrown: 'Thrown',
	brawlFinesse: 'Brawl (Fighting Finesse)',
	meleeFinesse: 'Melee (Fighting Finesse)',
};

// Attack Skills
CONFIG.attackSkills = {
	brawl: 'str,brawl',
	melee: 'str,weaponry',
	ranged: 'dex,firearms',
	thrown: 'dex,athletics',
	brawlFinesse: 'dex,brawl',
	meleeFinesse: 'dex,weaponry',
};

class ActorCoD extends Actor {
	rollPool(attribute, skill, modifier, exploder) {
		// Ex: 'int', 'animalken', 'ten'. Define global roll pool, assume valid att & skill sent even if 0 or negative value.

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
				flavor: `${attribute}: ${attVal}, ${skill}: ${skillVal}, mod: ${modVal}${penaltyStr}`,
			});
		} else {
			// Chance roll
			let roll = new Roll(`1d10cs=10`).roll();
			roll.toMessage({
				flavor: `${attribute}: ${attVal}, ${skill}: ${skillVal}, mod: ${modVal} ${penaltyStr}<br>
				 Roll is reduced to a chance die!`,
			});
		}
	}

	attTaskPool(attribute1, attribute2, modifier, exploder) {
		// Ex: 'wits', 'composure', 'ten'. Define global roll pool, assume 2 valid att's sent even if 0 or negative value.

		let pool = 0;
		let att1Val = parseInt(this.data.data.attributes[attribute1].value, 10);
		let att2Val = parseInt(this.data.data.attributes[attribute2].value, 10);
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
		console.log(`Att1: ${att1Group}, Att2: ${att2Group}`);
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
				flavor: `${attribute1}: ${att1Val}, ${attribute2}: ${att2Val}, mod: ${modVal}`,
			});
		} else {
			// Chance roll
			let roll = new Roll(`1d10cs=10`).roll();
			roll.toMessage({
				flavor: `${attribute1}: ${att1Val}, ${attribute2}: ${att2Val}, mod: ${modVal}<br>
				 Roll is reduced to a chance die!`,
			});
		}
	}
}

CONFIG.Actor.entityClass = ActorCoD;

//Extend the basic ActorSheet with some very simple modifications

class ActorSheetCoD extends ActorSheet {
	//Extend and override the default options

	static get defaultOptions() {
		const options = super.defaultOptions;
		options.classes = options.classes.concat(['cod', 'actor-sheet']);
		options.template = 'systems/cod/templates/actor/actor-sheet.html';
		options.width = 610;
		options.height = 610;
		return options;
	}

	getData() {
		const sheetData = super.getData();
		this._prepareItems(sheetData.actor);
		sheetData.attributes = this.sortAttrGroups();
		sheetData.skills = this.sortSkillGroups();
		return sheetData;
	}

	_prepareItems(actorData) {
		actorData.weapons = [];
		actorData.armors = [];
		actorData.equipments = [];
		actorData.vehicles = [];
		actorData.merits = [];
		actorData.services = [];
		actorData.conditions = [];
		actorData.tilts = [];
		actorData.dreads = [];
		actorData.numinas = [];
		actorData.disciplines = [];

		for (let i of actorData.items) {
			if (i.type == 'weapon') {
				actorData.weapons.push(i);
			}
			if (i.type == 'armor') {
				actorData.armors.push(i);
			}
			if (i.type == 'equipment') {
				actorData.equipments.push(i);
			}
			if (i.type == 'vehicle') {
				actorData.vehicles.push(i);
			}
			if (i.type == 'merit') {
				actorData.merits.push(i);
			}
			if (i.type == 'service') {
				actorData.services.push(i);
			}
			if (i.type == 'condition') {
				actorData.conditions.push(i);
			}
			if (i.type == 'tilt') {
				actorData.tilts.push(i);
			}
			if (i.type == 'dread') {
				actorData.dreads.push(i);
			}
			if (i.type == 'numina') {
				actorData.numinas.push(i);
			}
			if (i.type == 'discipline') {
				actorData.disciplines.push(i);
			}
		}
	}

	sortAttrGroups() {
		let skills = duplicate(CONFIG.skills);
		let attributes = duplicate(CONFIG.attributes);
		let skillGroups = duplicate(CONFIG.groups);
		let attrGroups = duplicate(CONFIG.groups);

		for (let g in skillGroups) {
			skillGroups[g] = {};
			attrGroups[g] = {};
		}

		for (let s in skills) {
			let skillGroup = CONFIG.groupMapping[s];
			skillGroups[skillGroup][s] = skills[s];
		}
		for (let a in attributes) {
			let attrGroup = CONFIG.groupMapping[a];
			attrGroups[attrGroup][a] = attributes[a];
		}

		let displayAttrGroups = Object.keys(attrGroups)
			.map((key) => {
				const newKey = CONFIG.groups[key];
				return {[newKey]: attrGroups[key]};
			})
			.reduce((a, b) => Object.assign({}, a, b));

		for (let g in displayAttrGroups) {
			for (let a in displayAttrGroups[g]) {
				displayAttrGroups[g][a] +=
					' (' + this.actor.data.data.attributes[a].value + ')';
			}
		}
		return displayAttrGroups;
	}

	sortSkillGroups() {
		let skills = duplicate(CONFIG.skills);
		let attributes = duplicate(CONFIG.attributes);
		let skillGroups = duplicate(CONFIG.groups);
		let attrGroups = duplicate(CONFIG.groups);

		for (let g in skillGroups) {
			skillGroups[g] = {};
			attrGroups[g] = {};
		}

		for (let s in skills) {
			let skillGroup = CONFIG.groupMapping[s];
			skillGroups[skillGroup][s] = skills[s];
		}
		for (let a in attributes) {
			let attrGroup = CONFIG.groupMapping[a];
			attrGroups[attrGroup][a] = attributes[a];
		}

		let displaySkillGroups = Object.keys(skillGroups)
			.map((key) => {
				const newKey = CONFIG.groups[key];
				return {[newKey]: skillGroups[key]};
			})
			.reduce((a, b) => Object.assign({}, a, b));

		for (let g in displaySkillGroups) {
			for (let s in displaySkillGroups[g]) {
				displaySkillGroups[g][s] +=
					' (' + this.actor.data.data.skills[s].value + ')';
			}
		}
		return displaySkillGroups;
	}

	/* -------------------------------------------- */

	// Activate event listeners using the prepared sheet HTML

	activateListeners(html) {
		super.activateListeners(html);

		// Click attribute/skill roll
		html.find('.roll-pool').click((event) => {
			let defaultSelection = $(event.currentTarget).attr('data-skill');

			let dialogData = {
				defaultSelectionAtt: defaultSelection,
				defaultSelectionSkill: defaultSelection,
				skills: this.sortSkillGroups(),
				attributes: this.sortAttrGroups(),
				groups: CONFIG.groups,
			};

			renderTemplate('systems/cod/templates/pool-dialog.html', dialogData).then(
				(html) => {
					new Dialog({
						title: 'Roll Dice Pool',
						content: html,
						buttons: {
							Yes: {
								icon: '<i class="fa fa-check"></i>',
								label: 'Yes',
								callback: (html) => {
									let attributeSelected = html
										.find('[name="attributeSelector"]')
										.val();
									let poolModifier = html.find('[name="modifier"]').val();
									let skillSelected = html.find('[name="skillSelector"]').val();
									let exploderSelected = html
										.find('[name="exploderSelector"]')
										.val();
									if (attributeSelected === 'none' || skillSelected === 'none')
										console.log(`Invalid pool selected.`);
									else
										this.actor.rollPool(
											attributeSelected,
											skillSelected,
											poolModifier,
											exploderSelected
										);
									console.log(``);
								},
							},
							cancel: {
								icon: '<i class="fas fa-times"></i>',
								label: 'Cancel',
							},
						},
						default: 'Yes',
					}).render(true);
				}
			);
		});

		// Click weapon roll
		html.find('.weapon-roll').click((event) => {
			let itemId = $(event.currentTarget).parents('.item').attr('data-item-id');
			let item = this.actor.getEmbeddedEntity('OwnedItem', itemId);
			let attackType = item.data.attack.value;
			let formula = CONFIG.attackSkills[attackType];
			formula = formula.split(',');
			// Formula[0] = attribute, Formula[1] = skill (e.g., 'str', 'brawl')
			let targetDef = 0;

			let defaultSelectionAtt = formula[0];
			let defaultSelectionSkill = formula[1];
			console.log(
				`Weapon roll: ${defaultSelectionAtt}, ${defaultSelectionSkill}`
			);

			let dialogData = {
				defaultSelectionAtt: defaultSelectionAtt,
				defaultSelectionSkill: defaultSelectionSkill,
				skills: this.sortSkillGroups(),
				attributes: this.sortAttrGroups(),
				groups: CONFIG.groups,
			};

			// If a target is selected
			if (game.user.targets.size == 1) {
				targetDef =
					-1 *
					game.user.targets.values().next().value.actor.data.data.advantages.def
						.value;

				if (attackType === 'ranged') {
					console.log(`Target's defense not applied`);
					this.actor.rollPool(formula[0], formula[1], 0, 'ten');
					console.log(``);
				} else {
					this.actor.rollPool(formula[0], formula[1], targetDef, 'ten');
					console.log(``);
				}
			} else {
				// If no target selected, create popup dialogue
				renderTemplate(
					'systems/cod/templates/pool-dialog.html',
					dialogData
				).then((html) => {
					new Dialog({
						title: 'Roll Dice Pool',
						content: html,
						buttons: {
							Yes: {
								icon: '<i class="fa fa-check"></i>',
								label: 'Yes',
								callback: (html) => {
									let attributeSelected = html
										.find('[name="attributeSelector"]')
										.val();
									let poolModifier = html.find('[name="modifier"]').val();
									let skillSelected = html.find('[name="skillSelector"]').val();
									let exploderSelected = html
										.find('[name="exploderSelector"]')
										.val();
									if (attributeSelected === 'none' || skillSelected === 'none')
										console.log(`Invalid pool selected.`);
									else
										this.actor.rollPool(
											attributeSelected,
											skillSelected,
											poolModifier,
											exploderSelected
										);
									console.log(``);
								},
							},
							cancel: {
								icon: '<i class="fas fa-times"></i>',
								label: 'Cancel',
							},
						},
						default: 'Yes',
					}).render(true);
				});
			}
		});

		// Click attribute task roll
		html.find('.att-roll-pool').click((event) => {
			let dialogData = {
				attributes: this.sortAttrGroups(),
				groups: CONFIG.groups,
			};

			renderTemplate(
				'systems/cod/templates/att-pool-dialog.html',
				dialogData
			).then((html) => {
				new Dialog({
					title: 'Roll Dice Pool',
					content: html,
					buttons: {
						Yes: {
							icon: '<i class="fa fa-check"></i>',
							label: 'Yes',
							callback: (html) => {
								let attribute1Selected = html
									.find('[name="attribute1Selector"]')
									.val();
								let poolModifier = html.find('[name="modifier"]').val();
								let attribute2Selected = html
									.find('[name="attribute2Selector"]')
									.val();
								let exploderSelected = html
									.find('[name="exploderSelector"]')
									.val();
								if (
									attribute1Selected === 'none' ||
									attribute2Selected === 'none'
								)
									console.log(`Invalid pool selected.`);
								else
									this.actor.attTaskPool(
										attribute1Selected,
										attribute2Selected,
										poolModifier,
										exploderSelected
									);
								console.log(``);
							},
						},
						cancel: {
							icon: '<i class="fas fa-times"></i>',
							label: 'Cancel',
						},
					},
					default: 'Yes',
				}).render(true);
			});
		});

		// Activate tabs
		let tabs = html.find('.tabs');
		let initial = this.actor.data.flags['_sheetTab'];
		new Tabs(tabs, {
			initial: initial,
			callback: (clicked) =>
				(this.actor.data.flags['_sheetTab'] = clicked.attr('data-tab')),
		});

		// Everything below here is only needed if the sheet is editable
		if (!this.options.editable) return;

		// Update Inventory Item
		html.find('.item-edit').click((ev) => {
			const li = $(ev.currentTarget).parents('.item');
			const item = this.actor.items.find(
				(i) => i.id == li.attr('data-item-id')
			);
			item.sheet.render(true);
		});

		// Delete Inventory Item
		html.find('.item-delete').click((ev) => {
			const li = $(ev.currentTarget).parents('.item');
			this.actor.deleteEmbeddedEntity('OwnedItem', li.data('itemId'));
			li.slideUp(200, () => this.render(false));
		});

		// Add item
		html.find('.item-add').click((ev) => {
			const type = $(ev.currentTarget).attr('data-item-type');
			if (type != 'roll')
				this.actor.createEmbeddedEntity('OwnedItem', {
					type: type,
					name: `New ${type.capitalize()}`,
				});
			else {
				let rolls = duplicate(this.actor.data.data.rolls);
				rolls.push({name: 'New Roll'});
				this.actor.update({'data.rolls': rolls});
			}
		});

		// Update roll name
		html.find('.roll-name').change((ev) => {
			let rollIndex = $(ev.currentTarget).parents('.rolls').attr('data-index');
			let newName = ev.target.value;
			let rollList = duplicate(this.actor.data.data.rolls);
			rollList[rollIndex].name = newName;
			this.actor.update({'data.rolls': rollList});
		});

		// Delete roll
		html.find('.roll-delete').click((ev) => {
			let rollIndex = Number(
				$(ev.currentTarget).parents('.rolls').attr('data-index')
			);
			let rollList = duplicate(this.actor.data.data.rolls);
			rollList.splice(rollIndex, 1);
			this.actor.update({'data.rolls': rollList});
		});

		// Change custom roll attribute
		html.find('.roll.attribute-selector').change((ev) => {
			let rollIndex = Number(
				$(ev.currentTarget).parents('.rolls').attr('data-index')
			);
			let primary = $(ev.currentTarget).hasClass('primary');
			let secondary = $(ev.currentTarget).hasClass('secondary');
			let modifier = $(ev.currentTarget).hasClass('modifier');
			let exploder = $(ev.currentTarget).hasClass('exploder');
			let rollList = duplicate(this.actor.data.data.rolls);

			if (primary) rollList[rollIndex].primary = ev.target.value;
			if (secondary) rollList[rollIndex].secondary = ev.target.value;
			if (modifier) rollList[rollIndex].modifier = Number(ev.target.value);
			if (exploder) rollList[rollIndex].exploder = ev.target.value;

			this.actor.update({'data.rolls': rollList});
		});

		// Click custom roll 'Roll' button
		html.find('.roll-button').mousedown((ev) => {
			let rollIndex = Number(
				$(ev.currentTarget).parents('.rolls').attr('data-index')
			);
			this.actor.data.data.rolls;
			if (this.actor.data.data.rolls[rollIndex].exploder === undefined) {
				this.actor.data.data.rolls[rollIndex].exploder = 'ten';
			}
			this.actor.rollPool(
				this.actor.data.data.rolls[rollIndex].primary,
				this.actor.data.data.rolls[rollIndex].secondary,
				this.actor.data.data.rolls[rollIndex].modifier,
				this.actor.data.data.rolls[rollIndex].exploder
			);
		});
	}
}

/* -------------------------------------------- */

// Extend the basic ItemSheet with some very simple modifications

class CoDItemSheet extends ItemSheet {
	// Extend and override the default options

	static get defaultOptions() {
		const options = super.defaultOptions;
		options.classes = options.classes.concat(['cod', 'item-sheet']);
		options.template = 'systems/cod/templates/items/item-sheet.html';
		options.height = 440;
		return options;
	}

	//Use a type-specific template for each different item type

	get template() {
		let type = this.item.type;
		return `systems/cod/templates/items/item-${type}-sheet.html`;
	}

	getData() {
		const data = super.getData();
		if (this.item.type == 'weapon') {
			data['attacks'] = CONFIG.attacks;
		}
		return data;
	}

	// Activate event listeners using the prepared sheet HTML
	//* @param html {HTML}   The prepared HTML object ready to be rendered into the DOM

	activateListeners(html) {
		super.activateListeners(html);

		// Activate tabs
		let tabs = html.find('.tabs');
		let initial = this._sheetTab;
		new Tabs(tabs, {
			initial: initial,
			callback: (clicked) => (this._sheetTab = clicked.data('tab')),
		});
	}
}

Actors.unregisterSheet('core', ActorSheet);
Actors.registerSheet('cod', ActorSheetCoD, {types: [], makeDefault: true});
Items.unregisterSheet('core', ItemSheet);
Items.registerSheet('core', CoDItemSheet, {
	types: [],
	makeDefault: true,
});

//Set initiative formula
CONFIG.initiative.formula = '1d10';

Hooks.once('init', () => {
	loadTemplates([
		'systems/cod/templates/actor/actor-disciplines.html',
		'systems/cod/templates/actor/actor-display.html',
		'systems/cod/templates/actor/actor-equipment.html',
		'systems/cod/templates/actor/actor-extra.html',
		'systems/cod/templates/actor/actor-main.html',
		'systems/cod/templates/actor/actor-merits.html',
		'systems/cod/templates/actor/actor-rolls.html',
		'systems/cod/templates/actor/actor-skills.html',
	]);
});
