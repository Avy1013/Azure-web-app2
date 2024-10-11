# Configure the Azure provider
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "3.0.0"
    }
  }
}
provider "azurerm" {
  features {}
}
# Create a resource group
resource "azurerm_resource_group" "cloudApp" {
  name     = "cloudApp"
  location = "centralindia"
}
# Create the Azure SQL Server
resource "azurerm_mssql_server" "cloudApp" {
  name                         = "avy1013"
  resource_group_name          = azurerm_resource_group.cloudApp.name
  location                     = azurerm_resource_group.cloudApp.location
  version                      = "12.0"
  administrator_login          = "sqladmin"  # Replace with your desired admin username
  administrator_login_password = "YourStrongPassword123!"  # Replace with a strong password
}
# Create the Azure SQL Database
resource "azurerm_mssql_database" "cloudApp" {
  name           = "Manhwa-app"
  server_id      = azurerm_mssql_server.cloudApp.id
  collation      = "SQL_Latin1_General_CP1_CI_AS"
  max_size_gb    = 32
  sku_name       = "GP_S_Gen5_2"
  zone_redundant = false
  auto_pause_delay_in_minutes = 60
  min_capacity                = 0.5
  read_scale                  = false
  storage_account_type        = "Local"
}

# Create Storage Account
resource "azurerm_storage_account" "storage" {
  name                     = "storageaccountappservice"
  resource_group_name       = azurerm_resource_group.cloudApp.name
  location                  = azurerm_resource_group.cloudApp.location
  account_tier              = "Standard"
  account_replication_type  = "LRS"
}

# Create Storage Container
resource "azurerm_storage_container" "container" {
  name                  = "blob-container"
  storage_account_name  = azurerm_storage_account.storage.name
  container_access_type = "private"
}

# Create App Service Plan (Premium SKU)
resource "azurerm_app_service_plan" "app_service_plan" {
  name                = "app-service-plan-premium"
  location            = azurerm_resource_group.cloudApp.location
  resource_group_name = azurerm_resource_group.cloudApp.name
  sku {
    tier = "PremiumV2"
    size = "P1v2"
  }
  kind = "Linux"
  reserved = true
}

# Create App Service (Linux Docker)
resource "azurerm_app_service" "app_service" {
  name                = "linux-docker-app"
  location            = azurerm_resource_group.cloudApp.location
  resource_group_name = azurerm_resource_group.cloudApp.name
  app_service_plan_id = azurerm_app_service_plan.app_service_plan.id

  site_config {
    linux_fx_version = "DOCKER|docker.io/avy1013/manhwa-app:amdv2"
  }

  app_settings = {
    WEBSITES_ENABLE_APP_SERVICE_STORAGE = "false"
  }
}

# Optionally, to upload a file to Blob Storage
resource "azurerm_storage_blob" "blob" {
  name                   = "example.txt"
  storage_account_name    = azurerm_storage_account.storage.name
  storage_container_name  = azurerm_storage_container.container.name
  type                    = "Block"
  source                  = "path/to/example.txt"  # Update with your file path
}

