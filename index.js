import reddit from './redditapi';

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

// Form event listener

searchForm.addEventListener('submit', e => {
	// Get Search term
	const searchTerm = searchInput.value;
	// Get Sort 
	const sortBy = document.querySelector('input[name="sortby"]:checked').value;	
	// Get Limit
	const searchLimit = document.getElementById('limit').value;

	// Check Input

	if (searchTerm === "") {
		// Show Message
		showMessage('Please add a search term', 'alert-danger');
	}

	// Clear up search

	searchInput.value = '';

	// Search Reddit

	reddit.search(searchTerm, searchLimit, sortBy)
	.then(results => {
		let output = '<div class="card-columns">';
		// Loop thru posts
		results.forEach(post => {
			//	Check for image
			const image = post.preview ? post.preview.images[0]
			.source.url : 'https://s3.amazonaws.com/media.eremedia.com/uploads/2014/10/15174120/reddit-logo2.png';

			output += `
				<div class="card">
				  <img class="card-img-top" src="${image}" alt="Card image cap">
				  <div class="card-body">
				    <h5 class="card-title">${post.title}</h5>
				    <p class="card-text">${truncateText(post.selftext, 100)}</p>
				    <a href="${post.url}" target="_blank" class="btn btn-primary">Read more</a>
				    <hr>
				    <span class="badge badge-light">
				    	<a href="https://www.reddit.com/r/${post.subreddit}" target="_blank">
				    		Subreddit: ${post.subreddit}
				    	</a>
				    </span>
				    <span class="badge badge-dark">Score: ${post.score}</span>
				  </div>
				</div>
			`;
		});
		output += '</div>';
		document.getElementById("results").innerHTML = output;
	});

	e.preventDefault();
});

// Show Message

function showMessage(message, className) {
	// Create div
	const div = document.createElement('div');

	// Add classes to div
	div.className = `alert ${className}`;
	// Add text
	div.appendChild(document.createTextNode(message));
	// Get the parent container
	const searchContainer = document.getElementById('search-container');
	// Get search
	const search = document.getElementById('search');

	// Insert the message

	searchContainer.insertBefore(div, search);

	// Timeout alert

	setTimeout(() => document.querySelector('.alert').remove(), 3000);
};

// Truncate text

function truncateText(text, limit) {
	const shortened = text.indexOf(' ', limit);
	if (shortened === -1) return text;
	return text.substring(0, shortened);
}