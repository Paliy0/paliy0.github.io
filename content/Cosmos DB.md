---
share: true
title: Cosmos DB
description: Optional summary
date: 2026-04-12
tags:
  - tag1
  - tag2
category: cloud/db
---

# Evolution from DocumentDB
- NoSQL
- “Unlimited” scale and throughput
- CosmosDB: multi-model
  - Document 
  - Tables
  - Graph
  - Columnar

## Types
- **Document**: as with MongoDB
- **Tables**: key-value
- **Graph**: [Watch Video](https://www.youtube.com/watch?v=98PtbE4f4B8&ab_channel=WintellectNOW)

### Data Models and APIs
- **SQL API**: JSON docs (SQL query – kind of)
- **MongoDB API**: BSON docs (MongoDB query)
- **Table API**: Azure Table Storage (key-value)
- **Gremlin API**: Graph 
- **Columnar API**: Cassandra (Schema!!)

### Data Modelling
- **Document database**: key-value pairs
- CosmosDB has 2 options for document databases: SQL API and MongoDB

| **Relational**    | **Document** |
| ----------------- | ------------ |
| Rows              | Document (JSON) |
| Columns           | Properties  |
| Schema            | Not always  |

- Basic premise: avoid duplication, each distinct entity per table (i.e., denormalization)
  - Strive to denormalize
  - 1 to N is now expressed as an object array
  - JSON can now be serialized into an object easily and back
  - Embedding improves read operations
  - Referencing improves write operations
  - Performance supersedes normalization  

> **Writes are more expensive than reads**  
Split the properties that are written into a separate document – RU (Request Units) increases.

- [Data Modelling and Performance Example](https://www.slideshare.net/adiazcan/sql-saturday-madrid-2019-data-model-with-azure-cosmos-db)

### To Embed or to Reference?
- **Embed** when:
  - 1:1 relationship
  - 1:few relationship
  - Related items are queried or updated together
- **Reference** when:
  - 1:many relationship
  - Many:many relationship
  - Related items are queried or updated separately

### When to Use What
- **Relational SQL**: When data is structured and business logic is highly coupled.
- **CosmosDB**: When data is (partially) non-structured, flexible format, and easier to scale horizontally.

## Measuring Performance: Latency & Throughput
- **Latency**: How long do I have to wait?
  - Solution: Closer to consumer, global distribution.
- **Throughput**: How many client requests per second?
  - Request Unit (RU): Performance currency abstracting system resources (CPU, IOPS, memory) required for database operations.
  
### Throughput and RU Charge
- Writing requires more RUs than reading.
- Complex queries require multiple RUs.
- RU != Request.
- RU charges shown in the header, available programmatically via the `RequestCharge` property.

### Throughput
- Point read (fetching a single item by its ID and partition key value for a 1 KB item) costs 1 RU.
- **Predictable cost?** Specify RUs during container creation (provisioned throughput).
- CosmosDB throttles if exceeded (HTTP 429), retry time shown in response header.
- **Serverless**: Pay only for RUs consumed (approx. 25c per million RUs).

### Throughput Per Container
- RUs are distributed across containers:
  - One container just for reads (low RU).
  - Another container only for writes (high RU).

## Horizontal Partitioning in CosmosDB
Partitioning allows for scaling:
- Container (logical resource) with multiple physical partitions.
- A partition is like a data bucket with its own resources.
- If the partition is full, it splits, transferring data to a new partition.
- Partitions are replicated within and across nodes.

### Partition Keys
- Good partition key enables scaling.
- Example: Using `UserId`, `CustomerID`, `TeamId`.
- Immutable, but in-place migrations possible by removing and re-inserting documents.
- Defines the logical partition key that groups data together.

### Logical Partitioning
- Groups items with the same partition key.
- Example: A foodGroup property used as a partition key groups similar items.

### Physical and Logical Partition Keys
- Max doc size: 2 MB.
- Max logical partition size: 20 GB.
- Partition splits when full, distributing data.

### Queries in CosmosDB
- SQL-like syntax (`SELECT`, `FROM`, `GROUP BY`, `ORDER BY`, `WHERE`).
- Based on JSON, uses dot notation to enter subsections of documents.
- Supports document joins (inner joins in SQL).
- [Indexing](https://learn.microsoft.com/en-us/azure/cosmos-db/index-overview)
- Uses LINQ in the .NET world.
- [Query Examples](https://learn.microsoft.com/en-us/azure/cosmos-db/sql/sql-query-getting-started)



![[Pasted image 20241024225312.png|Pasted image 20241024225312.png]]


# CosmosDB Service Implementation

## Service Interfaces

### Basic Interface
```csharp
public interface ICosmosDbService
{
    Task<IEnumerable<Item>> GetMultipleAsync(string query);
    Task<Item> GetAsync(string id);
    Task AddAsync(Item item);
    Task UpdateAsync(string id, Item UpdateItem);
    Task DeleteAsync(string id);
}
```

### Generic Interface
```csharp
public interface ICosmosDbService<T> where T : class
{
    Task<IEnumerable<T>> GetMultipleAsync(string query);
    Task<T> GetAsync(string id);
    Task AddAsync(T item);
    Task UpdateAsync(string id, T UpdateItem);
    Task DeleteAsync(string id);
}
```

## Service Implementation

### Initialization
```csharp
private static async Task<CosmosDbService> InitializeCosmosClientInstanceAsync(IConfigurationSection configurationSection)
{
    var databaseName = configurationSection["DatabaseName"];
    var containerName = configurationSection["ContainerName"];
    var account = configurationSection["Account"];
    var key = configurationSection["Key"];
    
    var client = new Microsoft.Azure.Cosmos.CosmosClient(account, key);
    var database = await client.CreateDatabaseIfNotExistsAsync(databaseName);
    await database.Database.CreateContainerIfNotExistsAsync(containerName, "/id");
    
    var cosmosDbService = new CosmosDbService(client, databaseName, containerName);
    return cosmosDbService;
}
```

### CRUD Operations
```csharp
public async Task AddAsync(Item item)
{
    await _container.CreateItemAsync(item, new PartitionKey(item.id));
}

public async Task DeleteAsync(string id)
{
    await _container.DeleteItemAsync<Item>(id, new PartitionKey(id));
}

public async Task<Item> GetAsync(string id)
{
    ItemResponse<Item> response = null;
    try
    {
        response = await _container.ReadItemAsync<Item>(id, new PartitionKey(id));
    }
    catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
    {
        //log(ex.Message)}
    }
    return response;
}
```

## Entity Framework Integration

### Order Context Configuration
```csharp
public class OrderContext : DbContext
{
    public DbSet<Order> Orders { get; set; }

    //DONT FORGET TO NUGET INSTALL: Install-Package Microsoft.EntityFrameworkCore.Cosmos
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseCosmos(
            "https://localhost:8081",
            "C2yGvDjf5/R+ob0N8A7Cgv30VRDJ1WEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==",
            databaseName: "OrdersDB");
}
```

# CosmosDB EF Core Configuration and Usage

## Model Configuration
```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.HasDefaultContainer("Store");
    
    modelBuilder.Entity<Order>()
        .ToContainer("Orders");
    
    modelBuilder.Entity<Order>()
        .HasNoDiscriminator();
    
    modelBuilder.Entity<Order>()
        .HasPartitionKey(o => o.PartitionKey);
    
    modelBuilder.Entity<Order>()
        .UseETagConcurrency();
    
    modelBuilder.Entity<Order>().OwnsOne(
        o => o.ShippingAddress,
        sa =>
        {
            sa.ToJsonProperty("Address");
            sa.Property(p => p.Street).ToJsonProperty("ShipsToStreet");
            sa.Property(p => p.City).ToJsonProperty("ShipsToCity");
        });
}
```

## Usage Examples

### Example 1: Adding a New Order
```csharp
using (var context = new OrderContext())
{
    context.Add(
        new Order
        {
            Id = 1,
            ShippingAddress = new ShippingAddress { City = "London", Street = "221 B Baker St" },
            PartitionKey = "1"
        });

    await context.SaveChangesAsync();
}
```

### Example 2: Adding Order Through DbSet
```csharp
using (var context = new OrderContext())
{
    //NB - make sure understated code is executed
    context.Orders.Add(
        new Order
        {
            Id = 1,
            ShippingAddress = new ShippingAddress { City = "London", Street = "221 B Baker St" },
            PartitionKey = "1"
        });

    await context.SaveChangesAsync();
}
```


# Resources

https://github.com/frankdersjant/CosmosDBEF
Watch: 
https://www.youtube.com/watch?v=zQC9D00pr6I&ab_channel=dotNET
https://www.youtube.com/watch?v=j5ylkjbJmu4&ab_channel=CuriousDrive
Samples
 https://github.com/Azure/azure-cosmos-dotnet-v3/tree/master/Microsoft.Azure.Cosmos.Samples/Usage
https://blog.jeremylikness.com/blog/azure-cosmos-db-with-ef-core-on-blazor-server/

