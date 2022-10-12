
<# 
.SYNOPSIS
    This script uses the Azure CLI to deploy an instance of the full Azure environment required for Conforme.

.DESCRIPTION 
    This script will deploy a full Conforme environment to Azure including App Service Plans, Web Apps, Databases, Storage Accounts, and Azure Functions.  It will also configure the Azure AD App and AD Groups and output all required IDs to allow Conforme to be configured.
 
.NOTES 
    The script is designed to be run as part of an Azure DevOps pipeline.  To run manually install the Azure CLI, then run 'az login' followed by 'az account set --subscription SUBNAME' where SUBNAME is the name of the subscription you wish to target.

.COMPONENT 
    Requires the Azure CLI to be installed.
 
.Parameter adAppName 
    Name of the Azure AD application to be registered. Default: Conforme Test

.Parameter adGroups 
    Comma separated list of group names to be created. Default: Conforme Test Access, Conforme Test Admin, Conforme Test Readers 

.Parameter resourceGroupName
    Name of the Azure Resource Group to be created. Default: rg-conforme-test 
    
.Parameter location
    Name of the Azure location in which to deploy all resources. Default: uksouth
    
.Parameter appServicePlanName
    Name of the App Service Plan to create/use.  Provide the name of an existing plan if required. Default: asp-conforme-test
    
.Parameter appServicePlanSku
    SKU to use for the app service plan. Default: B1
    
.Parameter webAppNameClient
    Name of the client web app to create. Default: conforme-test     

.Parameter webAppNameAPI
    Name of the API web app to create. Default: conforme-api-test

.Parameter dbAccountName
    Name of the CosmosDB account to create. Default: db-conforme-test
    
.Parameter dbUseFreeTier
    Use the free database tier (can only be used once per subscription.) True/False. Default: true

.Parameter dbName
    Name of the database to be created. Default: db-conforme-test

.Parameter storageName
    Name of the storage account to be created. Default: storconformetest

.Parameter functionAppName
    Name of the function app to be created. Default: functions-conforme-test

.Parameter tags
    Set of tags to be added to all the resources created by the script. Default: storconformetest
#>
[CmdletBinding()]
[Alias()]
param (
    [parameter(Mandatory=$false)]
    [String]$adAppName = "Conforme Test",
    [parameter(Mandatory=$false)]
    [String]$adGroups = "Conforme Test Access, Conforme Test Admin, Conforme Test Readers",
    [parameter(Mandatory=$false)]
    [String]$resourceGroupName = "rg-conforme-test",
    [parameter(Mandatory=$false)]
    [String]$location = "uksouth",
    [parameter(Mandatory=$false)]
    [String]$appServicePlanName = "asp-conforme-test",
    [parameter(Mandatory=$false)]
    [String]$appServicePlanSku = "B1",
    [parameter(Mandatory=$false)]    
    [String]$webAppNameClient = "conforme-test",
    [parameter(Mandatory=$false)]    
    [String]$webAppNameAPI = "conforme-api-test",
    [parameter(Mandatory=$false)]    
    [String]$dbAccountName = "db-conforme-test",
    [parameter(Mandatory=$false)]    
    [String]$dbUseFreeTier = "true",
    [parameter(Mandatory=$false)]    
    [String]$dbName = "db-conforme-test",
    [parameter(Mandatory=$false)]    
    [String]$storageName = "storconformetest",
    [parameter(Mandatory=$false)]    
    [String]$functionAppName = "functions-conforme-test",
    [parameter(Mandatory=$false)]    
    [String]$tags = "Product=Conforme"
)

# Check CLI version and ensure account and health extensions are installed
Write-Host "Configuring Azure CLI" -ForegroundColor Yellow
$version = az --version
$extAcc = az extension add --name account
$extHealth = az extension add --name healthcareapis
$extAppIsnights = az extension add --name application-insights
$hcRegister = az provider register --namespace 'Microsoft.HealthcareApis'
# az provider show --namespace Microsoft.HealthcareApis --query "resourceTypes[?resourceType=='services'].locations"

# Set the CLI default location
az configure --defaults location=$location
Write-Host ""
Write-Host ""

# Header
Write-Host ""
Write-Host ""
Write-Host "AZURE DEPLOYMENT FOR CONFORME"
Write-Host "============================="
Write-Host ""
Write-Host ""

