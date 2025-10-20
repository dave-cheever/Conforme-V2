## Conforme Azure Bicep Deployment

This Bicep template provisions the core Azure resources for Conforme:

- App Service Plan (Linux)
- Client Web App (Linux)
- API Web App (Linux)
- Application Insights for client and API
- Cosmos DB (Mongo API) + Mongo database
- Storage Account
- Function App (Consumption Linux) with optional App Insights

### Files

- `main.bicep`: Main template
- `main.parameters.json`: Example parameters

### Prerequisites

- Azure CLI or Azure PowerShell
- Azure subscription and permissions to create resources

### Deploy

Using Azure CLI:

```bash
az group create -n rg-conforme-test -l uksouth
az deployment group create -g rg-conforme-test -f "Azure Deployment/bicep/main.bicep" -p "Azure Deployment/bicep/main.parameters.json"
```

Using Azure PowerShell:

```powershell
New-AzResourceGroup -Name rg-conforme-test -Location uksouth
New-AzResourceGroupDeployment -ResourceGroupName rg-conforme-test -TemplateFile "Azure Deployment/bicep/main.bicep" -TemplateParameterFile "Azure Deployment/bicep/main.parameters.json"
```

### Parameters to set

At minimum, set unique names and identity values:

- `cosmosAccountName`
- `storageAccountName`
- `webAppNameClient`, `webAppNameAPI`, `functionAppName`
- `clientUrl`, `apiUrl`
- `azureAdTenantId`, `azureAdClientId`, `azureAdClientSecret`, `tokenEndpoint`

Optional:

- `sendGridApiKey`, `emailSender`, `emailHandler`
- `conformeOrganizationId`
- `allowedDomains`

### Post-deployment

- Deploy the React client to `webAppNameClient`
- Deploy the Express API to `webAppNameAPI`
- Deploy Azure Functions to `functionAppName`
- Confirm app settings reflect your environment policies

### Notes

- Cosmos Free Tier can be enabled once per subscription
- Storage/Cosmos/WebApp names must be globally unique and meet Azure naming rules


