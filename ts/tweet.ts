class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {

        if (
            this.text.includes('completed') ||
            this.text.includes('Just posted')
        )
        { return 'completed_event'; }
        else if (
            this.text.includes('Live') ||
            this.text.includes('right now')
        ) 
        { return 'live_event'; }
        else if (
            this.text.includes('PB') ||
            this.text.includes('personal record') ||
            this.text.includes('Achieved')
        )
        { return 'achievement'; }
        
        else return 'miscellaneous'

    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        if (
            this.text.includes("@Runkeeper. Check it out! https:")
        )
        {
            return false;
        }

        return true;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        
        if (this.text.includes(' - ') && this.text.includes('https:')) 
        return this.text.substring(this.text.indexOf(' - ') + 3, this.text.indexOf('https:'));

        return "";
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }

        let ret =  "unknown";

        // if (
        //     this.text.includes('run')
        // ) 
        // { return 'run'; }
        // else if (
        //     this.text.includes('walk')
        // )
        // { return 'walk'; }
        // else if (
        //     this.text.includes('bike')
        // )
        // { return 'bike'; }
        // else if (
        //     this.text.includes('hike')
        // )
        // { return 'hike'; }
        // else 
        // 
        
        if (
            this.text.includes('mi ') && this.text.includes(' with @Runkeeper')
        )
        {
            ret = this.text.substring(this.text.indexOf('mi ') + 3, this.text.indexOf(' with @Runkeeper'));
        }
        else if (
            this.text.includes(' km ') && this.text.includes(' with @Runkeeper')
        )
        {
            ret = this.text.substring(this.text.indexOf(' km ') + 4, this.text.indexOf(' with @Runkeeper'));
        }

        else if (
            this.text.includes(' mi ') && this.text.includes(' - ')
        )
        {
            ret = this.text.substring(this.text.indexOf(' mi ') + 4, this.text.indexOf(' - '));
        }
        else if (
            this.text.includes(' km ') && this.text.includes(' - ')
        )
        {
            ret = this.text.substring(this.text.indexOf(' km ') + 4, this.text.indexOf(' - '));
        }

        else if (
            this.text.includes(' posted') && this.text.includes(' - ')
        )
        {
            ret = this.text.substring(this.text.indexOf(' posted') + 7, this.text.indexOf(' - '));
        }
        else if (
            this.text.includes(' completed') && this.text.includes(' - ')
        )
        {
            ret = this.text.substring(this.text.indexOf(' completed') + 10, this.text.indexOf(' - '));
        }

        if (ret.includes(' in ')) ret = ret.substring(0, ret.indexOf(' in '));

        if (ret.includes('a ')) ret = ret.substring(ret.indexOf('a ') + 2);
        if (ret.includes('an ')) ret = ret.substring(ret.indexOf('an ') + 3);

        
        return ret;
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }

        if (
            this.text.includes(' a ') && this.text.includes(' mi ')
        )
        {
            let miles = this.text.substring(this.text.indexOf(' a ') + 3, this.text.indexOf(' mi '));
            return parseFloat(miles);
        }
        else if (
            this.text.includes(' a ') && this.text.includes(' km ')
        )
        {
            let km = this.text.substring(this.text.indexOf(' a ') + 3, this.text.indexOf(' km '));
            return parseFloat(km) / 1.609;
        }
        console.log('miles not found' + this.text);

        return 0;
    } 

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity

        let linked_text = this.writtenText;
        if (linked_text.includes("https:/") && linked_text.includes(" #Runkeeper")) {
            let link_start = linked_text.indexOf('https:/');
            let link_end = linked_text.indexOf(' #Runkeeper');
            
            let link = linked_text.substring(link_start, link_end);
            linked_text = linked_text.substring(0, link_start) + '<a href = "' + 
                          link + '">' + link + "</a>" + linked_text.substring(link_end);
        }
        return "<tr>" + 
            "<th scope='col'>" + rowNumber +"</th>" + 
            "<th scope='col'>" + this.activityType +"</th>" + 
            "<th scope='col'>" + linked_text + 
            
            // TEMP
            // "<br>original: <br>" + this.text +
            // "<br>completed: <br>" + this.source +

            "</th>" + 
            "</tr>";
    }
}