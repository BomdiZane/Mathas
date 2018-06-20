const { Builder, By, until } = require('selenium-webdriver'),
	assert = require('chai').assert;

(async function testButtonVisibilityTogglesBetweenRounds() {
	let driver = await new Builder().forBrowser('firefox').build(),
		waitMessage = 'Wait for next round...',
		roundStartMessage = 'Round starts in',
		timerMaxVal = '10';

	try {
		await driver.get('http://127.0.0.1:3000/');

		let [ textPad, buttonHolder, timer, numPlayers, score, yesButton, noButton ] = await Promise.all([
			driver.findElement(By.id('textPad')),
        	driver.findElement(By.id('buttonHolder')),
        	driver.findElement(By.id('timer')),
        	driver.findElement(By.id('numPlayers')),
        	driver.findElement(By.id('score')),
        	driver.findElement(By.id('yesButton')),
        	driver.findElement(By.id('noButton'))
		])
			.then(results => results);

		assert.notEqual(await numPlayers.getText(), 'Players: 0',
			'numPlayers is not updated!');

		await driver.wait(until.elementTextIs(textPad, roundStartMessage), 60000);
		assert.equal(await buttonHolder.isDisplayed(), false,
			'Buttons are not hidden when rounds close!');

		await driver.wait(until.elementTextIs(timer, timerMaxVal), 60000);
		assert.equal(await buttonHolder.isDisplayed(), true,
			'Buttons are not visible during rounds!');

		await driver.wait(until.elementTextContains(textPad, '='), 60000);
		let answer = computeAnswer(await textPad.getText());
		let scoreText = await score.getText();
		let currentScore = Number(scoreText.split(':')[1].trim());
		let oldResultCards = await driver.findElements(By.className('resultCard'));
		await driver.wait(until.elementIsVisible(yesButton), 60000);
		await yesButton.click();
		let newResultCards = await driver.findElements(By.className('resultCard'));
		let newResultCardLastChild = await driver.findElement(By.css('.resultCard:last-child'));
		let newResultCardClass = await newResultCardLastChild.getAttribute('class');

		assert.equal(newResultCards.length, oldResultCards.length + 1,
			'Result card is not added after \'yesButton\' clicks!');
		assert.equal(await buttonHolder.isDisplayed(), false,
			'Buttons are not hidden after \'yesButton\' clicks!');
		assert.oneOf(await textPad.getText(), [waitMessage, roundStartMessage],
			'Wait message is not displayed after \'yesButton\' clicks!');

		if (answer){
			assert.equal(await score.getText(), `Score: ${currentScore + 1}`,
				'Score is not incremented after \'yesButton\' clicks when the answer is correct!');
			assert.include(newResultCardClass, 'correct',
				'Added result card has the incorrect class after \'yesButton\' clicks when the answer is correct!');
		}
		else {
			if (currentScore === 0)
				assert.equal(await score.getText(), `Score: ${currentScore}`,
					'Score changes after \'yesButton\' clicks when the answer is wrong and the previous score was 0!');
			else
				assert.equal(await score.getText(), `Score: ${currentScore - 1}`,
					'Score is not decremented after \'yesButton\' clicks when the answer is wrong and the previous score was not 0!');
			assert.include(newResultCardClass, 'wrong',
				'Added result card has the incorrect class after \'yesButton\' clicks when the answer is incorrect!');
		}

		await driver.wait(until.elementTextContains(textPad, '='), 60000);
		answer = computeAnswer(await textPad.getText());
		scoreText = await score.getText();
		currentScore = Number(scoreText.split(':')[1].trim());
		oldResultCards = await driver.findElements(By.className('resultCard'));
		await driver.wait(until.elementIsVisible(noButton), 60000);
		await noButton.click();
		newResultCards = await driver.findElements(By.className('resultCard'));
		newResultCardLastChild = await driver.findElement(By.css('.resultCard:last-child'));
		newResultCardClass = await newResultCardLastChild.getAttribute('class');

		assert.equal(newResultCards.length, oldResultCards.length + 1,
			'Result card is not added after \'noButton\' clicks!');
		assert.equal(await buttonHolder.isDisplayed(), false,
			'Buttons are not hidden after \'noButton\' clicks!');
		assert.oneOf(await textPad.getText(), [waitMessage, roundStartMessage],
			'Wait message is not displayed after \'noButton\' clicks!');

		if (answer){
			if (currentScore === 0)
				assert.equal(await score.getText(), `Score: ${currentScore}`,
					'Score changes after \'noButton\' clicks when the answer is wrong and the previous score was 0!');
			else
				assert.equal(await score.getText(), `Score: ${currentScore - 1}`,
					'Score is not decremented after \'noButton\' clicks when the answer is wrong and the previous score was not 0!');
			assert.include(newResultCardClass, 'wrong',
				'Added result card has the incorrect class after \'noButton\' clicks when the answer is correct!');
		}
		else {
			assert.equal(await score.getText(), `Score: ${currentScore + 1}`,
				'Score is not incremented after \'noButton\' clicks when the answer is wrong!');
			assert.include(newResultCardClass, 'correct',
				'Added result card has the incorrect class after \'noButton\' clicks when the answer is incorrect!');
		}

		console.log('All good!\n');
	}
	catch(e) { console.error(e); }
	finally { await driver.quit(); }
})();

// Return true if the correct response to the current question is yes
// Return false if the correct response to the current question is no
function computeAnswer(question) {
	let parts = question.split('='),
		answer = Number(parts[1].trim());

	if (parts[0].includes('+'))
		return answer === parseFloat((Number(parts[0].split('+')[0].trim()) + Number(parts[0].split('+')[1].trim())).toFixed(2));
	if (parts[0].includes('-'))
		return answer === parseFloat((Number(parts[0].split('-')[0].trim()) - Number(parts[0].split('-')[1].trim())).toFixed(2));
	if (parts[0].includes('*'))
		return answer === parseFloat((Number(parts[0].split('*')[0].trim()) * Number(parts[0].split('*')[1].trim())).toFixed(2));
	if (parts[0].includes('/'))
		return answer === parseFloat((Number(parts[0].split('/')[0].trim()) / Number(parts[0].split('/')[1].trim())).toFixed(2));
}
