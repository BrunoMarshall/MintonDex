\# How to Add Your Token to MintonDex



\## Requirements

\- Token must be deployed on Shardeum Mainnet (Chain ID: 8118)

\- Token must be an ERC-20 standard token

\- Token logo image (PNG or JPG, recommended 256x256px)



\## Submission Process

For now, use our Minton´s help here: https://mintonshardeum.com/submit-token.html
otherwise:



\### Step 1: Fork the Repository

1\. Go to https://github.com/BrunoMarshall/MintonDex

2\. Click "Fork" button in the top right



\### Step 2: Add Your Token Logo

1\. In your forked repository, go to the `logos` folder

2\. Click "Add file" → "Upload files"

3\. Upload your token logo named as: `YOUR\_TOKEN\_ADDRESS.jpg` or `YOUR\_TOKEN\_ADDRESS.png`

&nbsp;  - Example: `0xYourTokenAddress123.jpg`

&nbsp;  - Recommended size: 256x256px

&nbsp;  - Max file size: 100KB



\### Step 3: Edit tokenlist.json

1\. Open `tokenlist.json` in your fork

2\. Click the edit (pencil) icon

3\. Add your token to the `tokens` array:

```json

{

&nbsp; "address": "0xYourTokenAddress",

&nbsp; "name": "Your Token Name",

&nbsp; "symbol": "SYMBOL",

&nbsp; "decimals": 18,

&nbsp; "logoURI": "https://raw.githubusercontent.com/BrunoMarshall/MintonDex/main/logos/0xYourTokenAddress.jpg"

}

4\. Make sure to add a comma after the previous token entry
5\. Commit your changes

\### Step 4: Create Pull Request

1\. Go to "Pull requests" tab
2\. Click "New pull request"
3\. Click "Create pull request"
4\. Title: "Add [TOKEN_SYMBOL] Token"
5\. Description: Briefly describe your token
6\. Click "Create pull request"

\### Step 5: Wait for Review
Our team will review your submission within 24-48 hours. We check:

Token contract is verified on explorer
Token follows ERC-20 standard
Logo meets requirements
No duplicate submissions

\### Example Submission
json{
  "address": "0xcc3463943Aa68DeD67bA7C128a040583cB59B5e9",
  "name": "Marshall",
  "symbol": "MRSH",
  "decimals": 18,
  "logoURI": "https://raw.githubusercontent.com/BrunoMarshall/MintonDex/main/logos/0xcc3463943Aa68DeD67bA7C128a040583cB59B5e9.jpg"
}
\### Questions?

Open an issue: https://github.com/BrunoMarshall/MintonDex/issues
Discord: https://discord.com/invite/shardeum