# Check account details
Write-Host "Confirming Account Details" -ForegroundColor Yellow
$acc = az account show | ConvertFrom-Json
$accName = $acc.name
$tenantId = $acc.tenantId
Write-Host "Account name: $accName"
Write-Host "Tenant Id: $tenantId"
Write-Host ""
Write-Host ""

# Register Azure AD App
Write-Host "1. Registering Azure AD Application" -ForegroundColor Cyan
Write-Host "Name: $adAppName" -ForegroundColor Gray
$adAppList = az ad app list --display-name $adAppName | ConvertFrom-Json
$adAppExists = $adAppList.Length -eq 1
if ($adAppExists) {
    $app = $adAppList[0]
    echo "Found AD App - $adAppName"
} elseif ($adAppList.Length -eq 0) {
    echo "Creating AD App - $adAppName"
    $app = az ad app create --display-name $adAppName | ConvertFrom-Json
} else {
    Write-Error "More than 1 app exists in Azure AD named $adAppName - please check this."
    return
}
$appId = $app.appId
$objectId = $app.id
# Add a client secret with expiration
$adAppSecretList = az ad app credential list --id $appId | ConvertFrom-Json
$adAppSecretExists = $adAppList.Length -eq 1
if ($adAppSecretExists) {
   echo "An app secret already exists for this app.  If you wish to recreate it then manually delete the existing app secret first."
   $clientSecret = "HIDDEN" 
} else {
    $clientSecret = az ad app credential reset --id $appId --append --display-name $adAppName --years 2 --query password | ConvertFrom-JSON
    if (!$clientSecret) {
        Write-Error "Error creating client secret."
        return
    } 
}
# Output variables for use in Conforme App configuration
Write-Host "Tenant Id: $tenantId"
echo "AAD app client ID: $appId"
echo "AAD app client secret: $clientSecret"
echo "AAD app client secret expiry: 2 years"
echo ""
echo ""


# Create Azure AD Groups
Write-Host "2. Creating Azure AD Groups" -ForegroundColor Cyan
$groups = $adGroups.Split(',')
foreach ($group in $groups) {
    $group = $group.Trim()
    Write-Host "Name: $group" -ForegroundColor Gray
    $groupList = az ad group list --display-name $group | ConvertFrom-Json
    $groupExists = $groupList.Length -gt 0
    if ($groupExists) {
        echo "$group already exists"
        $adGroup = az ad group show --group $group | ConvertFrom-Json
    } else {
        $mailNickname = $group.Replace(" ","")
        $adGroup = az ad group create --display-name $group --mail-nickname $mailNickName | ConvertFrom-Json
        if (!$adGroup) {
            Write-Error "Error creating AD Group."
            return
        } 
    }
    $groupId = $adGroup.id
    Write-Host "Id: $groupId"
    echo ""
}
echo ""

# Create Resource Group
Write-Host "3. Creating resource group" -ForegroundColor Cyan
Write-Host "Name: $resourceGroupName" -ForegroundColor Gray
$rgExists = az group exists --name $resourceGroupName
if ($rgExists -eq "true") {
    echo "$resourceGroupName already exists." 
} else {
    $result = az group create --name $resourceGroupName | ConvertFrom-Json
    if (!$result) {
        Write-Error "Error creating Resource Group."
        return
    }
}
echo ""
echo ""

# Create an App Service plan
Write-Host "4. Creating app service plan" -ForegroundColor Cyan
Write-Host "Name: $appServicePlanName" -ForegroundColor Gray
Write-Host "SKU: $appServicePlanSku" -ForegroundColor Gray
$aspList = az appservice plan list --query "[?name=='$appServicePlanName']" | ConvertFrom-Json
$aspExists = $aspList.Length -gt 0
if ($aspExists) {
    echo "$appServicePlanName already exists."   
} else {
    $result = az appservice plan create --name $appServicePlanName --resource-group $resourceGroupName --is-linux --sku $appServicePlanSku | ConvertFrom-Json
    if (!$result) {
        Write-Error "Error creating App Service Plan."
        return
    }
}
# Add tags
$resourceId = az resource show -g $resourceGroupName -n $appServicePlanName --resource-type microsoft.Web/serverFarms --query "id" --output tsv
if (!$aspExists) {
    Write-Host "Creating tags"
    $tagResult = az tag create --resource-id $resourceId --tags $tags
} else {
    Write-Host "Updating tags"
    $tagResult = az tag update --resource-id $resourceId --operation Merge --tags $tags
}
echo ""
echo ""

