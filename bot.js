
// Dependencies =========================
var twit = require('twit');
var config = require('./config.js');

var Twitter = new twit(config);

// RETWEET BOT ==========================

// find latest tweet according the query 'q' in params
var retweet = function() {

    var subj = ranSubject();

    var params = {
        q: subj,  // REQUIRED
        //result_type: 'recent',
        lang: 'en'
    }
    Twitter.get('search/tweets', params, function(err, data) {
      // if there no errors
        if (!err ) {
          // grab ID of tweet to retweet
             console.log(data.statuses.length);
            var retweetId = data.statuses[0].id_str;

            console.log(data.statuses[0].text);

            if(langFilter(data.statuses[0]) == 0)
             {
            // Tell TWITTER to retweet
            Twitter.post('statuses/retweet/:id', {
                id: retweetId
            }, function(err, response) {
                if (response) {
                    console.log('Retweeted!!!');

                    logData(subj,data.statuses[0].text,'retweet');
                }
                // if there was an error while tweeting
                if (err) {
                    console.log('Something went wrong while RETWEETING... Duplication maybe...');
                }
            });
          }
        }
        // if unable to Search a tweet
        else {
          console.log(err);
        }
    });
}

// grab & retweet as soon as program is running...
retweet();
// retweet in every 15 minutes
setInterval(retweet, 900000);

// FAVORITE BOT====================

// find a random tweet and 'favorite' it
var favoriteTweet = function(){
    var subj = ranSubject();

  var params = {
      q: subj,  // REQUIRED
     // result_type: 'recent',
      lang: 'en'
  }
  // find the tweet
  Twitter.get('search/tweets', params, function(err,data){

    // find tweets
    var tweet = data.statuses;
    var randomTweet = ranDom(tweet);   // pick a random tweet

    // if random tweet exists
    if(typeof randomTweet != 'undefined'){
      // Tell TWITTER to 'favorite'
        console.log(randomTweet.text);
        if(langFilter(randomTweet) == 0)
             {
      Twitter.post('favorites/create', {id: randomTweet.id_str}, function(err, response){
        // if there was an error while 'favorite'
        if(err){
          console.log('CANNOT BE FAVORITE... Error');
        }
        else{
          console.log('FAVORITED... Success!!!');
          logData(subj,data.statuses[0].text,'favorited');
        }
      });
    }
    }
  });
}
// grab & 'favorite' as soon as program is running...
favoriteTweet();
// 'favorite' a tweet in every 15 minutes
setInterval(favoriteTweet, 900000);

// function to generate a random tweet tweet
function ranDom (arrr) {
  var index = Math.floor(Math.random()*arrr.length);
  return arrr[index];
};

function ranSubject(){
var subject = ['ski contest', 'analytics','liverpool', 'machine learning','AI', 'red sox', 'nodejs','angular','#AI','golang','Celtics','skiing', 'CouchDB', 'bigdata','IOT'];
var index = Math.floor(Math.random()*subject.length);
console.log(subject[index]);
return subject[index];
}


function langFilter(randomTweet)
{

var str = randomTweet.text;
var patterns = /(bitch|fag|cunt|kike|nigger|fuck|ass|pussy|dick)/g;
var result = str.match(patterns);

  if(result != null)
  {

    return result.length;

    


  } 
  else
  {
    return 0;
  }


}


function logData(randomTweet, subject, action)
{

 var couchbase = require('couchbase');
 var cluster = new couchbase.Cluster('couchbase://127.0.0.1');
 cluster.authenticate('twibot', 'twibot');
 var bucket = cluster.openBucket('twibot'); 
 var twitext = randomTweet.text;
 var key = Math.floor(Math.random()).toString();

bucket.insert(key, {sub: subject, text:twitext, act: action}, function(err, res){

     if(err){
          console.log('error inserting log');
          console.log(err);
        }
        else{
          console.log('written to logfile');
        }
});

}



