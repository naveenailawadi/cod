/**
 * Chronicles of Darkness for FVTT
 */

// Import Modules
import {ActorCoD} from './actor.js';
import {CoDItemSheet} from './item-sheet.js';
import {ActorSheetCoD} from './actor-sheet.js';

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

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

/**
 * Set an initiative formula for the system
 * @type {String}
 */
CONFIG.initiative.formula = '1d10';

// Define custom Entity classes
CONFIG.Actor.entityClass = ActorCoD;

// Register sheet application classes
Actors.unregisterSheet('core', ActorSheet);
Actors.registerSheet('cod', ActorSheetCoD, {types: [], makeDefault: true});
Items.unregisterSheet('core', ItemSheet);
Items.registerSheet('core', CoDItemSheet, {types: [], makeDefault: true});

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

// Character Types
CONFIG.splats = {
	mortal: 'Mortal',
	vampire: 'Vampire',
	werewolf: 'Werewolf',
	mage: 'Mage',
	changeling: 'Changeling',
	hunter: 'Hunter',
	geist: 'Geist',
	mummy: 'Mummy',
	demon: 'Demon',
	beast: 'Beast',
	deviant: 'Deviant',
};