# Create Client Web App
Write-Host "5. Creating client web app" -ForegroundColor Cyan
Write-Host "Name: $webAppNameClient" -ForegroundColor Gray
$webAppList = az webapp list --query "[?name=='$webAppNameClient']" | ConvertFrom-Json
$webAppExists = $webAppList.Length -gt 0
if ($webAppExists) {
    echo "$webAppNameClient already exists."
} else {
    $result = az webapp create --name $webAppNameClient --resource-group $resourceGroupName --plan $appServicePlanName --runtime "NODE:16-lts" | ConvertFrom-Json
    if (!$result) {
        Write-Error "Error creating Client Web App."
        return
    }
}
# Add tags
$resourceId = az resource show -g $resourceGroupName -n $webAppNameClient --resource-type microsoft.Web/sites --query "id" --output tsv
if (!$webAppExists) {
    Write-Host "Creating tags"
    $tagResult = az tag create --resource-id $resourceId --tags $tags
} else {
    Write-Host "Updating tags"
    $tagResult = az tag update --resource-id $resourceId --operation Merge --tags $tags
}
# Create app insights
$result = az monitor app-insights component create --app $webAppNameClient --kind web -g $resourceGroupName --application-type web | ConvertFrom-Json
if (!$result) {
    Write-Error "Error creating app insights"
    return
} 
$result = az monitor app-insights component connect-webapp -g $resourceGroupName -a $webAppNameClient --web-app $webAppNameClient | ConvertFrom-Json
if (!$result) {
    Write-Error "Error connecting app insights"
    return
} else {
    echo "Created app insights and connected to $webAppNameClient"
}
echo ""
echo ""


# Create API App Service
Write-Host "6. Creating api web app" -ForegroundColor Cyan
Write-Host "Name: $webAppNameAPI" -ForegroundColor Gray
$webAppList = az webapp list --query "[?name=='$webAppNameAPI']" | ConvertFrom-Json
$webAppExists = $webAppList.Length -gt 0
if ($webAppExists) {
    echo "$webAppNameAPI already exists."
} else {
    $result = az webapp create --name $webAppNameAPI --resource-group $resourceGroupName --plan $appServicePlanName --runtime "NODE:16-lts" | ConvertFrom-Json
    if (!$result) {
        Write-Error "Error creating API Web App."
        return
    }
}
# Add tags
$resourceId = az resource show -g $resourceGroupName -n $webAppNameAPI --resource-type microsoft.Web/sites --query "id" --output tsv
if (!$webAppExists) {
    Write-Host "Creating tags"
    $tagResult = az tag create --resource-id $resourceId --tags $tags
} else {
    Write-Host "Updating tags"
    $tagResult = az tag update --resource-id $resourceId --operation Merge --tags $tags
}
# Create app insights
$result = az monitor app-insights component create --app $webAppNameAPI --kind web -g $resourceGroupName --application-type web | ConvertFrom-Json
if (!$result) {
    Write-Error "Error creating app insights"
    return
} 
$result = az monitor app-insights component connect-webapp -g $resourceGroupName -a $webAppNameAPI --web-app $webAppNameAPI | ConvertFrom-Json
if (!$result) {
    Write-Error "Error connecting app insights"
    return
} else {
    echo "Created app insights and connected to $webAppNameAPI"
}
echo ""
echo ""

