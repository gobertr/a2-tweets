function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	class Activity {
		constructor(name, count, distance, day) {
			this.name = name;
			this.count = count;
			this.distance = distance;
			this.day = day;
			this.avg = 0;
		}

		calc_avg() {
			this.avg = this.distance / this.count;
		}
	}

	class WeekDay {
		constructor(count, distance) {
			this.count = count;
			this.distance = distance;
			this.avg = 0;
		}

		calc_avg() {
			this.avg = this.distance / this.count;
		}
	}

	class DataPoint {
		constructor(name, distance, day) {
			this.name = name;
			this.distance = distance;
			this.day = day;
		}
	}

	let activity_map = new Map();
	let weekdays = [
		new WeekDay(0, 0), 
		new WeekDay(0, 0), 
		new WeekDay(0, 0), 
		new WeekDay(0, 0), 
		new WeekDay(0, 0), 
		new WeekDay(0, 0), 
		new WeekDay(0, 0)
	];

	for (let tweet of tweet_array) {

		let activity_name = tweet.activityType;
		let distance = tweet.distance;
		let day = tweet.time.getUTCDay();

		if (!activity_name || activity_name == 'unknown') continue;

		if (!activity_map.has(activity_name)) {
			activity_map.set(activity_name, new Activity(activity_name, 1, distance, day))
		}
		else {
			activity_map.get(activity_name).count++;
			activity_map.get(activity_name).distance += distance;
		}

		weekdays[day].count++;
		weekdays[day].distance += distance;

	}

	// NUMBER OF ACTIVITIES
	document.getElementById('numberActivities').innerText = activity_map.size;

	// TOP 3 ACTIVITIES
	let sorted_counts = Array.from(activity_map.values()).sort((a, b) => b.count - a.count).slice(0,3);

	document.getElementById('firstMost').innerText = sorted_counts[0].name;
	document.getElementById('secondMost').innerText = sorted_counts[1].name;
	document.getElementById('thirdMost').innerText = sorted_counts[2].name;

	// LONGEST OF TOP 3
	let longest = sorted_counts[0];
	let shortest = sorted_counts[0];

	for (let activity of sorted_counts) {

		activity.calc_avg();

		if (activity.avg > longest.avg) {
			longest = activity;
		}
		if (activity.avg < shortest.avg) {
			shortest = activity;
		}
	}

	document.getElementById("longestActivityType").innerText = longest.name;
	document.getElementById("shortestActivityType").innerText = shortest.name;

	//DAYS OF THE WEEK
	let weekend_avg = 0;
	let weekday_avg = 0;

	for (let day = 0; day < 7; day++) {
		weekdays[day].calc_avg();

		if ([0, 6].includes(day)) {
			weekend_avg += weekdays[day].avg; 
			continue;
		}
		weekday_avg += weekdays[day].avg;
	}

	weekend_avg /= 2;
	weekday_avg /= 5;

	document.getElementById("weekdayOrWeekendLonger").innerText = weekend_avg > weekday_avg ? "weekends" : "weekdays";

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	let tweet_data = new Array();

	let day_names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

	//TOP 3 DATA POINT COLLECTION
	for (let tweet of tweet_array) {
		if ([sorted_counts[0].name, sorted_counts[1].name, sorted_counts[2].name].includes(tweet.activityType)) {
			tweet_data.push(new DataPoint(tweet.activityType, tweet.distance, day_names[tweet.time.getUTCDay()]));
		}
	}

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": Array.from(activity_map.values())
	  },
	  "mark": { "type": "bar", "filled": true },
	  "encoding": {
		"x": {"field": "name", "type": "nominal", "sort": "-y"},
		"y": {"field": "count", "type": "quantitative"},
	  }
	};

	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.

	distance_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of which activities people did on which days and how long they did them for.",
	  "data": {
	    "values": tweet_data
	  },
	  "mark": { "type": "point", "filled": true },
	  "encoding": {
		"x": {"field": "day", "type": "ordinal", "sort": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]},
		"y": {"field": "distance", "type": "quantitative"},
		"color": {"field": "name", "type": "nominal"}
	  }
	};

	distance_vis_aggr_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of which activities people did on which days and how long they did them for on average.",
	  "data": {
	    "values": tweet_data
	  },
	  "mark": { "type": "point", "filled": true },
	  "encoding": {
		"x": {"field": "day", "type": "ordinal", 
			"sort": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]},
		"y": {"field": "distance", "type": "quantitative", "aggregate": "mean"},
		"color": {"field": "name", "type": "nominal"}
	  }
	};

	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});
	vegaEmbed('#distanceVisAggregated', distance_vis_aggr_spec, {actions:false});

	// Hide Aggregated Graph
	document.getElementById("distanceVis").style.display = "block";
	document.getElementById("distanceVisAggregated").style.display = "none";

	let showing_all = false;

	document.getElementById("aggregate").addEventListener("click", function() {

		let all = document.getElementById("distanceVis")
		let aggr = document.getElementById("distanceVisAggregated");
		
		showing_all = !showing_all;

		if (showing_all) {
			document.getElementById("aggregate").innerText = "Show all activities";
			all.style.display = "none";
			aggr.style.display = "block";
			return;
		}
		else {
		document.getElementById("aggregate").innerText = "Show means";
			all.style.display = "block";
			aggr.style.display = "none";
		}
	})
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});