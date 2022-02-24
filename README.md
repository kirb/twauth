<h2 align="center">
<img src="https://github.githubassets.com/images/icons/emoji/unicode/1f426.png">
<br>
twauth
</h2>

**Command line tool to quickly authenticate a user against the Twitter API.**

In some cases, you might have an app registered with the Twitter Developer website, but you don’t have the API keys you need to use them 

## Usage
You can quickly run twauth from any computer with npm or pnpm installed by running:

```bash
npx twauth
# or
pnpx twauth
```

Example output:

```
🐦️ Twitter API User Authorisation Tool

To get started, visit https://developer.twitter.com/ and create an API
application. Enable user authentication for OAuth 1.0a. You can enter any URL
under Callback URL, as it won’t be used by this tool.

When you’re ready, enter your API Key and Secret:
? API Key: 01234567890ABCDEFGabcdefg
? API Key Secret: 01234567890ABCDEFGabcdefg01234567890ABCDEFGabcdefg

Visit this URL in your browser to authorize your account:
https://api.twitter.com/oauth/authorize?oauth_token=123-4567890ABCDEFGHabcdefgh

? Paste the PIN here: 1234567

Access token:  123456789-ABCDEFGabcdefg0123456789ABCDEFGabcdefg01
Access secret: ABCDEFGabcdefg0123456789ABCDEFGabcdefg0123456

Now save these two values, along with your original consumer key and secret,
and use them in your Twitter app. Have fun!
```

## Environment
You can automate twauth by setting some environment variables:

### `TWITTER_CONSUMER_KEY`
Set the OAuth 1.0a consumer key to use. Also aliased as `TWITTER_API_KEY`.

### `TWITTER_CONSUMER_SECRET`
Set the OAuth 1.0a consumer secret to use. Also aliased as `TWITTER_API_SECRET`.

### `TWAUTH_OPEN_BROWSER`
Set this to `false` to disable automatically opening the user’s default browser to the Twitter authorisation page. You can also pass `--no-open-browser` as a flag when running twauth.

### Automation example
```bash
$ TWITTER_CONSUMER_KEY=01234567890ABCDEFGabcdefg \
  TWITTER_CONSUMER_SECRET=01234567890ABCDEFGabcdefg01234567890ABCDEFGabcdefg \
  TWAUTH_OPEN_BROWSER=false \
  npx twauth
```

## Credits
Released and maintained by [Adam Demasi (@kirb)](https://github.com/kirb).

Based on [a gist](https://gist.github.com/tanepiper/575303) originally written by [Tane Piper](https://github.com/tanepiper).

## License
Licensed under the Apache License, version 2.0. Refer to [LICENSE.md](https://github.com/chariz/modern-flash/blob/main/LICENSE.md).
