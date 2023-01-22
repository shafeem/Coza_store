/**
 * For usage, visit Chart.js docs https://www.chartjs.org/docs/latest/
 */
async function main(val){
  const response = await axios.get(`/admin/chartdetails?value=${val}`);
  if (response.data.status) {

    const groupedOrderData = response.data.sales;
    console.log(groupedOrderData);
    //  const orderData=response.data.PreviosSale
    //  console.log(orderData);


    let labelData
      if(val==30){
         labelData= ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5']
      }
    if(val==365){
     labelData=['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
  if (val==7) {
     labelData=  ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7']
  }
   const barConfig = {
   type: 'bar',
   data: {
  
    labels:labelData ,
    datasets: [
      {
        label: 'current',
        backgroundColor: '#0694a2',
        // borderColor: window.chartColors.red,
        borderWidth: 1,
        data:groupedOrderData,
      },
      // {
      //   label: 'prevouse',
      //   backgroundColor: '#7e3af2',
      //   // borderColor: window.chartColors.blue,
      //   borderWidth: 1,
      //   data: orderData,
      // },
    ],
  },
  options: {
    responsive: true,
    legend: {
      display: false,
    },
  },
}

const barsCtx = document.getElementById('bars')
window.myBar = new Chart(barsCtx, barConfig)



}

}

$(document).ready(async () => {
 main(7)
});

// window.addEventListener('load', function () {
// 	GetChartDetails(7)
// });


const ChartChange = () => {
  let val = document.getElementById('salesChange').value
  document.getElementById('mainBar').innerHTML = ' <canvas id="bars"></canvas>'
  main(val)
    
	// document.getElementById('bars').innerHTML = `<canvas id="bars"></canvas>`
	// // document.getElementById('canvasId').innerHTML = `<canvas id="canvas-barchart"></canvas>`
	// GetChartDetails(val)
}