// var jsonDamages = [{ 
//   "hats": [
//     {
//       "description": "hat",
//       "quantity": 2,
//       "unit": null,
//       "total_cost": 12.0,
//       "overcharge?": true,
//       "claim_id": 1
//     },
//     {
//       "description": "hat",
//       "quantity": 1,
//       "unit": null,
//       "total_cost": 2.0,
//       "overcharge?": false,
//       "claim_id": 2
//     }],
//   "beds": [
//     {
//       "description": "bed",
//       "quantity": 2,
//       "unit": null,
//       "total_cost": 12.0,
//       "overcharge?": false,
//       "claim_id": 1
//     }
//     ]}];

// var damage_types = Object.keys(jsonDamages[0]);

// var columnWidth = 20
//     columnHeight = 100;

// var chart = d3.select(".hat_graph").
//             append("svg").
//             attr("width", columnWidth * damage_types.length)
//             .attr("height", columnHeight);

// d3.json("localhost:3000/assets/damages.json", type, function(error, data){

//   alert(data);

//   // var bubble = chart.selectAll("g")
//   //               .data(data)
//   //             .enter().append("g")
//   //               .attr("transform", function(d, i){
//   //                 return "translate("+i*columnWidth+",0)";
//   //               });



// });

// function type(d){
//   return d;
// }








