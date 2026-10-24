let all_tweets = new Array();

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	for (let tweet of tweet_array) {
		if (tweet.written) all_tweets.push(tweet);
	}
	
	//TODO: Filter to just the written tweets	
}

function refreshTable(search_word) {

	console.log(all_tweets[0].getHTMLTableRow(1));

	if (!search_word || search_word == "") return;


	let rownum = 0;
	let rows = "";
	console.log("refresh" + search_word);

	for (let tweet of all_tweets) {
		
		if (tweet.written) {
			if (tweet.writtenText.includes(search_word)) {
				rownum++;
				rows += tweet.getHTMLTableRow(rownum);
			}
		}
	}

	document.getElementById("searchCount").innerHTML = rownum

	document.getElementById("tweetTable").innerHTML = rows;
}

function addEventHandlerForSearch() {
	document.getElementById("searchText").innerText = "";
	document.getElementById("searchCount").innerText = 0;

	document.getElementById("textFilter").addEventListener("input", function() {
		input = document.getElementById("textFilter").value;
		document.getElementById("searchText").innerText = input;

		refreshTable(input);
	});

	
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table

}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});