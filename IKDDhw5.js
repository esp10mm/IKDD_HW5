var fs = require('fs');
var csv = require('csv');

var titanic = require('./titanic.js');
var mybrain = require('./mybrain.js');

trainModal('train.csv', function(){
  testModal('test.csv', function(){

  });
});


function trainModal(trainfile, callback){
  loadCsv(trainfile, function(traindata){
    titanic.preProcess(traindata, 'trainData');
    var train = titanic.brainFormat('trainData');
    mybrain.train(train);
    callback();
  });
}

function testModal(testfile, callback){
  loadCsv(testfile,function(testdata){
    titanic.preProcess(testdata, 'testData');
    var testData = titanic.getData('testData');
    var guessData = mybrain.run(titanic.brainFormat('testData'));
    var result = []
    for(var k in testData){
      var row = {};
      var guess = 1;
      row['PassengerId'] = testData[k].PassengerId;
      if(guessData[k].Survived < 0.5)
        guess = 0;
      row['Survived'] = guess;
      result.push(row);
    }
    outputCsv(result, 'result.csv', function(){callback();})
  })
}

function outputCsv(object, fileName, callback){
  var writeData = [];
  var keys = [];

  for(var k in object[0]){
    keys.push(k);
  }
  writeData.push(keys);

  for(var i in object){
    var  row = [];
    for(var k in object[i]){
      row.push(object[i][k]);
    }
    writeData.push(row);
  }

  csv.stringify(writeData, function(err, output){
    fs.writeFile(fileName, output, function(err) {
      callback();
    })
  })
}

function loadCsv(fileName, callback){
  var data = [];
  fs.readFile(fileName, 'utf8', function (err, file){
    if (err) {
      return console.log(err);
    }
    csv.parse(file, {comment: '#'}, function(err, csvData){
      var attribute = csvData[0];

      for(var k in csvData){
        if(k == 0)
          continue;

        var row = {};
        for(var col in csvData[k])
          row[attribute[col]] = csvData[k][col];

        data.push(row);
      }

      callback(data);
    })
  })
}
