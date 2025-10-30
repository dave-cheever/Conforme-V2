// Conforme Azure Infrastructure - Bicep
// Resources: App Service Plan (Linux), Client Web App, API Web App,
// Application Insights for both apps, Cosmos DB (Mongo API) + Mongo DB,
// Storage Account, Function App (Consumption Linux), optional App Insights for Functions.

@description('Azure region for all resources')
param location string = resourceGroup().location

@description('Tags to apply to all resources')
param tags object = {
  Product: 'Conforme'
}

@description('App Service Plan name (Linux)')
param appServicePlanName string = 'asp-conforme'

@description('App Service Plan SKU, e.g. B1, P1v3')
param appServicePlanSku string = 'B1'

@description('Client Web App name')
param webAppNameClient string = 'conforme-client'

@description('API Web App name')
param webAppNameAPI string = 'conforme-api'

@description('Cosmos DB account name (must be globally unique; only lowercase letters and numbers)')
param cosmosAccountName string

@description('Use existing Cosmos DB account instead of creating a new one')
param cosmosAccountIsExisting bool = false

@description('Use Cosmos DB Free Tier (can be used once per subscription)')
param cosmosUseFreeTier bool = true

@description('Mongo DB name to create in the Cosmos account')
param cosmosDbName string = 'db-conforme'

@description('Storage account name (must be globally unique; 3-24 lowercase alphanumerics)')
param storageAccountName string

@description('Function App name')
param functionAppName string = 'functions-conforme'

@description('Create and connect Application Insights for Function App')
param createFunctionAppInsights bool = false

// App/runtime configuration
@description('Environment name for apps (dev/test/production)')
param appEnv string = 'production'

@description('Semicolon delimited list of allowed CORS/tenant domains')
param allowedDomains string = ''

@description('Public client URL, e.g. https://conforme-client.azurewebsites.net')
param clientUrl string

@description('Public API base URL, e.g. https://conforme-api.azurewebsites.net')
param apiUrl string

@description('Azure AD Tenant ID used by Microsoft login')
param azureAdTenantId string

@description('Azure AD App (client) ID used by Microsoft login')
param azureAdClientId string

@secure()
@description('Azure AD App client secret used by Microsoft login')
param azureAdClientSecret string

@description('Microsoft Graph base URL')
param msGraphUrl string = 'https://graph.microsoft.com/v1.0'

@description('Microsoft Graph OAuth scope')
param msGraphScope string = 'https://graph.microsoft.com/.default'

@description('OAuth token endpoint for tenant (e.g. https://login.microsoftonline.com/<tenant>/oauth2/v2.0/token)')
param tokenEndpoint string

@description('SendGrid API key (Functions notifications)')
@secure()
param sendGridApiKey string = ''

@description('Email sender address (Functions notifications)')
param emailSender string = ''

@description('Email handler (SendGrid, etc.)')
param emailHandler string = 'sendgrid'

@description('Scheduled notifications start hour (local)')
param scheduledStartHour int = 7

@description('Scheduled notifications end hour (local)')
param scheduledEndHour int = 20

@description('Scheduled notifications frequency in hours')
param scheduledFrequencyHours int = 3

@description('Optional organization ID used by Functions')
param conformeOrganizationId string = ''

@description('Application version marker for API')
param apiVersion string = 'v1'

var linuxNodeRuntime = 'NODE|16-lts'
var linuxFunctionsNodeRuntime = 'NODE|14'

// App Service Plan (Linux)
resource plan 'Microsoft.Web/serverFarms@2022-09-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: appServicePlanSku
  }
  kind: 'linux'
  tags: tags
  properties: {
    reserved: true // Linux
  }
}

// Application Insights for Client Web App
resource aiClient 'microsoft.insights/components@2020-02-02' = {
  name: webAppNameClient
  location: location
  kind: 'web'
  tags: tags
  properties: {
    Application_Type: 'web'
  }
}

