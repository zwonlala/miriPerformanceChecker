/** @format */
import fs from "fs";
import lighthouse from "lighthouse";
import chromeLauncher from "chrome-launcher";

const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });

const options = {
  logLevel: "info",
  output: "json",
  onlyCategories: ["performance"],
  port: chrome.port,
};
const runnerResult = await lighthouse("https://local.miricanvas.com/", options);

// `.report` is the HTML report as a string
const reportJson = runnerResult.report;

const currentDate = new Date();
const dateOption = {
  year: "2-digit",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
};
// "YY/MM/DD HH:MM" format
const dateString = Intl.DateTimeFormat("ja", dateOption).format(currentDate);
const [YYMMDD, HHMM] = dateString.split(" ");
const dir = `./${YYMMDD.replace(/\//g, "")}`;
const fileDatePrefix = HHMM.replace(":", "");

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

fs.writeFileSync(`${dir}/${fileDatePrefix}_report.json`, reportJson);
// `.lhr` is the Lighthouse Result as a JS object
console.log("Report is done for", runnerResult.lhr.finalDisplayedUrl);
console.log(
  "Performance score was",
  runnerResult.lhr.categories.performance.score * 100
);

await chrome.kill();
