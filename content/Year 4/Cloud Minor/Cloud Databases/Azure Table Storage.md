---
title: Azure Table Storage
description: "Azure Table Storage is a NoSQL key-value store offering schema-less data storage with high scalability and fast write access capabilities."
date: 2024-10-16
tags:
  - azure
  - table-storage
  - nosql
  - database
---

## Basic Concepts

### Entity Structure

- Rows are called "Entities"
- Maximum 255 properties per row
- Core components:
  - Partition key
  - Row key
  - Timestamp
  - ETag (for optimistic concurrency)
  - Data

### Key Characteristics

- Schema-less design (no enforced schemas)
- "Write and Forget JSON" approach
- Performance characteristics:
  - Fast write access with known Partition Key and Row key
  - Read operations are relatively expensive
  - Capacity: Up to 500TB
  - Performance: ~2000 rows/second insertion rate
  - Highly scalable

### Common Use Cases

- Serverless applications
- Logging systems
- Configuration stores
- Web applications

## Partitioning and Sharding

### Partitioning Basics

- A partition contains entities with the same partition key value
- Multiple entities can share a partition key but must have unique row keys
- Row key + Partition key uniquely identifies an entity
- Partitions can span multiple storage nodes
- Automatic partition migration occurs when storage nodes are full

### Partitioning vs Sharding

**Partitioning:**

- Process of dividing a large table into smaller, manageable pieces
- Based on specific criteria (range or list of values)

**Sharding:**

- Distributes data across multiple database instances/servers
- Each shard operates independently
- Uses shared-nothing architecture

## Sharding Strategies

### 1. Range-based Sharding

**Characteristics:**

- Based on value ranges (e.g., surnames A-F)
- Non-overlapping chunks
- Same schema across shards

**Advantages:**

- Simple to implement
- Efficient for range queries
- Good data locality

**Disadvantages:**

- Potential hotspots
- Complex rebalancing
- Challenging boundary definition

### 2. Directory-based Sharding (Lookup)

**Characteristics:**

- Uses mapping table to route requests
- Flexible data distribution
- Good for complex sharding requirements

**Advantages:**

- Highly flexible
- Easier rebalancing
- Handles complex schemes
- Efficient query routing

**Disadvantages:**

- Single point of failure risk
- Additional complexity
- Performance overhead
- Scaling challenges

### 3. Hash Sharding

**Characteristics:**

- Uses hash function to distribute data
- Aims for even distribution
- Reduces hotspot probability

**Advantages:**

- Uniform data distribution
- Simple and predictable
- Good scalability
- Natural load balancing

**Disadvantages:**

- Poor for range queries
- Complex shard adjustment
- Limited flexibility
- Dependent on hash function quality

## Azure Table REST API

- Supports CRUD operations through REST APIs
- Follows ODATA specification
- Query syntax example:
  ```
  https://myaccount.table.core.windows.net/Customers()?$top=10
  ```
- Full documentation available in Azure docs

Would you like me to elaborate on any particular section or adjust the structure further?
