const availableFormats = ['UOB estatement', 'CITI Bank estatement'];

console.log('populate select ran');
let selectEstatementFormat = document.getElementById('estatement-formats');
availableFormats.forEach((option) => {
	let optionEl = document.createElement('option');
	optionEl.textContent = option;
	optionEl.value = option;
	selectEstatementFormat.appendChild(optionEl);
});

selectEstatementFormat.addEventListener('change', (event) => {
	console.log(event.target.value);
});
