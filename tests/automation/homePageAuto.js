const {Builder, By, Key, until} = require('selenium-webdriver'),
    assert = require('assert');

(async function testButtonVisibilityTogglesBetweenRounds() {
    // let driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
    let driver = await new Builder().forBrowser('firefox').build();

    try {
        await driver.get('http://127.0.0.1:3000/');
        
        let [ textPad, buttonHolder, timer ] = await Promise.all([
            driver.findElement(By.id('textPad')),
            driver.findElement(By.id('buttonHolder')),
            driver.findElement(By.id('timer'))
        ])
        .then(results => results);

        // Test that buttons are hidden when rounds are closed
        await driver.wait(until.elementTextContains(textPad, 'Wait for next round...'), 60000);
        let buttonHolderDisplayValue = await buttonHolder.getCssValue('display');
        assert.equal(buttonHolderDisplayValue, 'none');

        await driver.wait(until.elementTextContains(textPad, 'Round starts in'), 60000);
        buttonHolderDisplayValue = await buttonHolder.getCssValue('display');
        assert.equal(buttonHolderDisplayValue, 'none');

        // Test that buttons are visible during rounds
        await driver.wait(until.elementTextContains(timer, '7'), 60000);
        buttonHolderDisplayValue = await buttonHolder.getCssValue('display');
        assert.equal(buttonHolderDisplayValue, 'flex');
    } 
    catch(e){ console.error(e); }
    finally { await driver.quit(); }
})();