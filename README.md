# Conforme

## Getting started - development

To start developing for Conforme you are going to need a development environment setup and configured.

### Pre-requisites

- A development O365 tenant (speak to Lead Consultant if you don't have one)
- Latest version of Python installed (for Windows development machines)
- A copy of the env file for development. This will be updated for your own settings
- Account with mailbox enabled to use it as notifications sender

## Development environment and code editor

Preferably you should be using VSCode as your code editor with Prettier and ESLint extensions installed.
Then in settings.json add the following object to configure ESLint's working directory (where to lint)

```
  "eslint.workingDirectories": ["./", "./React", "./Express"],
```

You will find some commands in package.json that enable checking for errors/warnings, formatting with Prettier
and linting with ESLint automatically. These commands are: lint:check, lint:fix, format:check, format:fix

## Manual and automated deployment

You can create all required resources manually or use [PowerShell script](/Azure%20Deployment/create-conforme.ps1) to do it for you. Script doesn't configure everything, so you need to complete the deployment manually. Automated steps will be collapsed in sections, steps that require an action will be marked below the section.

## Organization object

The idea of Conforme is to run multiple instances of the app for multiple organizations. In production environment there is one app running as a central server for all organizations, and client app per organization. To distinguish different organizations, we need to save organization's id in the database in organization's specific documents. Because every developer has his own developer's tenant, each needs to create his organization in the database. This is the data model of organization object in the database:

<details>
  <summary>Organization JSON</summary>

```json
{
  "id": <organization's id>,
  "name": <organization's name>,
  "domain": <domain>,
  "logoUrl": <logo url>,
  "bgImageUrl": <bg image url>,
  "bgImageTabletUrl": <tablet bg image url>,
  "theme": {
    "colors": {
      "brand": {
        "primary": "#FFFFFF",
        "secondary": "#A1A1A1",
        "primaryFont": "#CCCCCC",
        "secondaryFont": "#434C52",
        "active": "#B98474",
        "lightGrey": "#E3E3E3"
      }
    }
  },
  "modules": [{
    "name": <module name>,
    "type": "audits",
    "defaultFilters": {
      "audits": <audits default filters>
      "actions": <actions default filters>
      ...
    }
    "path": <module path>,
    "showInNavigation": <true/false>
    "translations": {
      "audit": "walk"
    }
  }, {
    "name": <module name>,
    "type": "tracker",
    "path": <module path>,
    "showInNavigation": <true/false>,
    "translations": {
      "tracker item": "document"
    },
    "customQuestionsInDashboard": [<name of custom question>],
    
    "featureFlags": {
      // Feature flags are optional. Each feature flag is described below.
      "enableSafetyWalk": true // Available in the audit module, configures the system as per requirements for BRE Safety Walk. Adds an additional walk type of virtual or physical to an audit (walk). Hides category and business unit from audits.
      ,
      "disablePastDateSelection" : false // If set to true, past date will be disabled in react-datepicker, while creating an audit. If set to false, past dates can be selected from date picker. Default value is false.
    }
  }],
  "allowedTenantsIds": [
    <tenant id>
  ],
  "accessGroupId": <access group id>,
  "readersGroupId": <reader's group id>,
  "adminsGroupId": <admin's group id>,
  "licenceExpirationDate": "2022-06-18T11:46:00.835Z",
  "spSiteUrl": <sharepoint site url>,
  "spLibraryId": <sharepoint library url>,
  "tenantId": <tenant id>,
  "clientId": <AAD app id>,
  "secret": <AAD app secret>,
  "metatags": {}
}
```

</details>
&nbsp;

In next steps in this instruction, you'll find some values that needs to be saved in your organization's object in the database. Please copy this data model and fill it with your data. If you'll see this kind of syntax: "`<organization's name> = Your organization's name`", that means that you need to overwrite your organization's name with specified value.
Please fill the model with the following data: `<organization's id>`, `<organization's name>`, `<logo url>` (random logo).

`<domain>` is a domain that you'll run the app locally, so it is `localhost`, and you have to add a port to is. Please take a look at the databse and scan `organizations` collection to see which ports are not already in use. Example of `<domain>` is: `localhost:3000`.

Make sure that you have changed `licenceExpirationDate` to future date.

## Azure AD application

In order to authenticate with your local development site and also to be able to authorise your users to access the site (through group memberships) you will need to configure the Azure AD from your O365 dev tenant.

<details>
  <summary>Automated steps</summary>

- Go to https://portal.azure.com and login as the admin user for your developer O365 tenant
- Navigate to Azure Active Directory
- Select 'App Registration'
- Click on 'New registration'
- Enter app name (i.e. 'conforme')
- Select the option 'Accounts in this organizational directory only (Single tenant)'
- Enter 'https://<API_URL>/auth/aad/callback' in redirect URL
- Click on Register
- Copy the Application (client) ID and add to your organization as `<AAD app id>`
- Copy the Directory (tenant) ID and add to your organization as `<tenant id>`
- Generate the Client Secret - Click on 'Certificates & secrets' - Click on 'New client secret' - Select 'Never' for when the secret should expire - Copy the value from Key and add to your organization as `<AAD app secret>`
</details>
<details open>
  <summary>Manual steps</summary>

- Give app permissions
  - Click on 'API permissions'
  - Click on 'Add a permission'
  - Select 'Microsoft Graph'
  - Select 'Application permissions'
  - Find and select 'Group.Read.All'
  - Press 'Add permissions'
  - Press 'Grant admin consent for ...' and then 'Yes'
- Do the same for 'User.Read.All'
- Do the same for 'Sites.ReadWrite.All'
- Do the same for 'Mail.Send'
- Grant required authentication data - Click on 'Authentication' - Under 'Implicit grant' select 'ID tokens' - Press 'Save' button
</details>

## Access Security Group

In order to access the application you must configure a Azure Active Directory security group to allow access and two separate groups for admin and reader roles.

<details>
  <summary>Automated steps</summary>

- Go to https://portal.azure.com and login as the admin user for your developer O365 tenant
- Navigate to Azure Active Directory
- Click on Groups
- Select New group
- Make sure 'Security' type is selected
- Enter 'Conforme Access' as the group name
- Click on Owners and add the admin user from your dev tenant
- Click on Members and add any users from your dev tenant that you intend to use for testing locally
- Click on create
- Copy the Oject Id from the group and add to your organization as `<access group id>`

Follow the same for Readers (`<reader's group id>`) and Admins (`<admin's group id>`) AD groups.

</details>

## SharePoint

- You will need to create a site on your development O365 tenant.

### Creating the site

Within any SharePoint site, click the "SharePoint" text on the top-left of your screen to get to home screen and follow these steps to create new one:

- Click 'Create site' on top navitagion menu
- Choose 'Team site' from the options provided
- Name the site accordingly (i.e. Conforme)
- Click 'Finish' when done
  and your site will be ready for use.
  Note - the sharepoint url must contain /sites/ to work correctly

Update your organization with the URL of this site for the following field:

`<sharepoint site url>` = https://TENANTNAME.sharepoint.com/sites/Conforme

Then go to `<sharepoint site url>`/Shared%20Documents/

- Click the settings Cog top right
- Click libary settings
- Take the library id value from the url params eg List=%7B`<library id>`%7D
- Add `<library id>` to your organization

## Emails service

Conforme uses Azure Functions app to send notifications.

<details>
  <summary>Automated steps</summary>

- Start by opening the [Function App section of Azure](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.Web%2Fsites/kind/functionapp)
- Click the **Create** button in the top menu
- Fill in the following values depending on environment:
  - SIT
    - Subscription: Conforme - SIT
    - Resource group: rg-conforme-web-sit
    - Function App name: conforme-functions-sit
    - Publish: Code
    - Runtime stack: Node.js
    - Version: 14 LTS
    - Location: UK South
  - SAT
    - Subscription: Conforme - SAT
    - Resource group: rg-conforme-web-sat
    - Registry name: conforme-functions-sat
    - Publish: Code
    - Runtime stack: Node.js
    - Version: 14 LTS
    - Location: UK South
  - PROD
    - Subscription: Conforme - Production
    - Resource group: rg-conforme-web-prod
    - Registry name: conforme-functions-prod
    - Publish: Code
    - Runtime stack: Node.js
    - Version: 14 LTS
    - Location: UK South
- Click the **Next: Hosting >** button in the top menu
- Select "Linux" as operating system
- Go to the **Review + create** tab
- Read it carefully and make sure everything is correct, then click on the **Create** button
</details>
&nbsp;

Deployment of Functions app will be proceed by Azure Pipelines.

## Configure app services custom domain

To make the app working on every scenario (some of browsers doesn't support 3rd party cookies) you need to configure custom domain to both: client and server.
First of all you need to register a new custom domain. If you have it, follow these steps to configure it separately for client and server:

- Start by opening the [App Service section of Azure](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.Web%2Fsites/kind/appservice)
- Open your app service
- Navigate to **Custom domains** menu option
- Select **Add custom domain** option
- Enter a domain with a subdomain (e.g. cielocosta.conforme.app)
- Press **Validate** button
- As a **Hostname record type** select **CNAME**
- Open the DNS settings for your domain in the provider you chosen
- Add **CNAME** DNS record with host as **<subdomain>** (e.g. cielocosta) and value as your default app service URL (e.g. conforme.azurewebsites.net)
- Add **TXT** DNS record with host as **asuid.<subdomain>** (e.g. asuid.cielocosta) and value as your **Custom Domain Verification ID** that you can copy from **Add custom domain** modal
- Once you save your DNS settings get back to **Add custom domain** modal and press **Validate** button again
- It could take a time to apply DNS settings in your domain provider, so try to validate it as long as **Domain ownership** won't be green and chacked
- On Azure open **TLS/SSL settings** and select **Private Key Certificates (.pfx)** from the top
- Press **Create App Service Managed Certificate** option
- In the dropdown select your custom domain and press **Create**
- Once certificate is created navigate to **Custom domains** tab
- Find your domain on a list and press **Add binding**
- Select your domain, created certificate, **SNI SSL** as type and press **Add binding**

## Database

Conforme uses a CosmosDB service running in Azure.

<details>
  <summary>Automated steps</summary>

- Start by opening the [Cosmos DB section of Azure](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.DocumentDb%2FdatabaseAccounts)
- Press **+ Create** button at the top
- Select **Azure Cosmos DB API for MongoDB**
- Fill in the following values depending on environment:
  - SIT
    - Subscription: Conforme - SIT
    - Resource group: rg-conforme-web-sit
    - Account name: conforme-db-sit
    - Location: (Europe) UK West
    - Capacity mode: Provisioned throughtput
    - Apply Free Tier Discount: Apply
    - Limit total account throughput: selected
    - Version: 4.2
  - SAT
    - Subscription: Conforme - SAT
    - Resource group: rg-conforme-web-sat
    - Registry name: conforme-db-sat
    - Location: (Europe) UK West
    - Capacity mode: Provisioned throughtput
    - Apply Free Tier Discount: Apply
    - Limit total account throughput: selected
    - Version: 4.2
  - PROD
    - Subscription: Conforme - Production
    - Resource group: rg-conforme-web-prod
    - Registry name: conforme-db-prod
    - Location: (Europe) UK West
    - Capacity mode: Provisioned throughtput
    - Apply Free Tier Discount: Apply
    - Limit total account throughput: selected
    - Version: 4.2
- Go to the **Review + create** tab
- Read it carefully and make sure everything is correct, then click on the **Create** button

Now lets create a collection.

- Open **Data Explorer**
- Select **New database** from the top menu
- Enter database name (same as account name)
- Make sure that **Provision throughput** option is checked
- Select **Autoscale**
- Set **Database Max RU/s** to 4000
- Press **OK** at the bottom
</details>
&nbsp;

After the first app run all the collections will be created in the database.

### Collections indexes

You need to add some indexes to the database to allow collections to be sorted by these indexes. When you run the app, collections should be created.
To add an index, open the database in Data Explorer, select the collection and get to 'Settings', then switch to 'Indexing Policy' tab. Under 'Current index(es)' in new row paste '$\*\* in 'Definition' column and select 'Wildcard' in 'Type' column. Press 'Save' button at the top bar.
Add the wildcard index in the following collections:

- auditLogs
- audits
- trackerItems

You can also add indexes from database console:

```js
db.auditLogs.createIndex({ "$**": 1 });
```

### Translations

In order to change a translation in a module, just add a new property to the module configuration.

Possible translations for Audits module:

- answer
- audit
- auditor
- question
- location
- business unit
- addedAt

Possible translations for Tracker module:

- tracker item
- business unit
- compliant
- non-compliant
- question
- answer

### Theme

To change a theme you need to update `theme` object in organization config in the database. Use styling structure that was implemented in app, and put it inside of `colors` property.
Example theme that changes plus button color and delete icon color in audit questions list:

```json
  "theme": {
    "colors": {
      "navigationTop": {
        "addButton": "green"
      },
      "auditItem": {
        "listItem": {
          "deleteIcon": "green"
        }
      }
    }
  },
```

### Your organization's settings

Every organization also needs its system settings to be configured in the database. In the Settings collection, please add the following data models to create required settings objects for your organization.

#### General settings

There are 2 setting variables for use in both modules.

Configuration values:

- Count of elements on the audit log

Email notification templates:

- Mentioned Notification

To import settings to the app open [general settings JSON file](/Settings/GeneralSettings.json), fill with missing data and insert to the database to Settings collection.

#### Tracker specific settings

There is 8 setting variables for tracker module.

Configuration values:

- Email address for receiving the weekly digest
- Days from due date email reminders are sent
- The number of days before a responses due date that its status changes to "Coming up"
- Count of elements on the audit log

Email notification templates:

- Weekly summary
- Tracker response assigned notification
- Response reminder notification
- Tracker review submitted notification

To import settings to the app open [tracker settings JSON file](/Settings/TrackerSettings.json), fill with missing data and insert to the database to Settings collection.

#### Audits specific settings

There is 11 setting variables for audits module.

Configuration values:

- Email address for receiving the weekly digest
- Email address for HSE notification
- Email address for estates notification
- The days of month when to send upcoming and missed audit notifications
- Retention period
- Count of elements on the audit log

Email notification templates:

- Weekly digest
- Action assigned notification
- HSE notification
- Mentioned notification
- Tracker review submitted notification

To import settings to the app open [audits settings JSON file](/Settings/AuditsSettings.json), fill with missing data and insert to the database to Settings collection.

## Run the app locally

To run and properly debug the app locally you will need to open two concurrent versions of VS Code, one for the API and one for the Client application.

Follow the instructions in the readme files for the API (Express) and Client (REACT) applications.


## Demo Scripts

A demo scripts Azure function has been built to assist with managing the demo environment, see the `Demo Database Scripts` readme file for more info.


## Node Upgrade release breaking changes
- We need to run the migration script `add-userId-field.ts` prior to deploying better-auth updates.
- We need to add CLIENT_URL, AZURE_AD_TENANT_ID, AZURE_AD_CLIENT_SECRET to the Express environment variables.
- Upgrade the app service to Node 22.
- Ensure pipelines are running Node 22.
- Add wildcard index `$**` to the `users` and `verification` collections in the database.
- Add new callback url to App registration in Azure with format `${API_URL}/api/auth/callback/microsoft`.