let selectedRows = [];
let correctSelections = 0;
let incorrectSelections = 0;
let missedSelections = 0;
let matchingCount = 0;

document.getElementById('startTask').addEventListener('click', function () {
  const participantNumber = document.getElementById('participantNumber').value;
  const deviceType = document.getElementById('deviceType').value;
  const taskNumber = document.getElementById('taskNumber').value;

  sessionStorage.setItem('participantNumber', participantNumber);
  sessionStorage.setItem('deviceType', deviceType);
  sessionStorage.setItem('taskNumber', taskNumber);

  document.getElementById('inputArea').style.display = 'none';
  document.getElementById('taskArea').style.display = 'block';

  sessionStorage.setItem('startTime', Date.now());

  const matchingPairs = 10; // Number of matching pairs
  const nonMatchingPairs = 10; // Number of non-matching pairs
  const totalPairs = matchingPairs + nonMatchingPairs; // Total number of pairs

  let numbersArray = [];

  // Generate numbers for matching pairs
  for (let i = 0; i < matchingPairs; i++) {
    let base = Math.floor(Math.random() * 90000) + 10000;
    numbersArray.push({ number1: base, number2: base });
  }

  // Generate numbers for non-matching pairs
  for (let i = 0; i < nonMatchingPairs; i++) {
    let base = Math.floor(Math.random() * 90000) + 10000;
    let number1, number2;

    if (i < 5) {
      // Interchange the last three digits
      number1 = base;
      do
      {
        number1String = base.toString()
        tempString = number1String[2] + number1String[3] + number1String[4]
        tempString = tempString.split('').sort(function(){return 0.5-Math.random()}).join('');
        number1String = number1String[0] + number1String[1] + tempString
        number2 = parseInt(number1String)
      } while(number1 == number2 || number1String.length != number2.toString().length)
    } else {
      // Interchange the first three digits
      number1 = base;
      do
      {
        number1String = base.toString()
        tempString = number1String[0] + number1String[1] + number1String[2]
        tempString = tempString.split('').sort(function(){return 0.5-Math.random()}).join('');
        number1String = tempString + number1String[3] + number1String[4]
        number2 = parseInt(number1String)
      } while(number1 == number2 || number1String.length != number2.toString().length)
    }

    numbersArray.push({ number1, number2 });
  }

  // Shuffle the numbers array
  numbersArray.sort(() => Math.random() - 0.5);

  console.log(numbersArray)
  // Display the numbers in the numbersArea div
  const numbersArea = document.getElementById('numbersArea');
  numbersArray.forEach((numbers, index) => {
    const isMatching = numbersArray[index]['number1'] == numbersArray[index]['number2'];
    const numbersRow = document.createElement('div');
    numbersRow.classList.add('numbersRow');
    numbersRow.dataset.matching = isMatching;
    numbersRow.style.setProperty('--base-gap', index);
    const number1Span = document.createElement('span');
    number1Span.classList.add('number');
    number1Span.textContent = numbers.number1;
    const number2Span = document.createElement('span');
    number2Span.classList.add('number');
    number2Span.textContent = numbers.number2;
    numbersRow.appendChild(number1Span);
    numbersRow.appendChild(number2Span);
    numbersRow.addEventListener('click', function () {
      if (!selectedRows.includes(this)) {
        selectedRows.push(this);
        this.classList.add('selectedRow');
        if (this.dataset.matching === 'true') {
          incorrectSelections++;
        } else {
          correctSelections++;
        }
      }
    });
    numbersArea.appendChild(numbersRow);
  });
});

document.getElementById('endTask').addEventListener('click', function () {
  const endTime = Date.now();
  const startTime = sessionStorage.getItem('startTime');
  const timeTaken = (endTime - startTime) / 1000;
  const missedSelections = 10 - correctSelections;

  const participantNumber = sessionStorage.getItem('participantNumber');
  const deviceType = sessionStorage.getItem('deviceType');
  const taskNumber = sessionStorage.getItem('taskNumber');

  sessionStorage.setItem('timeTaken', timeTaken);
  sessionStorage.setItem('correctSelections', correctSelections);
  sessionStorage.setItem('incorrectSelections', incorrectSelections);
  sessionStorage.setItem('missedSelections', missedSelections);

  document.getElementById('resultsArea').innerHTML = `
        <h2>Thank you for taking test!!</h2>`;

  document.getElementById('taskArea').style.display = 'none';
  document.getElementById('resultsArea').style.display = 'block';
  
  var data = [
        ['Correct Selections', 'Incorrect Selections', 'Missed Selections', 'Participant Number', 'Device Type', 'Task Number', 'Time Taken'],
        [correctSelections, incorrectSelections, missedSelections, participantNumber, deviceType, taskNumber, timeTaken]
      ];

      var csvContent = 'data:text/csv;charset=utf-8,';

      data.forEach(function(rowArray) {
        var row = rowArray.join(',');
        csvContent += row + '\r\n';
      });

      var encodedUri = encodeURI(csvContent);
      var link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'ResultNumberTest.csv');
      document.body.appendChild(link);
      link.click();

});
