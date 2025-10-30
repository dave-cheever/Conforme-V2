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
param cosmosUseFreeTier bool = false

@description('Mongo DB name to create in the Cosmos account')
param cosmosDbName string = 'db-conforme'

@description('Storage account name (must be globally unique; 3-24 lowercase alphanumerics)')
param storageAccountName string

@description('Function App name')
param functionAppName string = 'functions-conforme'

@description('Create and connect Application Insights for Function App')
param createFunctionAppInsights bool = false

// (Removed unused app runtime configuration parameters)

var linuxNodeRuntime = 'NODE|22-lts'
// No LinuxFxVersion for Function Apps; use FUNCTIONS_* app settings instead

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

var storageAccountKey = storage.listKeys().keys[0].value
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

// Get Cosmos DB connection string (target specific Mongo database)
var cosmosAccountConnectionString = listConnectionStrings(cosmosId, '2023-04-15').connectionStrings[0].connectionString
var csQIndex = indexOf(cosmosAccountConnectionString, '?')
var csBase = substring(cosmosAccountConnectionString, 0, csQIndex)
var csQuery = substring(cosmosAccountConnectionString, csQIndex, length(cosmosAccountConnectionString) - csQIndex)
// Ensure we don't end up with a double slash before the database name
var csBaseLastChar = substring(csBase, sub(length(csBase), 1), 1)
var csBaseTrimmed = csBaseLastChar == '/' ? substring(csBase, 0, sub(length(csBase), 1)) : csBase
var cosmosConnectionString = '${csBaseTrimmed}/${cosmosDbName}${csQuery}'

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
      alwaysOn: true
      appCommandLine: 'pm2 serve /home/site/wwwroot --no-daemon --spa'
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
      alwaysOn: true
      appSettings: [
        {
          name: 'DB_CONNECTION_STRING'
          value: cosmosConnectionString
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

// Application Insights settings for Function App (computed only if created)
var aiFuncAppSettings = createFunctionAppInsights ? [
  {
    name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
    value: reference(aiFunc.id, '2020-02-02', 'full').properties.ConnectionString
  }
  {
    name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
    value: reference(aiFunc.id, '2020-02-02', 'full').properties.InstrumentationKey
  }
] : []

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
      appSettings: concat([
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'node'
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4'
        }
        {
          name: 'AzureWebJobsStorage'
          value: storageConnectionString
        }
        {
          name: 'MONGO_CONNECTION_STRING'
          value: cosmosConnectionString
        }
      ], aiFuncAppSettings)
    }
  }
}

// Outputs
output clientWebUrl string = 'https://${webAppNameClient}.azurewebsites.net'
output apiWebUrl string = 'https://${webAppNameAPI}.azurewebsites.net'
output functionAppUrl string = 'https://${functionAppName}.azurewebsites.net'
output cosmosAccountEndpoint string = reference(cosmosId, '2023-04-15').documentEndpoint
output storageConnection string = storageConnectionString

