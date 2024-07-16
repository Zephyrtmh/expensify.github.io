import { formatFileSize } from './util/fileUtil.js';

const dragArea = document.querySelector('.drag-area');
const dragText = document.querySelector('.header');

let browseButton = dragArea.querySelector('.browse-button');
let fileInput = document.getElementById('pdf-file');
let estatementFormatInput = document.getElementById('estatement-formats');

browseButton.onclick = () => {
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
	let files = fileChangeEvent.target.files;
	addFileToFileInput(files);
});

// add listener for upload button click
document.getElementById('upload-button').onclick = function (event) {
	event.preventDefault();

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

		let estatementFormat = estatementFormatInput.value;
		let type = 'citibank';
		if (estatementFormat === 'UOB estatement') {
			type = 'uob';
		} else if (estatementFormat === 'CITI Bank estatement') {
			type = 'citibank';
		}

		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					file: base64String,
					type: type,
				}),
			});

			if (!response.ok) {
				throw new Error('Network response was not ok ' + response.statusText);
			} else {
				const blob = await response.blob();
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.style.display = 'none';
				a.href = url;
				a.download = 'data.csv'; // Replace with the desired file name and extension
				document.body.appendChild(a);
				a.click();
				window.URL.revokeObjectURL(url);
				document.body.removeChild(a);
			}
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
				let dataTransfer = new DataTransfer();
				let parent = event.target.parentNode;
				event.target.parentNode.remove(); // remove from dom
				let fileArray = Array.from(fileInput.files);

				fileArray.forEach((file) => {
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
	}
};
