import { formatFileSize } from './util/fileUtil.js';

const dragArea = document.querySelector('.drag-area');
const dragText = document.querySelector('.header');

let browseButton = dragArea.querySelector('.browse-button');
let fileInput = document.getElementById('pdf-file');

browseButton.onclick = () => {
	console.log('clicked browse button');
	fileInput.click();
};

dragArea.addEventListener('dragover', (event) => {
	event.preventDefault();
	dragArea.classList.add('active');
});

dragArea.addEventListener('dragleave', (event) => {
	event.preventDefault();
	dragArea.classList.remove('active');
});

dragArea.addEventListener('drop', (event) => {
	event.preventDefault();
	dragArea.classList.remove('active');
	let filesDraggedIn = event.dataTransfer.files;
	fileInput.files = filesDraggedIn;
	addFileToFileInput(filesDraggedIn);
});

fileInput.addEventListener('change', (fileChangeEvent) => {
	console.log('file input changed');
	let files = fileChangeEvent.target.files;
	addFileToFileInput(files);
});

// add listener for upload button click
console.log(document.getElementById('upload-button'));
document.getElementById('upload-button').onclick = function (event) {
	event.preventDefault();
	console.log('submit button clicked');

	const fileInput = document.getElementById('pdf-file');
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

	reader.readAsDataURL(file); // Read the file as Base64
};

const addFileToFileInput = (files) => {
	if (files) {
		let attachedDocs = document.getElementById('files-attached-container');
		attachedDocs.style.display = 'flex';

		for (let i = 0; i < files.length; i++) {
			// add files[i] details
			let fileItem = document.createElement('div');
			fileItem.classList.add('attached-file-details');
			let fileName = document.createElement('p');
			fileName.textContent = files[i]['name'];
			let fileSize = document.createElement('p');
			fileSize.textContent = formatFileSize(files[i]['size']);
			fileItem.appendChild(fileName);
			fileItem.appendChild(fileSize);

			// add remove files[i] icon to remove attached files[i]
			let removeFileIcon = document.createElement('img');
			removeFileIcon.src = './images/remove_red.png';

			// add onclick function for remove file icon
			removeFileIcon.onclick = (event) => {
				console.log('this was ran');
				let dataTransfer = new DataTransfer();
				let parent = event.target.parentNode;
				console.log(event.target.parentNode);
				event.target.parentNode.remove(); // remove from dom
				console.log(fileInput.files);
				let fileArray = Array.from(fileInput.files);

				fileArray.forEach((file) => {
					console.log(parent.firstChild.textContent);
					if (file.name !== parent.firstChild.textContent) {
						dataTransfer.items.add(file);
					}
				});
				fileInput.files = dataTransfer.files;
				if (fileInput.files.length === 0) {
					attachedDocs.style.display = 'none';
				}
			};
			fileItem.appendChild(removeFileIcon);
			attachedDocs.appendChild(fileItem);
		}
		console.log(attachedDocs);
	}
};
