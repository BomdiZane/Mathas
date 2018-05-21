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

1. For automation tests, add the absolute path of the vendor folder (./public/vendor) to your PATH or copy the webdrivers (chromedriver.exe and geckodriver.exe) to your desired location and add that to you PATH. The test script has been written to use firefox, however if you prefer to run the test with chrome, update the script by simpy changing 'firefox' to 'chrome' in the test file where we have *let driver = await new Builder().forBrowser('firefox').build()*.

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
