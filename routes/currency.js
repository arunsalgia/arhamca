var router = express.Router();

async function fetchCurrency(baseCurreny, currencyList) {
	console.log("Fetch Currency");
	var myHeaders = new fetch.Headers();
	myHeaders.append("apikey", CURRENCY_API_KEY);

	var requestOptions = {
		method: 'GET',
		redirect: 'follow',
		headers: myHeaders
	};

/*
fetch("https://api.apilayer.com/currency_data/list", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
	
*/

  defData = {};
	try {
		let myUrl = `https://api.apilayer.com/currency_data/live?source=${baseCurreny}&currencies=${currencyList}`;
		tmp = await fetch(myUrl, requestOptions);
		var tmp1 = await tmp.json();
    console.log(tmp1);
		return ((tmp1.success) ? tmp1.quotes : defData);
	}
	catch (e) {
		console.log(e);
		return (defData);
	}
}
	
router.use('/', function(req, res, next) {
  setHeader(res);
	 if (!db_connection) { senderr(res, DBERROR, ERR_NODB); return; }
  next('route');
});

	

router.get('/getall', async function (req, res) {

	let myTime = Math.trunc(Number(new Date()) / 1000); 	// Time in seconds
	// get all available currency
	let allCurrency = await Currency.find({});
	if (allCurrency.length === 0) return senderr(res, 601, "No Currency found");
 
	// get last read time. name is: LASTREADTIME
  var myRec = _.filter(allCurrency, x => x.name === LastReadName);
	if ((myTime - myRec[0].rate) > READEXCHANGERATETIME) {
    console.log("fetching rate");
		let currencyName = _.map(allCurrency, 'name');
		let currData = await fetchCurrency(BASECURRENCY, _.join(currencyName));
		let currList = Object.keys(currData);	
		for(var i = 0; i<currList.length; ++i) currList[i] = currList[i].substring(3);
	  //console.log(currList);
    
		// now compute currency rate
		for(var i=0; i<allCurrency.length; ++i) {
			if (currList.includes(allCurrency[i].name)) {
				allCurrency[i].rate = 1 / currData[BASECURRENCY.concat(allCurrency[i].name)] * EXCHANGERATEPERCENTAGE;
			}
			else 
				allCurrency[i].enable = false; // not found
			if  (allCurrency[i].name === LastReadName) allCurrency[i].rate = myTime;
			
			await allCurrency[i].save()
		}
		allCurrency = _.filter(allCurrency, x => x.enable === true);
	}
	// filter out invalid curreny
	allCurrency = _.filter(allCurrency, x => x.enable);
	allCurrency.push(new Currency({name: BASECURRENCY, country: BASECOUNTRY, enable: true, rate: 1}))
  //console.log(allCurrency);
	sendok(res, allCurrency);
});



function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
}




module.exports = router;
