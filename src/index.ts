#!/usr/bin/env node
/*!
 * Based on https://gist.github.com/tanepiper/575303
 */

import chalk from "chalk";
import { STATUS_CODES } from "http";
import inquirer from "inquirer";
import { OAuth } from "oauth";
import open from "open";

const BASE_URL = "https://api.twitter.com";
const OAUTH1_REQUEST_TOKEN_URL = `${BASE_URL}/oauth/request_token`;
const OAUTH1_ACCESS_TOKEN_URL = `${BASE_URL}/oauth/access_token`;
const OAUTH1_AUTHORIZE_URL = `${BASE_URL}/oauth/authorize`;
const OAUTH1_VERSION = "1.0";
const OAUTH1_SIGNATURE_METHOD = "HMAC-SHA1";

async function main() {
	console.log("🐦️", chalk.bold.blue("Twitter API User Authorisation Tool"));

	let openBrowser = !process.argv.includes("--no-open-browser") && process.env.TWAUTH_OPEN_BROWSER !== "false";
	let key = process.env.TWITTER_CONSUMER_KEY ?? process.env.TWITTER_API_KEY;
	let secret = process.env.TWITTER_CONSUMER_SECRET ?? process.env.TWITTER_API_SECRET;
	if (!key || !secret) {
		console.log("");
		console.log(
			"To get started, visit",
			chalk.bold.blue.underline("https://developer.twitter.com/"),
			"and create an API application. Enable user authentication for OAuth 1.0a. You can enter any URL under Callback URL, as it won’t be used by this tool."
		);
		console.log("");
		console.log("When you’re ready, enter your API Key and Secret:");

		let answers = await inquirer.prompt([
			{
				type: "input",
				name: "key",
				message: "API Key:"
			},
			{
				type: "input",
				name: "secret",
				message: "API Key Secret:"
			}
		]);
		key = answers.key;
		secret = answers.secret;
	}

	if (key === undefined || secret === undefined || key.trim() === "" || secret.trim() === "") {
		console.log("No keys provided. Exiting.");
		process.exit(1);
	}

	let auth = new OAuth(OAUTH1_REQUEST_TOKEN_URL, OAUTH1_ACCESS_TOKEN_URL, key, secret, OAUTH1_VERSION, null, OAUTH1_SIGNATURE_METHOD);
	auth.getOAuthRequestToken(async (error, token, tokenSecret) => {
		console.log("");

		if (error !== null) {
			console.error(chalk.bold.red("Couldn’t get OAuth request token. Are the consumer key and secret correct?"));
			console.error(chalk.red(`${error.statusCode} ${STATUS_CODES[error.statusCode]}: ${error.data}`));
			process.exit(1);
		}

		let url = new URL(OAUTH1_AUTHORIZE_URL);
		url.searchParams.set("oauth_token", token);

		console.log("Visit this URL in your browser to authorize your account:");
		console.log(chalk.bold.underline.blue(url.toString()));
		console.log("");

		if (openBrowser) {
			open(url.toString());
		}

		let { pin } = await inquirer.prompt([{
			type: "number",
			name: "pin",
			message: "Paste the PIN here:",
			filter: (value) => (value >= 0 && value <= 9_999_999) ? value : Promise.reject(`Invalid PIN: ${value}`)
		}]);

		auth.getOAuthAccessToken(
			token,
			tokenSecret,
			String(pin),
			(error, accessToken, accessTokenSecret) => {
				console.log("");

				if (error !== null) {
					console.error(chalk.bold.red("Couldn’t get OAuth access token. Did you mistype the PIN?"));
					console.error(chalk.red(`${error.statusCode} ${STATUS_CODES[error.statusCode]}: ${error.data}`));
					process.exit(1);
				}

				console.log(chalk.bold.blue("Access Token: "), accessToken);
				console.log(chalk.bold.blue("Access Secret:"), accessTokenSecret);
				console.log("");
				console.log("Now save these two values, along with your API Key and Key Secret, and use them in your Twitter app. Have fun!");
				process.exit(0);
			}
		);
	});
}

// Top level await not available since we try to support a slightly wider range of node versions,
// and as such are outputting to CommonJS, which doesn’t support it.
// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {
	try {
		await main();
	} catch (error) {
		if (error instanceof Error) {
			console.error(chalk.bold.red(error.message));
			console.error(error.stack);
		} else {
			console.error(chalk.bold.red((error as any).toString()));
		}
		process.exit(1);
	}
})();
