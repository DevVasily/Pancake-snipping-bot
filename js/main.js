const web3 = new Web3('https://bsc-dataseed.binance.org/');
var address = '0xca143ce32fe78f1f7019d7d551a6402fc5350c73';
var factoryContract = new web3.eth.Contract(abi, address);

var tokenToBuy = '';

//new liquidity but not live yet
var newLiquidities = [];

//initial pairs length
var pairs = 0;
//index for go back
var backIndex = 0;
//check interval
var interval = 1000;
//array of status text line
var statusText = [];
var maxStatusLine = 100;
//to log erros
var toLog = true;
//variable for found
var found = false;

function getBalance() {
    /*
    //get balance of eth
    var web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/5db0a2fb8a8948fdbe57bb19eecb5674'));
    
    web3.eth.getBalance($("input[name=wallet_address]").val()).then((res)=>alert(web3.utils.fromWei(res,'ether')));
    
    //get balance of bsc
    const web3 = new Web3('https://bsc-dataseed.binance.org/');
    web3.eth.getBalance("0xE0F3fb7Dd6b4238362f197aF8C9A71700538764E").then((res)=>alert(web3.utils.fromWei(res,'ether')));*/
}
function start() {
    tokenToBuy = $("input[name=new_token_contract]").val().toLowerCase();
    found = false;
    check();
}
function check() {
    if (found)
        return;
    try {
        //get the liquidity length and compare with previous length
        factoryContract.methods.allPairsLength().call().then((length) => {
            setStatusText("Current pairs length :" + length, null, null);
            if (pairs == 0) {
                //if first check the length after interval(ms)
                pairs = length;
                backIndex = length;
                setTimeout(function () {
                    check();
                }, interval);
            }
            else if (length > pairs) {
                //if new liquidiies are, check them if they are ones which i want
                checkNewLiquidityRange(pairs, length).then((res) => {
                    pairs = length;
                    if (res !== true) {
                        check();
                    }
                });
                newLiquidities.forEach((idx) => {
                    checkNewLiquidity(idx);
                });
            }
            else {
                //check the length after interval(ms)
                pairs = length;
                setTimeout(function () {
                    check();
                }, interval);
            }
            checkNewLiquidity(backIndex--);
        }).catch((err) => {
            //if an error occurs try again
            if (toLog) {
                console.log('catched .catch:');
                console.log(err);
            }
            check();
        });
    } catch (error) {
        //if an error occurs try again
        if (toLog) {
            console.log(error);
        }
        check();
    }
}

async function checkNewLiquidityRange(from, to) {
    var isNewLiquidity = false;
    for (var i = from; i < to; i++) {
        try {
            //check if i-th liquidity is the one which i want
            isNewLiquidity = await checkNewLiquidity(i);
            //if true break from the loop
            if (isNewLiquidity === true) {
                break;
            }
        } catch (error) {
            //if an error occurs try again with i
            if (toLog) {
                console.log("error: " + i);
                console.log(error);
            }
            i--;
        }
    }
    return isNewLiquidity;
}

async function checkNewLiquidity(index) {
    if (tokenToBuy == "")
        return false;
    addStatusText("current check index: " + index);
    //get the pair the contract address and get token0's address, token1's address
    var pairAddress = await factoryContract.methods.allPairs(index).call();
    var pairContract = new web3.eth.Contract(abi2, pairAddress);
    var token0 = await pairContract.methods.token0().call();
    var token1 = await pairContract.methods.token1().call();

    //if token0 or token1 is the one that i want
    if (token0.toLowerCase() == tokenToBuy || token1.toLowerCase() == tokenToBuy) {
    //if ((token0.toLowerCase() == '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c' && token1.toLowerCase() == '0xe9e7cea3dedca5984780bafc599bd69add087d56') || (token1.toLowerCase() == '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c' && token0.toLowerCase() == '0xe9e7cea3dedca5984780bafc599bd69add087d56')) {
        var token0Contract = new web3.eth.Contract(erc20, token0);
        var token1Contract = new web3.eth.Contract(erc20, token1);

        var token0Balance = await token0Contract.methods.totalSupply().call();
        var token1Balance = await token1Contract.methods.totalSupply().call();
        if (token0Balance == 0 || token1Balance == 0) {
            if (newLiquidities.findIndex(findValue, index) < 0)
                newLiquidities.push(index);
            return false;
        }

        setStatusText("New liquidity index: " + index, "black", "bold");

        setStatusText("New liquidity contract: " + pairAddress, "red", "bold");
        var liquidityName = await pairContract.methods.name().call();
        setStatusText("New liquidity name: " + liquidityName, "red", "bold");

        //get token0's name, symbol
        setStatusText("Token 0 Address: " + token0, "blue", "bold");
        var token0Name = await token0Contract.methods.name().call();
        setStatusText("Token 0 Name: " + token0Name, "green", "bold");
        var token0Symbol = await token0Contract.methods.symbol().call();
        setStatusText("Token 0 Symbol: " + token0Symbol, "pink", "bold");

        //get token1's name, symbol
        setStatusText("Token 1 Address: " + token1, "blue", "bold");
        var token1Name = await token1Contract.methods.name().call();
        setStatusText("Token 1 Name: " + token1Name, "green", "bold");
        var token1Symbol = await token1Contract.methods.symbol().call();
        setStatusText("Token 1 Symbol: " + token1Symbol, "pink", "bold");

        found = true;
        return true;
    }
    return false;
}


//add status text function
function setStatusText(newText, color, style) {
    var className = "";
    if (color != null) {
        className += " text-" + color + "-500";
    }
    if (style != null) {
        className += " font-" + style;
    }
    addStatusText('<span class="' + className + '">' + newText + '</span>');
    var now = new Date();
    //addStatusText('<span>'+now.toLocaleString()+'</span>');
    addStatusText('<span>' + now.toUTCString() + '</span>');
    var statusPan = $("div[name=status]");
    statusPan.html(statusText.join("<br>"));
    statusPan.scrollTop(statusPan[0].scrollHeight);
}

function addStatusText(newText) {
    //if lines of statusText is over, pop the first element from the array of lines
    if (statusText.length >= maxStatusLine) {
        statusText.shift();
    }
    statusText.push(newText);
}
//test function

async function test() {
    tokenToBuy = $("input[name=new_token_contract]").val().toLowerCase();

    var from = prompt("input from");
    var to = prompt("input to");
    var isNewLiquidity = false;
    for (var i = parseInt(from); i < parseInt(to); i++) {
        try {
            setStatusText("current index: " + i, null, null);
            //check if i-th liquidity is the one which i want
            isNewLiquidity = await checkNewLiquidity(i);
            //if true break from the loop
            if (isNewLiquidity === true) {
                break;
            }
        } catch (error) {
            //if an error occurs try again with i
            if (toLog) {
                console.log("error: " + i);
                console.log(error);
            }
            i--;
        }
    }
}
//find a specified value in array
function findValue(val) {
    return val == this;
}