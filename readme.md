# Mathas

Multiplayer math game with websockets

## First Run

```javaScript
// Install dependencies
npm install

// Start server
npm start
```

## Running Tests

1. For automation tests, download [Selenium Webdriver](https://seleniumhq.github.io/selenium/docs/api/javascript/index.html) and add the extracted file location to PATH. The test script has been written to use firefox so download the **geckodriver**. However, if you prefer to run the test with chrome instead, make sure to download the [cromedriver v2.8](https://chromedriver.storage.googleapis.com/index.html?path=2.28/) and update the script to use chrome (by simpy changing 'firefox' to 'chrome' in the test file where we have *let driver = await new Builder().forBrowser('firefox').build()*).

2. Run tests with

```javaScript
// Unit tests
npm run test

// Automation tests (with Selenium)
npm start // If the server isn't running already
npm run test:auto

```

### Author

Adombang Munang (Bomdi Zane)
