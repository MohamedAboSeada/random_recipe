const recipe_card = document.querySelector('.recipe');
const loading = document.querySelector('.loading');

// refresh btn
const refresh = document.getElementById('refresh');

// show and hide instrusction sidemenu
const instbtn = document.querySelector('.inst_btn');
const instrucions = document.querySelector('.instructions');
const close = document.getElementById('close');

// scroll top btn
const topbtn = document.querySelector('#up');

// async function to fetch a random meal
async function get_rand_meal() {
	let res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
	let data = await res.json();
	return data.meals[0];
}

// this function used to display and update meal card
async function display_meal() {
	let meal = await get_rand_meal();

	// get the recipe card
	setting_image(meal.strMealThumb);

	// setting up info
	let info = recipe_card.querySelector('.info');
	let country = info.querySelector('.ctr');
	let category = info.querySelector('.cat');
	let name = info.querySelector('.name');
	let ingridents = info.querySelector('.ingridents');
	let youtubeVideo = info.querySelector('.inst_video');

	// update content of info elements
	country.textContent = meal.strArea;
	name.textContent = meal.strMeal;
	category.textContent = meal.strCategory;
	youtubeVideo.href = meal.strYoutube;

	populate_ingridents_table(meal, ingridents);
	populate_instructions(meal.strInstructions);
}

function setting_image(image_url) {
	const recipe_thumb = recipe_card.querySelector('.recipeThumb');
	const image_loading = new Image();
	image_loading.src = image_url;
	loading.classList.remove('hide');
	image_loading.addEventListener('load', (_) => {
		recipe_thumb.style.setProperty('background-image', `url(${image_url})`);
		loading.classList.add('hide');
	});
}

function populate_ingridents_table(meal, ingridents_table) {
	let ingridents_list = {};
	for (let i = 1; i <= 20; i++) {
		if (meal[`strIngredient${i}`] !== '' && meal[`strMeasure${i}`] !== '') {
			ingridents_list[`${meal[`strIngredient${i}`]}`] =
				meal[`strMeasure${i}`];
		}
	}

	[...ingridents_table.children].slice(1).forEach((child) => {
		child.remove();
	});

	Object.entries(ingridents_list).forEach((entry) => {
		ingridents_table.append(create_row(entry[0], entry[1]));
	});
}

// meal making instrusions side menu populate function
function populate_instructions(instructions) {
	let instructionss = document.querySelector('.inst');
	instructionss.innerHTML = ``;

	let cleaned = instructions.split('. ');

	cleaned.forEach((instr, index) => {
		if (instr) {
			let list_item = document.createElement('li');
			list_item.textContent = `${index + 1}. ${instr}`;
			instructionss.appendChild(list_item);
		}
	});
}

// ingridents table `populate function` with rows
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

// refresh button to show random meal
refresh.addEventListener('click', (_) => {
	display_meal();
});

// hide and show instrusions side menu
instbtn.addEventListener('click', (_) => {
	instrucions.classList.remove('hide');
});

close.addEventListener('click', (_) => {
	instrucions.classList.add('hide');
});

// show and hide scrolltop btn when scroll
recipe_card.addEventListener('scroll', (_) => {
	if (recipe_card.scrollTop > 200) {
		topbtn.classList.remove('hide');
	} else {
		topbtn.classList.add('hide');
	}
});

topbtn.addEventListener('click', (_) => {
	recipe_card.scrollTo({
		top: 0,
		left: 0,
		behavior: 'smooth',
	});
});

// display_meal() when app start
display_meal();
