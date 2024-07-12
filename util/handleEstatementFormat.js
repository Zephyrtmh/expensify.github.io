const availableFormats = ['UOB estatement', 'CITI Bank estatement'];

let selectEstatementFormat = document.getElementById('estatement-formats');
availableFormats.forEach((option) => {
	let optionEl = document.createElement('option');
	optionEl.textContent = option;
	optionEl.value = option;
	selectEstatementFormat.appendChild(optionEl);
});

selectEstatementFormat.addEventListener('change', (event) => {});
