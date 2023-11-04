const CricAPI_Key="83aafe89-a992-4d98-81f0-48c364cccba4";

const CricAPI_BasePrefix="https://api.cricapi.com/v1/";
const CricApl_BaseKey = "?apikey=" + CricAPI_Key
//const CricAPI_Prefix="https://api.cricapi.com/v1/series?apikey=";

const CricAPI_Prefix=CricAPI_BasePrefix + "series" + CricApl_BaseKey;      //"https://api.cricapi.com/v1/series?apikey=";
const CricAPI_PostFix_NewTournament="&offset=0";

//const CricAPI_Prefix_NewMatches="https://api.cricapi.com/v1/series_info?apikey=";

const CricAPI_Prefix_NewMatches = CricAPI_BasePrefix + "series_info" + CricApl_BaseKey;
const CricAPI_PostFix_NewMatches="&id=";

const CricAPI_Prefix_MatchesScore = CricAPI_BasePrefix + "match_scorecard" + CricApl_BaseKey;
const CricAPI_PostFix_MatchesScore="&id=";


const CricAPI_Prefix_Squad = CricAPI_BasePrefix + "series_squad" + CricApl_BaseKey;
const CricAPI_PostFix_Squad="&id=";


// https://api.cricapi.com/v1/series?apikey=ef8990f6-8506-41e7-8b3a-55726f58759a&offset=0



async function cricapi_get_new_tournaments() {
  var myDataArray = [];
  await fetch(CricAPI_Prefix + CricAPI_PostFix_NewTournament)
    .then(data => data.json())
    .then(data => {
        //console.log("Enteretd");
        if (data.status === "success") {
          //console.log(data);
          if (data.data) {
            myDataArray = data.data;
            //console.log("Got the data");
          } 
          else {
            console.log("Errrrrrrrrrrrrrrrrrrrrrrrrrrr");
          }
        } 
        else {
          console.log("Error fetching new tournaments");
        }
    })
    .catch(e => console.log);
  //console.log("Here==============");
  return myDataArray;
}


async function cricapi_get_new_matches(tournamentSeriesId) {
  var myDataArray = [];
  let myURL = CricAPI_Prefix_NewMatches + CricAPI_PostFix_NewMatches + tournamentSeriesId;
  console.log(myURL);
  await fetch(myURL)
    .then(data => data.json())
    .then(data => {
        if (data.status === "success") {
          if (data.data) {
            myDataArray = data.data.matchList;
          } 
          else {
            console.log("Errrrrrrrrrrrrrrrrrrrrrrrrrrr");
          }
        } 
        else {
          console.log("Error fetching new matches");
        }
    })
    .catch(e => console.log);
  //console.log("Here==============");
  return myDataArray;
}

// https://api.cricapi.com/v1/match_info?apikey=ef8990f6-8506-41e7-8b3a-55726f58759a&id=28004108-5cdd-43f7-82f3-f530bf8b2ce9


async function cricapi_get_score(matchId) {
  var myDataArray = [];
  let myURL = CricAPI_Prefix_MatchesScore + CricAPI_PostFix_NewMatches + matchId;
  console.log(myURL);
  await fetch(myURL)
    .then(data => data.json())
    .then(data => {
        if (data.status === "success") {
          console.log("success");
          if (data.data) {
            myDataArray = data.data;
          } 
          else {
            console.log("Errrrrrrrrrrrrrrrrrrrrrrrrrrr");
          }
        } 
        else {
          console.log("Error fetching new matches");
        }
    })
    .catch(e => console.log);
  //console.log("Here==============");
  return myDataArray;
}


async function cricapi_get_tournament_squad(tournamentSeriesId) {
  var myDataArray = [];
  let myURL = CricAPI_Prefix_Squad + CricAPI_PostFix_Squad + tournamentSeriesId;
  console.log(myURL);
  await fetch(myURL)
    .then(data => data.json())
    .then(data => {
        if (data.status === "success") {
          console.log("success");
          console.log(data);
          if (data.data) {
            myDataArray = data.data;
          } 
          else {
            console.log("Errrrrrrrrrrrrrrrrrrrrrrrrrrr");
          }
        } 
        else {
          console.log("Error fetching new matches");
        }
    })
    .catch(e => console.log);
  //console.log("Here==============");
  return myDataArray;
}


module.exports = {
  cricapi_get_new_tournaments,
  cricapi_get_new_matches,
  cricapi_get_score,
  cricapi_get_tournament_squad,
}; 
