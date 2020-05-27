/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
	// Define template paths to load
	const templatePaths = [
		// Actor Sheet Partials
		'systems/cod/templates/actor/actor-disciplines.html',
		'systems/cod/templates/actor/actor-display.html',
		'systems/cod/templates/actor/actor-equipment.html',
		'systems/cod/templates/actor/actor-extra.html',
		'systems/cod/templates/actor/actor-main.html',
		'systems/cod/templates/actor/actor-merits.html',
		'systems/cod/templates/actor/actor-rolls.html',
		'systems/cod/templates/actor/actor-skills.html',

		// Generic Item Sections
		'systems/cod/templates/items/parts/item-description.html',
		'systems/cod/templates/items/parts/item-effect.html',
		'systems/cod/templates/items/parts/item-cause.html',
		'systems/cod/templates/items/parts/item-resolution.html',

		// Specific Item Sheets
		'systems/cod/templates/items/parts/armor-attributes.html',
		'systems/cod/templates/items/parts/equipment-attributes.html',
		'systems/cod/templates/items/parts/merit-attributes.html',
		'systems/cod/templates/items/parts/numina-attributes.html',
		'systems/cod/templates/items/parts/service-attributes.html',
		'systems/cod/templates/items/parts/vehicle-attributes.html',
		'systems/cod/templates/items/parts/weapon-attributes.html',
	];

	// Load the template parts
	return loadTemplates(templatePaths);
};
