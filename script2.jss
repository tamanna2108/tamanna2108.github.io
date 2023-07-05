let captchaSet = [];
let correctCount = 0;
let noAnswer = 0;
let inCorrectCount = 0;

// Function to generate a random CAPTCHA
function generateCaptcha() {
  var captcha = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < 6; i++) {
    captcha += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return captcha;
}

// Function to generate 10 CAPTCHAs
function generateCaptchaSet() {
  for (var i = 0; i < 10; i++) {
    captchaSet.push(generateCaptcha());
  }
  return captchaSet;
}

// Function to validate the CAPTCHA answers
function validateCaptcha() {
  var captchas = document.getElementsByClassName('captcha');
  var userAnswers = [];

  for (var i = 0; i < captchas.length; i++) {
    userAnswers.push(captchas[i].value);
  }

  for (var i = 0; i < userAnswers.length; i++) {
    if(!userAnswers[i])
	{
		noAnswer++;
	}
	else if (userAnswers[i] === captchaSet[i]) {
      correctCount++;
    }
	else {
      inCorrectCount++;
    }
  }
}

document.getElementById('startTask').addEventListener('click', function () {
  const participantNumber = document.getElementById('participantNumber').value;
  const deviceType = document.getElementById('deviceType').value;
  const taskNumber = document.getElementById('taskNumber').value;

  sessionStorage.setItem('participantNumber', participantNumber);
  sessionStorage.setItem('deviceType', deviceType);
  sessionStorage.setItem('deviceType', deviceType);
  sessionStorage.setItem('taskNumber', taskNumber);

  document.getElementById('inputArea').style.display = 'none';
  document.getElementById('taskArea').style.display = 'block';

  sessionStorage.setItem('startTime', Date.now());

  // Generate the CAPTCHA set and display on the page
	var captchaSet = generateCaptchaSet();
	  var captchaContainer = document.getElementById('captcha-container');

	  for (var i = 0; i < captchaSet.length; i++) {
		var captcha = captchaSet[i];
		var captchaElement = document.createElement('div');
		captchaElement.innerHTML = 'CAPTCHA ' + (i + 1) + ': ' + captcha + ' <input type="text" class="captcha"><br>';
		captchaContainer.appendChild(captchaElement);
	  }
});



document.getElementById('submit-button').addEventListener('click', function () {
  validateCaptcha();
  const endTime = Date.now();
  const startTime = sessionStorage.getItem('startTime');
  const timeTaken = (endTime - startTime) / 1000;

  const participantNumber = sessionStorage.getItem('participantNumber');
  const deviceType = sessionStorage.getItem('deviceType');
  const taskNumber = sessionStorage.getItem('taskNumber');

  sessionStorage.setItem('timeTaken', timeTaken);
  sessionStorage.setItem('CorrectAnswers', correctCount);
  sessionStorage.setItem('incorrectAnswers', inCorrectCount);
  sessionStorage.setItem('noAnswers', noAnswer);

  document.getElementById('resultsArea').innerHTML = `
        <h2>Task Results:</h2>
        Participant Number: ${participantNumber}<br>
        Device Type: ${deviceType}<br>
        Task Number: ${taskNumber}<br>
        Time Taken: ${timeTaken} seconds<br>
        Correct Answers: ${correctCount}<br>
        Incorrect Answers: ${inCorrectCount}<br>
        No Answer: ${noAnswer}`;

  document.getElementById('taskArea').style.display = 'none';
  document.getElementById('resultsArea').style.display = 'block';
  
  
});
