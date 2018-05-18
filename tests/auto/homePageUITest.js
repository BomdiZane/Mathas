const {Builder, By, Key, until} = require('selenium-webdriver'),
    assert = require('assert');

(async function testButtonVisibilityTogglesBetweenRounds() {
    let driver = await new Builder().forBrowser('firefox').build(),
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

        // Test that buttons are hidden when rounds are closed
        await driver.wait(until.elementTextIs(textPad, roundStartMessage), 60000);
        assert.equal(await buttonHolder.isDisplayed(), false);
        
        // Test that buttons are visible during rounds
        await driver.wait(until.elementTextIs(timer, timerMaxVal), 60000);
        assert.equal(await buttonHolder.isDisplayed(), true);
        
        // Test that buttons are hidden after click and wait message is displayed
        // Test yesButton
        await driver.wait(until.elementIsVisible(yesButton), 60000).click();
        assert.equal(await buttonHolder.isDisplayed(), false);
        assert.equal(await textPad.getText(), waitMessage);
        // Test noButton
        await driver.wait(until.elementIsVisible(noButton), 60000).click();
        assert.equal(await buttonHolder.isDisplayed(), false);
        assert.equal(await textPad.getText(), waitMessage);
    } 
    catch(e){ console.error(e); }
    finally { await driver.quit(); }
})();