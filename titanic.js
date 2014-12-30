var data = [];

var uselessCol = [
  'PassengerId',
  'Ticket',
  'Cabin',
  'Name',
  // 'Pclass',
  // 'SibSp',
  // 'Parch',
  'Fare',
  'Embarked'
]


function preProcess(inData, dataName){

  handleSex(inData);
  // handleFamily(inData);
  handleAge(inData);
  // handlePclass(inData);

  data[dataName] = inData;
}
exports.preProcess = preProcess;

var maleAge = 0;
var femaleAge = 0;
function handleSex(rows){
  var maleCount = 0;
  var femaleCount = 0;

  for(var k in rows){
    var row = rows[k];
    if(row.Sex == 'male'){
      row.Sex = 1;
    }
    else{
      row.Sex = 0;
    }

    if(row.Sex == 1){
      maleCount += 1;
      if(row.Age != '')
        maleAge += parseFloat(row.Age);
    }
    else{
      femaleCount += 1;
      if(row.Age != '')
        femaleAge += parseFloat(row.Age);
    }
  }
  maleAge = maleAge / maleCount;
  femaleAge = femaleAge / femaleCount;
}

var familyList = [];
function handleFamily(rows){
  for(var k in rows){
    var row = rows[k];
    if(row.SibSp != '0' || row.Parch != '0'){
      row.withFam = 1;
      var name = row['Name'].split(',');
      name = name[0];
      if(familyList[name] == undefined)
        familyList[name] = [];
      familyList[name].push(row);
    }
    else
      row.withFam = 0;
  }
}

function handleAge(rows){
  for(var k in rows){
    var row = rows[k];
    if(row.Age == ''){
      if(row.Sex == '1')
        row.Age = maleAge;
      else
        row.Age = femaleAge;
    }
    row.Age = row.Age/100;
  }
}

function removeUseless(rows){
  for(var k in rows){
    var row = rows[k];
    for(var k in row){
      if(uselessCol.indexOf(k) != -1)
        delete row[k];
    }
  }
}

function handlePclass(rows){
  for(var k in rows){
    var row = rows[k];
    row.Pclass = row.Pclass/10;
  }
}

function getData(dataName){
  return data[dataName];
}
exports.getData = getData;

function brainFormat(dataName){
  var copy = copyObj(data[dataName]);
  removeUseless(copy);
  var brainformat = [];

  for(var k in copy){
    var d = copy[k];
    var input = {};
    var output = {};
    var row = {};
    var trainFlag = false;

    for(var attr in d){
      if(attr == 'Survived'){
        trainFlag = true;
        output[attr] = d[attr];
      }
      else
        input[attr] = d[attr];
    }

    if(trainFlag){
      row['input'] = input;
      row['output'] = output;
      brainformat.push(row);
    }
    else
      brainformat.push(d);
  }

  return brainformat;
}
exports.brainFormat = brainFormat;

function copyObj(obj){
  var copy = JSON.parse( JSON.stringify( obj ) );
  return copy;
}
