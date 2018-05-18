const {Builder, By, Key, until} = require('selenium-webdriver'),
    assert = require('chai').assert;

(async function testButtonVisibilityTogglesBetweenRounds() {
    let driver = await new Builder().forBrowser('chrome').build(),
        waitMessage = 'Wait for next round...',
        roundStartMessage = 'Round starts in',
        timerMaxVal = '10';

    try {
        await driver.get('http://127.0.0.1:3000/');
        
        let [ textPad, buttonHolder, timer, numPlayers, score, yesButton, noButton ] = 
        await Promise.all([
            driver.findElement(By.id('textPad')),
            driver.findElement(By.id('buttonHolder')),
            driver.findElement(By.id('timer')),
            driver.findElement(By.id('numPlayers')),
            driver.findElement(By.id('score')),
            driver.findElement(By.id('yesButton')),
            driver.findElement(By.id('noButton'))
        ])
        .then(results => results);

        //Assert that buttons are hidden by default
        assert.equal(await buttonHolder.isDisplayed(), false,
            'Buttons are not hidden by default!');

        // Assert that numPlayers is updated
        assert.notEqual(await numPlayers.getText(), 'Players: 0',
            'numPlayers is not updated!');

        // Assert that buttons are hidden when rounds are closed
        await driver.wait(until.elementTextIs(textPad, roundStartMessage), 60000);
        assert.equal(await buttonHolder.isDisplayed(), false, 
            'Buttons are not hidden when rounds close!');
        
        // Assert that buttons are visible during rounds
        await driver.wait(until.elementTextIs(timer, timerMaxVal), 60000);
        assert.equal(await buttonHolder.isDisplayed(), true, 
            'Buttons are not visible during rounds!');
        
        // Assert that buttons are hidden, score is updated and wait 
        // message is displayed after 'yesButton' clicks
        let scoreText = await score.getText();
        let currentScore = Number(scoreText.split(':')[1].trim());
        await driver.wait(until.elementIsVisible(yesButton), 60000).click();
        assert.equal(await buttonHolder.isDisplayed(), false, 
            'Buttons are not hidden after \'yesButton\' clicks!');
        assert.oneOf(await textPad.getText(), [waitMessage, roundStartMessage], 
            'Wait message is not displayed after \'yesButton\' clicks!');
        if (currentScore === 0)
            assert.oneOf(await score.getText(), ['Score: 0', 'Score: 1'], 
            'Score is not updated after \'yesButton\' clicks!');
        else assert.oneOf(await score.getText(), 
            [`Score: ${currentScore + 1}`, `Score: ${currentScore - 1}`], 
            'Score is not updated after \'yesButton\' clicks!');

        // Assert that buttons are hidden, score is updated and wait 
        // message is displayed after 'noButton' clicks
        scoreText = await score.getText();
        currentScore = Number(scoreText.split(':')[1].trim());
        await driver.wait(until.elementIsVisible(noButton), 60000).click();
        assert.equal(await buttonHolder.isDisplayed(), false, 
            'Buttons are not hidden after \'noButton\' clicks!');
        assert.oneOf(await textPad.getText(), [waitMessage, roundStartMessage], 
            'Wait message is not displayed after \'noButton\' clicks!');
        if (currentScore === 0)
            assert.oneOf(await score.getText(), ['Score: 0', 'Score: 1'], 
            'Score is not updated after \'yesButton\' clicks!');
        else assert.oneOf(await score.getText(), 
            [`Score: ${currentScore + 1}`, `Score: ${currentScore - 1}`], 
            'Score is not updated after \'yesButton\' clicks!');
    }
    catch(e) { console.error(e); }
    finally { await driver.quit(); }
})();