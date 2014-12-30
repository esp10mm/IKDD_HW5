var fs = require('fs');
var brain = require('brain');
var net = new brain.NeuralNetwork();
var jsonNet = null;

var options = {
  errorThresh: 0.005,  // error threshold to reach
  iterations: 20000,   // maximum training iterations
  log: true,           // console.log() progress periodically
  logPeriod: 10,       // number of iterations between logging
  learningRate: 0.3    // learning rate
};

function train(trainData){
  net.train(trainData, options);
  jsonNet = net.toJSON();
}
exports.train = train;

function run(rundata){
  var result = [];
  for(var k in rundata){
    result.push(net.run(rundata[k]));
  }
  return result;
}
exports.run = run;

function saveNet(){
  var j = JSON.stringify(jsonNet);
  fs.writeFile('net.json', j, function(err) {});
}
exports.saveNet = saveNet;

function loadNet(callback){
  fs.readFile('net.json', 'utf8', function (err, netData){
    jsonNet = JSON.parse(netData);
    net.fromJSON(jsonNet);
    callback();
  })
}
exports.loadNet = loadNet;
