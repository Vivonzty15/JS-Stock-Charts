async function main() {

    const timeChartCanvas = document.querySelector('#time-chart');
    const highestPriceChartCanvas = document.querySelector('#highest-price-chart');
    const averagePriceChartCanvas = document.querySelector('#average-price-chart');
   
    const response = await fetch('https://api.twelvedata.com/time_series?symbol=GME,MSFT,DIS,BNTX&interval=1min&apikey=adfc4019eead44ad93e0c6eaeb9d6502')

    let jsonObject = await response.json();
    console.log(jsonObject);

    const { GME, MSFT, DIS, BNTX } = mockData;

    const stocks = [ GME, MSFT, DIS, BNTX ];
    console.log(stocks);

    stocks.forEach( stock => stock.values.reverse());

    // Time Chart
    new Chart(timeChartCanvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: stocks[0].values.map(value => value.datetime),
            datasets: stocks.map(stock => ({
                label: stock.meta.symbol,
                data: stock.values.map(value => parseFloat(value.high)),
                backgroundColor: getColor(stock.meta.symbol),
                borderColor: getColor(stock.meta.symbol),
            }))
        }
    });

    // High Chart
    new Chart(highestPriceChartCanvas.getContext('2d'), {
        type: 'bar',
        data: { 
            labels: stocks.map(stock => stock.meta.symbol),
            datasets: [{
                label: 'Highest',
                backgroundColor: stocks.map(stock => (
                    getColor(stock.meta.symbol)
                )),
                borderColor: stocks.map(stock => (
                    getColor(stock.meta.symbol)
                )),
                data: stocks.map(stock => (
                    findHighest(stock.values)
                ))
            }]
        }
    });

    //Average Chart
    new Chart(averagePriceChartCanvas.getContext('2d'), {
        type: 'pie',
        data: {
            labels: stocks.map(stock => stock.meta.symbol),
            datasets: [{
                label: 'Average',
                backgroundColor: stocks.map(stock => (
                    getColor(stock.meta.symbol)
                )),
                borderColor: stocks.map(stock => (
                    getColor(stock.meta.symbol)
                )),
                data: stocks.map(stock => (
                    calcAverage(stock.values)
                ))
            }]
        }
    })


    function getColor(stock){
        if(stock === "GME"){
            return 'rgba(61, 161, 61, 0.7)'
        }
        if(stock === "MSFT"){
            return 'rgba(209, 4, 25, 0.7)'
        }
        if(stock === "DIS"){
            return 'rgba(18, 4, 209, 0.7)'
        }
        if(stock === "BNTX"){
            return 'rgba(166, 43, 158, 0.7)'
        }
    }

    function findHighest(values){
        values.forEach(value => {
            highest = Math.max(value.high) 
        })
        return highest
    }

    function calcAverage(values){
        let total = 0;
        values.forEach(value => {
            total += parseFloat(value.high)
        })
        return total/values.length
    }
}

main()