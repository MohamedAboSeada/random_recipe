// www.themealdb.com/api/json/v1/1/lookup.php?i=52772
async function get_rand_meal() {
	let res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
	let data = await res.json();
	return data.meals[0];
}

async function display_meal() {
	let meal = await get_rand_meal();
	console.log(meal);

	// get the recipe card
	let recipe_card = document.querySelector('.recipe');
	let recipe_thumb = recipe_card.querySelector('.recipeThumb');

	// setting recipe image
	recipe_thumb.style.setProperty(
		'background-image',
		`url(${meal.strMealThumb})`
	);

	// setting up info
	let info = recipe_card.querySelector('.info');
	let country = info.querySelector('.ctr');
	let category = info.querySelector('.cat');
	let name = info.querySelector('.name');
	let ingridents = info.querySelector('.ingridents');
	let youtubeVideo = info.querySelector('.inst_video');
	country.textContent = meal.strArea;
	name.textContent = meal.strMeal;
	category.textContent = meal.strCategory;
	youtubeVideo.href = meal.strYoutube;
	// form ingridents and it's measurment
	let ingridents_list = {};
	for (let i = 1; i <= 20; i++) {
		if (meal[`strIngredient${i}`] !== '' && meal[`strMeasure${i}`] !== '') {
			ingridents_list[`${meal[`strIngredient${i}`]}`] =
				meal[`strMeasure${i}`];
		}
	}
	[...ingridents.children].slice(1).forEach((child) => {
		child.remove();
	});
	Object.entries(ingridents_list).forEach((key) => {
		ingridents.append(create_row(key[0], key[1]));
	});

	clean_instructions(meal.strInstructions);
}

function clean_instructions(instructions) {
	let instructionss = document.querySelector('.inst');

	let cleaned = instructions.split('. ');
	cleaned.forEach((instr) => {
		if (instr) {
			let list_item = document.createElement('li');
			list_item.textContent = instr;
			instructionss.appendChild(list_item);
		}
	});
}
function create_row(ingrid_name, ingrid_measure) {
	let row = document.createElement('div');
	row.classList.add('row');

	let ing_name = document.createElement('p');
	if (ingrid_name) {
		ing_name.textContent = ingrid_name;
	} else {
		ing_name.textContent = '-';
	}

	let ing_measure = document.createElement('p');
	if (ingrid_measure) {
		ing_measure.textContent = ingrid_measure;
	} else {
		ing_measure.textContent = '-';
	}

	row.append(ing_name, ing_measure);
	return row;
}
// display_meal() when app start
display_meal();
let refresh = document.getElementById('refresh');
refresh.addEventListener('click', (_) => {
	display_meal();
});
let instbtn = document.querySelector('.inst_btn');
let instrucions = document.querySelector('.instructions');
let close = document.querySelector('#close');
instbtn.addEventListener('click', (_) => {
	instrucions.classList.remove('hide');
});
close.addEventListener('click', (_) => {
	instrucions.classList.add('hide');
});
