const dragArea = document.querySelector('.drag-area');
const dragText = document.querySelector('.header');

let browseButton = dragArea.querySelector('.browse-button');
let fileInput = document.getElementById('pdf-file');

browseButton.onclick = () => {
	console.log('clicked browse button');
	fileInput.click();
};

fileInput.addEventListener('change', (fileChangeEvent) => {
	console.log('file input changed');
	let files = fileChangeEvent.target.files;
	dragArea.classList.add('active');
});

// add listener for upload button click
document
	.getElementById('upload-file-container')
	.addEventListener('submit', async function (event) {
		event.preventDefault();

		const fileInput = document.getElementById('pdfFile');
		const file = fileInput.files[0];

		if (!file) {
			alert('Please select a PDF file to upload.');
			return;
		}

		const url =
			'https://uodmlozfupt7jtxc45cty5j4ka0rmngk.lambda-url.ap-southeast-1.on.aws/'; // Replace with your API Gateway endpoint URL

		// Read the file as a data URL (Base64)
		const reader = new FileReader();
		reader.onloadend = async function () {
			const base64String = reader.result.split(',')[1]; // Remove the data URL prefix
			console.log(base64String);
			try {
				const response = await fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
						'Access-Control-Allow-Origin': '*', // Allow all origins
						'Access-Control-Allow-Methods': 'POST, OPTIONS', // Allow methods
						'Access-Control-Allow-Headers': 'Content-Type', // Allow headers
					},
					body: {
						isBase64Encoded: true,
						body: base64String,
					},
				});

				if (!response.ok) {
					throw new Error('Network response was not ok ' + response.statusText);
				}

				const responseData = await response.json();
				console.log('Response from Lambda:', responseData);
			} catch (error) {
				console.error('Error uploading PDF:', error);
			}
		};

		await reader.readAsDataURL(file); // Read the file as Base64
	});
