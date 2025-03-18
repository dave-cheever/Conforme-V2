# Demo Database Scripts
These scripts are built just for the demo environment. 

They are hosted in an Azure function [Demo Script Azure function](https://fa-conforme-db-scripts.azurewebsites.net/api), giving anyone with the API key the ability to execute the scripts.


## Script 1 - /seedDatabase

This script allows you to copy any database from within the `db-demos-shared-cosmos-mongo` instance in the `Cielo Costa Demos` tenant, to another database within that instance. It deletes all data in the destination database prior to importing the source database.

The purpose of this is so that we can populate for example **seed-conforme-demo** with a nice selection of demo data. We can then copy this to **conforme-demo-db**, use it, spoil the data, and then reset it by once again running the script.

You need to pass three parameters to the azure function for it to execute:

 - code = **API key from Azure function**
 - sourceDb = **seed-conforme-demo**
 - destinationDb = **conforme-demo-db**

An example call -> https://fa-conforme-db-scripts.azurewebsites.net/api/seedDatabase?code={API_KEY}&sourceDb=seed-conforme-demo-db&destinationDb=conforme-demo-db

We currently have two seed databases, built with the intention they can be used to store seed test data.
- `seed-conforme-demo`
- `see-aat-demo`

We could create more seed databases with tailored data if we wanted. For instance, a seed database containing H&S focussed data and another contaning controlled document focussed data.

