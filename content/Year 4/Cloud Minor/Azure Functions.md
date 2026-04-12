---
title: Azure Functions
description: "Azure Functions is a serverless compute service that enables event-driven code execution with automatic scaling and pay-per-use pricing."
date: 2024-10-16
tags:
  - azure
  - serverless
  - functions
  - cloud
---

# Serverless and Microservices

pay as you go
reactive scaling
you only provide business logic
function as a service
short lived compared to micro services

# The Concept

small code base easy to maintain
scalable spin up fast
language and platform agnostic
2000$ per 2 million executions

# Triggers

# DI

Object receives dependant object through injection (mostly ctor injection)
injecting services, ideal for writing N-tiers layers, and unit tests (esp. “mocking”)
Registering of Dependencies is done in Programs.cs

# Azure Functions: Bindings (Input and Output)

streamlines integration of functions with external services

Blob Trigger
used to monitor changes in blob storage container
when a new blob is added or modified in the specified container, the function is triggered.
the runtime automatically binds the data to..

Queue Output

# Azure Functions: Pipelines - Chaining

# Azure Functions: Durable Functions

workflow is defined within an orchestrator function
delegates aspectos to activitiy azrue functions orchestrator goes to sleep during activity

# Azure Functions: Fan Out – Fan In ?

# Azure Function: Human Interaction? (background info)

# Azure Functions: Error Handling Tips and Do’s and Dont‘s (background info)

Open Shift cost
1600/m
