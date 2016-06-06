function createGraph(tenure, median1, median50, median99,type,cashflow) {
  median1.unshift(cashflow[0]);
  median50.unshift(cashflow[0]);
  median99.unshift(cashflow[0]);
  console.log("data here");
  console.log(median1);
  console.log(median50);
  console.log(median99);
  console.log(cashflow);
  median1 = _.map(median1,function(key){
    if(key<0)
    {
      return 0;
    }
    else {
      return key;
    }
  });
  median50 = _.map(median50,function(key){
    if(key<0)
    {
      return 0;
    }
    else {
      return key;
    }
  });
  median99 = _.map(median99,function(key){
    if(key<0)
    {
      return 0;
    }
    else {
      return key;
    }
  });
  console.log(median1);
    $('#container').highcharts({
        credits: {
            enabled: false
        },
        title: {
            text: 'Type '+type,
            x: -20 //center
        },
        subtitle: {
            text: 'Equity: '+type*10+'%, Debt: '+(100-type*10)+'%',
            x: -20
        },
        xAxis: {
            title: {
                text: 'Tenure month'
            },
            categories: tenure
        },
        yAxis: {
            title: {
                text: 'Amount'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valuePrefix: 'Rs.'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: 'Median 1',
            data: median1
        }, {
            name: 'Median 50',
            data: median50
        }, {
            name: 'Median 99',
            data: median99
        },{
          type:'column',
          name:'Cashflow',
          data:cashflow
        }]
    });
}