# Create CosmosDB Account
Write-Host "7. Creating cosmos db account" -ForegroundColor Cyan
Write-Host "Name: $dbAccountName" -ForegroundColor Gray
Write-Host "Use free tier: $dbUseFreeTier" -ForegroundColor Gray
$dbAccountList = az cosmosdb list --query "[?name=='$dbAccountName']" | ConvertFrom-Json
$dbAccountExists = $dbAccountList.Length -gt 0
if ($dbAccountExists) {
    echo "$dbAccountName already exists."
} else {
    $useFreeTier = [System.Convert]::ToBoolean($dbUseFreeTier)
    $result = ""
    if ($useFreeTier) {
        $result = az cosmosdb create --name $dbAccountName --resource-group $resourceGroupName --kind MongoDB --server-version "4.0" --enable-free-tier | ConvertFrom-Json
    } else {
        $result = az cosmosdb create --name $dbAccountName --resource-group $resourceGroupName --kind MongoDB --server-version "4.0" | ConvertFrom-Json
    }
    if (!$result) {
        Write-Error "Error creating Database Account."
        return
    }
}
# Add tags
$resourceId = az resource show -g $resourceGroupName -n $dbAccountName --resource-type microsoft.DocumentDb/databaseAccounts --query "id" --output tsv
if (!$dbAccountExists) {
    Write-Host "Creating tags"
    $tagResult = az tag create --resource-id $resourceId --tags $tags
} else {
    Write-Host "Updating tags"
    $tagResult = az tag update --resource-id $resourceId --operation Merge --tags $tags
}
echo ""
# List connection strings
echo "Database Connection Strings: "
$cstrings = az cosmosdb keys list --name $dbAccountName --resource-group $resourceGroupName --type connection-strings | ConvertFrom-Json
foreach ($cstring in $cstrings.connectionStrings) {
    echo $cstring.connectionString
}
echo ""
echo ""


# Create CosmosDB MongoDB Database
Write-Host "8. Creating cosmos db" -ForegroundColor Cyan
Write-Host "Name: $dbName" -ForegroundColor Gray
$dbExists = az cosmosdb mongodb database exists --name $dbName --resource-group $resourceGroupName --account-name $dbAccountName
if ($dbExists -eq "true") {
    echo "$dbName already exists."
} else {
    $result = az cosmosdb mongodb database create --name $dbName --account-name $dbAccountName --resource-group $resourceGroupName --max-throughput 4000 | ConvertFrom-Json
    if (!$result) {
        Write-Error "Error creating Database."
        return
    }
}
echo ""
echo ""


# Create Storage Account
Write-Host "9. Creating cosmos db" -ForegroundColor Cyan
Write-Host "Name: $storageName" -ForegroundColor Gray
$storageList = az storage account list --query "[?name=='$storageName']" | ConvertFrom-Json
$storageExists = $storageList.Length -gt 0
if ($storageExists) {
    echo "$storageName already exists."
} else {
    $result = az storage account create --name $storageName --location "$location" --resource-group $resourceGroupName --sku "Standard_LRS" | ConvertFrom-Json
    if (!$result) {
        Write-Error "Error creating Storage Account."
        return
    }
}
# Add tags
$resourceId = az resource show -g $resourceGroupName -n $storageName --resource-type Microsoft.Storage/storageAccounts --query "id" --output tsv
if (!$storageExists) {
    Write-Host "Creating tags"
    $tagResult = az tag create --resource-id $resourceId --tags $tags
} else {
    Write-Host "Updating tags"
    $tagResult = az tag update --resource-id $resourceId --operation Merge --tags $tags
}
echo ""
echo ""


# Create Azure Function App
Write-Host "10. Creating function app" -ForegroundColor Cyan
Write-Host "Name: $functionAppName" -ForegroundColor Gray
$functionAppList = az functionapp list --query "[?name=='$functionAppName']" | ConvertFrom-Json
$functionAppExists = $functionAppList.Length -gt 0
if ($functionAppExists) {
    echo "$functionAppName already exists."
} else {
    $result = az functionapp create --name $functionAppName --storage-account $storageName --consumption-plan-location "$location" --resource-group $resourceGroupName --functions-version 4 --runtime node --runtime-version 14 | ConvertFrom-Json
    if (!$result) {
        Write-Error "Error creating Function App."
        return
    }
}
# Add tags
$resourceId = az resource show -g $resourceGroupName -n $functionAppName --resource-type microsoft.Web/sites --query "id" --output tsv
if (!$functionAppExists) {
    Write-Host "Creating tags"
    $tagResult = az tag create --resource-id $resourceId --tags $tags
} else {
    Write-Host "Updating tags"
    $tagResult = az tag update --resource-id $resourceId --operation Merge --tags $tags
}
echo ""
echo ""