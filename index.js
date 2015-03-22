#!/usr/bin/env node
/*!
 * From https://gist.github.com/tanepiper/575303
 */

var argv = require('optimist')
	.usage('Usage: --key=[consumer key] -secret=[consumer secret]')
	.demand(['key', 'secret'])
	.argv;

var OAuth = require('oauth').OAuth;
var colors = require('colors');

const REQUEST_TOKEN_URL = 'https://api.twitter.com/oauth/request_token';
const ACCESS_TOKEN_URL = 'https://api.twitter.com/oauth/access_token';
const OAUTH_VERSION = '1.0';
const HASH_VERSION = 'HMAC-SHA1';

function getAccessToken(oa, oauth_token, oauth_token_secret, pin) {
	oa.getOAuthAccessToken(oauth_token, oauth_token_secret, pin,
		function(error, oauth_access_token, oauth_access_token_secret, results2) {
			if (error) {
				if (parseInt(error.statusCode) == 401) {
					throw new Error('The pin number you have entered is incorrect'.bold.red);
				}
			}
			console.log('Your OAuth Access Token: '.bold.green + oauth_access_token);
			console.log('Your OAuth Token Secret: '.bold.green + oauth_access_token_secret);
			console.log('Now, save these two values, along with your origional consumer secret and key and use these in your twitter app'.bold.yellow);
			process.exit(1);
		});
}

function getRequestToken(oa) {

	oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
		if (error) {
			throw new Error(([ error.statusCode, error.data ].join(': ')).bold.red);
		} else {
			console.log('In your browser, log in to your twitter account.  Then visit:');
			console.log(('https://twitter.com/oauth/authorize?oauth_token=' + oauth_token).underline.cyan);
			console.log('After logged in, you will be promoted with a pin number.');
			console.log('');
			console.log('Enter the pin number here:'.bold.green);

			var stdin = process.openStdin();
			stdin.on('data', function(chunk) {
				pin = chunk.toString().trim();
				getAccessToken(oa, oauth_token, oauth_token_secret, pin);
			});
		}
	});
}


var key = argv.key.trim();
var secret = argv.secret.trim();
var oa = new OAuth(REQUEST_TOKEN_URL, ACCESS_TOKEN_URL, key, secret, OAUTH_VERSION, null, HASH_VERSION);
getRequestToken(oa);
