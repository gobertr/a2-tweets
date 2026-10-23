function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	let num_tweets = tweet_array.length;
	
	// NUMBER OF TWEETS
	document.getElementById('numberTweets').innerText = num_tweets;	

	// FIRST AND LAST EVENT
	let last = tweet_array[0].time.toLocaleDateString('en-US', {
		year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
	});
	let first = tweet_array[tweet_array.length-1].time.toLocaleDateString('en-US', {
		year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
	});

	document.getElementById('firstDate').innerText = first;
	document.getElementById('lastDate').innerText = last;

	//PERCENTAGE OF TWEET TYPES
	let sums = [0,0,0,0];

	for (let tweet of tweet_array) {
		sums[0] += tweet.source == 'completed_event';
		sums[1] += tweet.source == 'live_event';
		sums[2] += tweet.source == 'achievement';
		sums[3] += tweet.source == 'miscellaneous';
	}

	let percents = [0.0, 0.0, 0.0, 0.0];

	for (let i = 0; i<4; i++) {
		percents[i] = sums[i]/num_tweets;
	}
	
	document.getElementsByClassName('completedEvents')[0].innerText = sums[0];
	document.getElementsByClassName('completedEventsPct')[0].innerText = percents[0].toFixed(2) + "%";

	document.getElementsByClassName('liveEvents')[0].innerText = sums[1];
	document.getElementsByClassName('liveEventsPct')[0].innerText = percents[1].toFixed(2) + "%";

	document.getElementsByClassName('achievements')[0].innerText = sums[2];
	document.getElementsByClassName('achievementsPct')[0].innerText = percents[2].toFixed(2) + "%";

	document.getElementsByClassName('miscellaneous')[0].innerText = sums[3];
	document.getElementsByClassName('miscellaneousPct')[0].innerText = percents[3].toFixed(2) + "%";

	//PERCENTAGE OF TWEET TYPES
	let with_text = 0;

	for (let tweet of tweet_array) {
		if (tweet.written) {
			with_text ++;
		}
	}

	let text_percent = with_text/sums[0];

	document.getElementsByClassName('completedEvents')[1].innerText = sums[0];

	document.getElementsByClassName('written')[0].innerText = with_text;
	document.getElementsByClassName('writtenPct')[0].innerText = text_percent.toFixed(2) + '%';
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});