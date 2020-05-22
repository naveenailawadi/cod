/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class CoDItem extends Item {
	/**
	 * Augment the basic Item data model with additional dynamic data.
	 */
	prepareData() {
		super.prepareData();

		// Get the Item's data
		const itemData = this.data;
		const actorData = this.actor ? this.actor.data : {};
		const data = itemData.data;
	}

	/**
	 * Handle clickable rolls.
	 * @param {Event} event   The originating click event
	 * @private
	 */
	async roll() {
		// Basic template rendering data
		const token = this.actor.token;
		const item = this.data;
		let actorData = this.actor ? this.actor.data.data : {};
		const itemData = item.data;

		function sortAttrGroups(data) {
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
					displayAttrGroups[g][a] += ' (' + data.attributes[a].value + ')';
				}
			}
			console.log(displayAttrGroups);
			return displayAttrGroups;
		}
		function sortSkillGroups(data) {
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
					displaySkillGroups[g][s] += ' (' + data.skills[s].value + ')';
				}
			}
			return displaySkillGroups;
		}
		function weaponRollPool(
			attribute,
			skill,
			modifier,
			exploder,
			weapon,
			target
		) {
			// Ex: 'int', 'animalken', -1, 'ten', 'Axe', 'Ben'. Define global roll pool, assume valid att & skill sent even if 0 or negative value.
			let name = this.actor.name;
			let pool = 0;
			let attVal = parseInt(
				this.actor.data.data.attributes[attribute].value,
				10
			);
			let skillVal = parseInt(this.actor.data.data.skills[skill].value, 10);
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
				rollString = `<b>${name}</b> attacks with <b>${weapon}</b>!`;
			else
				rollString = `<b>${name}</b> attacks <b>${target}</b> with <b>${weapon}</b>!`;

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

		const attributes = sortAttrGroups(actorData);
		const skills = sortSkillGroups(actorData);

		console.log(`Attributes are ${attributes}`);
		console.log(`Skills are ${skills}`);

		let weaponName = item.name;
		console.log(`Weapon name: ${weaponName}`);
		let attackType = item.data.attack.value;
		console.log(`Attack Type: ${attackType}`);
		let formula = CONFIG.attackSkills[attackType];
		formula = formula.split(',');
		// Formula[0] = attribute, Formula[1] = skill (e.g., 'str', 'brawl')

		let defaultSelectionAtt = formula[0];
		let defaultSelectionSkill = formula[1];
		console.log(`Default Att: ${formula[0]}`);
		console.log(`Default Skill: ${formula[1]}`);

		let dialogData = {
			defaultSelectionAtt: defaultSelectionAtt,
			defaultSelectionSkill: defaultSelectionSkill,
			skills: skills,
			attributes: attributes,
			groups: CONFIG.groups,
		};

		// If a target is selected
		if (game.user.targets.size == 1) {
			let target = game.user.targets.values().next().value.actor.data.name;
			let targetDef =
				-1 *
				game.user.targets.values().next().value.actor.data.data.advantages.def
					.value;

			if (attackType === 'ranged') {
				console.log(`Target's defense not applied`);
				weaponRollPool(formula[0], formula[1], 0, 'ten', weaponName, target);
				console.log(``);
			} else {
				weaponRollPool(
					formula[0],
					formula[1],
					targetDef,
					'ten',
					weaponName,
					target
				);
				console.log(``);
			}
		} else {
			// If no target selected, create popup dialogue
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
										weaponRollPool(
											attributeSelected,
											skillSelected,
											poolModifier,
											exploderSelected,
											weaponName,
											'none'
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
		}
	}
}
