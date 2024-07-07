export function formatFileSize(bytes) {
	const kilobyte = 1024;
	const megabyte = kilobyte * 1024;

	if (bytes >= megabyte) {
		return (bytes / megabyte).toFixed(2) + ' MB';
	} else if (bytes >= kilobyte) {
		return (bytes / kilobyte).toFixed(2) + ' KB';
	} else {
		return bytes + ' B';
	}
}