// Application Insights for API Web App
resource aiApi 'microsoft.insights/components@2020-02-02' = {
  name: webAppNameAPI
  location: location
  kind: 'web'
  tags: tags
  properties: {
    Application_Type: 'web'
  }
}

// Storage Account
resource storage 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  tags: tags
  properties: {
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: false
    supportsHttpsTrafficOnly: true
  }
}

var storageAccountKey = listKeys(storage.id, '2022-09-01').keys[0].value
var storageConnectionString = 'DefaultEndpointsProtocol=https;AccountName=${storage.name};AccountKey=${storageAccountKey};EndpointSuffix=${environment().suffixes.storage}'

// Cosmos DB Account (Mongo API) - reference existing or create new
resource cosmosExisting 'Microsoft.DocumentDB/databaseAccounts@2023-04-15' existing = if (cosmosAccountIsExisting) {
  name: cosmosAccountName
}

resource cosmosNew 'Microsoft.DocumentDB/databaseAccounts@2023-04-15' = if (!cosmosAccountIsExisting) {
  name: cosmosAccountName
  location: location
  kind: 'MongoDB'
  tags: tags
  properties: {
    databaseAccountOfferType: 'Standard'
    enableFreeTier: cosmosUseFreeTier
    locations: [
      {
        locationName: location
        failoverPriority: 0
        isZoneRedundant: false
      }
    ]
    capabilities: [
      {
        name: 'EnableMongo'
      }
    ]
    apiProperties: {
      serverVersion: '4.0'
    }
    publicNetworkAccess: 'Enabled'
  }
}

var cosmosId = cosmosAccountIsExisting ? cosmosExisting.id : cosmosNew.id

// Mongo Database (autoscale maxThroughput)
resource mongoDb 'Microsoft.DocumentDB/databaseAccounts/mongodbDatabases@2023-04-15' = {
  name: '${cosmosAccountName}/${cosmosDbName}'
  properties: {
    resource: {
      id: cosmosDbName
    }
    options: {
      autoscaleSettings: {
        maxThroughput: 4000
      }
    }
  }
  dependsOn: cosmosAccountIsExisting ? [] : [cosmosNew]
}

var cosmosConnectionStrings = listConnectionStrings(cosmosId, '2023-04-15')
var mongoConnectionString = cosmosConnectionStrings.connectionStrings[0].connectionString

// Client Web App (Linux)
resource clientWeb 'Microsoft.Web/sites@2022-09-01' = {
  name: webAppNameClient
  location: location
  kind: 'app,linux'
  tags: tags
  properties: {
    httpsOnly: true
    serverFarmId: plan.id
    siteConfig: {
      linuxFxVersion: linuxNodeRuntime
      alwaysOn: false
      appSettings: [
        // App Insights
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: aiClient.properties.ConnectionString
        }
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: aiClient.properties.InstrumentationKey
        }
        // Common
        {
          name: 'APPSETTING_NODE_ENV'
          value: appEnv
        }
        {
          name: 'CLIENT_URL'
          value: clientUrl
        }
        {
          name: 'API_URL'
          value: apiUrl
        }
      ]
    }
  }
}

// API Web App (Linux)
resource apiWeb 'Microsoft.Web/sites@2022-09-01' = {
  name: webAppNameAPI
  location: location
  kind: 'app,linux'
  tags: tags
  properties: {
    httpsOnly: true
    serverFarmId: plan.id
    siteConfig: {
      linuxFxVersion: linuxNodeRuntime
      alwaysOn: false
      appSettings: [
        // App Insights
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: aiApi.properties.ConnectionString
        }
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: aiApi.properties.InstrumentationKey
        }
        // API configuration
        {
          name: 'APPSETTING_NODE_ENV'
          value: appEnv
        }
        {
          name: 'ALLOWED_DOMAINS'
          value: allowedDomains
        }
        {
          name: 'CLIENT_URL'
          value: clientUrl
        }
        {
          name: 'API_URL'
          value: apiUrl
        }
        {
          name: 'DB_CONNECTION_STRING'
          value: mongoConnectionString
        }
        // Auth
        {
          name: 'AZURE_AD_TENANT_ID'
          value: azureAdTenantId
        }
        {
          name: 'AZURE_AD_CLIENT_ID'
          value: azureAdClientId
        }
        {
          name: 'AZURE_AD_CLIENT_SECRET'
          value: azureAdClientSecret
        }
        // Graph
        {
          name: 'GRAPH_URL'
          value: msGraphUrl
        }
        // Misc
        {
          name: 'VERSION'
          value: apiVersion
        }
      ]
    }
  }
}

