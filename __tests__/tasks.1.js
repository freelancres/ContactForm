const puppeteer = require("puppeteer");
const path = require('path');

let browser;
let page;

beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    await page.goto('file://' + path.resolve('./index.html'));
}, 30000);

afterAll((done) => {
    try {
        this.puppeteer.close();
    } catch (e) { }
    done();
});

describe("Form - Personal Data", () => {
    it("Personal Data section should contain a `legend`", async () => {
        const legend = await page.$$('legend');
        const legendText = await page.evaluate(element => element.innerHTML, legend[0]);
        expect(legendText).toMatch(/\S/);
    });
    it("Label tags on page should have their `for` attribute defined", async () => {
        const labels = await page.$$('label');
        expect(labels.length).toBeGreaterThan(0);
        for (let label of labels) {
            const labelFor = await label.getProperty('htmlFor');
            const labelForValue = await labelFor.jsonValue();
            expect(labelForValue).toBeTruthy();
        }
    });
    it("Input tags on page should have their `type` attribute defined", async () => {
        const inputs = await page.$$('input');
        expect(inputs.length).toBeGreaterThan(0);
        for (let input of inputs) {
            const inputType = await input.getProperty('type');
            const inputTypeValue = await inputType.jsonValue();
            expect(inputTypeValue).toBeTruthy();
        }
    });
    it("Form Should contain 'Comments' textarea", async () => {
        const comments = await page.$('textarea');
        expect(comments).toBeTruthy();
    });

});
describe("Form - Products", () => {
    it("Product Section should contain a `legend` tag", async () => {
        const legend = await page.$$('legend');
        const legendText = await page.evaluate(element => element.innerHTML, legend[1]);
        expect(legendText).toMatch(/\S/);
    });
    it("Radio Buttons are present", async () => {
        const radioButtons = await page.$$('input[type="radio"]');
        expect(radioButtons.length).toBeGreaterThan(1);
    });

    it("Checkboxes are present", async () => {
        const checkboxes = await page.$$('input[type="checkbox"]');
        expect(checkboxes.length).toBeGreaterThan(2);
    });

    it("Input fields of type `date` exist", async () => {
        const inputFields = await page.$$('input[type="date"]');
        expect(inputFields.length).toBeGreaterThan(1);
    });
    it("'Category' should use a dropdown menu", async () => {
        const select = await page.$('select');
        expect(select).toBeTruthy()
    });
    it("'Category' should have 3 options: 'Personal', 'Business', 'Government'", async () => {
        const select = await page.$('select');
        const options = await select.$$('option');
        expect(options.length).toBe(3);
        const option1 = await page.evaluate(element => element.innerHTML, options[0]);
        const option2 = await page.evaluate(element => element.innerHTML, options[1]);
        const option3 = await page.evaluate(element => element.innerHTML, options[2]);
        expect(option1).toMatch(/personal/i);
        expect(option2).toMatch(/business/i);
        expect(option3).toMatch(/government/i);
    });
});