// Function App Hosting Plan (Consumption - Dynamic)
resource funcPlan 'Microsoft.Web/serverFarms@2022-09-01' = {
  name: 'plan-${functionAppName}'
  location: location
  kind: 'functionapp'
  sku: {
    name: 'Y1'
    tier: 'Dynamic'
  }
  tags: tags
}

// Optional App Insights for Function App
resource aiFunc 'microsoft.insights/components@2020-02-02' = if (createFunctionAppInsights) {
  name: functionAppName
  location: location
  kind: 'web'
  tags: tags
  properties: {
    Application_Type: 'web'
  }
}

// Function App (Linux, Node)
resource functionApp 'Microsoft.Web/sites@2022-09-01' = {
  name: functionAppName
  location: location
  kind: 'functionapp,linux'
  tags: tags
  properties: {
    httpsOnly: true
    serverFarmId: funcPlan.id
    siteConfig: {
      linuxFxVersion: linuxFunctionsNodeRuntime
      appSettings: [
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'node'
        }
        {
          name: 'AzureWebJobsStorage'
          value: storageConnectionString
        }
        // Optional AI
        if (createFunctionAppInsights) {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: aiFunc.properties.ConnectionString
        }
        if (createFunctionAppInsights) {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: aiFunc.properties.InstrumentationKey
        }
        // Functions configuration (from ConfigService.ts expectations)
        {
          name: 'ENV'
          value: appEnv
        }
        {
          name: 'DEBUG'
          value: toLower(appEnv) == 'dev' ? 'true' : 'false'
        }
        {
          name: 'MS_GRAPH_SCOPE'
          value: msGraphScope
        }
        {
          name: 'MS_GRAPH_URL'
          value: msGraphUrl
        }
        {
          name: 'TOKEN_ENDPOINT'
          value: tokenEndpoint
        }
        {
          name: 'MONGO_CONNECTION_STRING'
          value: mongoConnectionString
        }
        {
          name: 'EMAIL_SENDER'
          value: emailSender
        }
        {
          name: 'EMAIL_HANDLER'
          value: emailHandler
        }
        if (!empty(sendGridApiKey)) {
          name: 'SEND_GRID_API_KEY'
          value: sendGridApiKey
        }
        {
          name: 'SCHEDULED_NOTIFICATIONS_START_HOUR'
          value: string(scheduledStartHour)
        }
        {
          name: 'SCHEDULED_NOTIFICATIONS_END_HOUR'
          value: string(scheduledEndHour)
        }
        {
          name: 'SCHEDULED_NOTIFICATIONS_FREQUENCY'
          value: string(scheduledFrequencyHours)
        }
        if (!empty(conformeOrganizationId)) {
          name: 'CONFORME_ORGANIZATION_ID'
          value: conformeOrganizationId
        }
        {
          name: 'API_URL'
          value: apiUrl
        }
      ]
    }
  }
  dependsOn: [storage]
}

// Outputs
output clientWebUrl string = 'https://${webAppNameClient}.azurewebsites.net'
output apiWebUrl string = 'https://${webAppNameAPI}.azurewebsites.net'
output functionAppUrl string = 'https://${functionAppName}.azurewebsites.net'
output cosmosAccountEndpoint string = reference(cosmosId, '2023-04-15').documentEndpoint
output storageConnection string = storageConnectionString

