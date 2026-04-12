---
title: Mocking with Moq
description: "Introduction to unit testing with Moq framework for creating mock objects to isolate code under test from dependencies."
date: 2024-10-16
tags:
  - testing
  - moq
  - mocking
  - unit-testing
  - tdd
---

Testing business validation requires access to the database. However your colleagues are developing the datalayer and are constantly updating, deleting and dropping tables.
In an ideal situation your code should be isolated from the data layer. To do that while testing, you must create mock objects (simulated objects) that mimic the behavior of real objects in controlled ways
This will allow you to test in Isolation

Mock objects enable you to copy (test double) the exact behavior of classes and interfaces, allowing the code to interact as if they are real objects. This differentiates the code you are testing, while letting you know that it functions on its own and no other code can harm it. 

Mock objects allow you to mimic the behavior of classes and interfaces – just like a crash test dummy -, letting the code in the test interact with them as if they were real. This isolates the code you’re testing, ensuring that it works on its own and that no other code will make the tests fail.

With mocks, you can set up the object, including giving parameters and return values on method calls and setting properties. You can also verify that the methods you set up are being called in the tested code.

## Objects

As a practice, a dependency on your code might be identified in your system and then isolated. In real life, they are commonly a restricted/low-access database, a server outside your domain, a license that needs to be used, or a component that is somehow hard to deal with in your code.

Mocking takes advantage of aspects of OOP, like interfaces and classes, to simulate the behavior of specific dependencies in your code that are difficult to test directly. This ensures that those dependencies can be covered with test cases.

Mock objects are objects that replace the real objects and return hard-coded values. This helps test the class in isolation.

Dynamic mock frameworks are frameworks that build mock objects “on the fly”

![[Pasted image 20241111092829.png]]

## Basic Flow

Create the Mock
var mock = new Mock<IMockTarget>();

Configure the mock to mimic a return value
mock.SetUp(x => x.propertyMock).Returns(“Value”);

Assert that configuration works on mock.object
Assert.AreEqual( “value”, mock.Object.PropertyToMock)

Optional: verify that the mock was called
Mock.Verify(mock => mock.SomeMethod(), Times.Once())

## Basic Flow

https://docs.microsoft.com/en-us/aspnet/web-api/overview/testing-and-debugging/unit-testing-controllers-in-web-api
Service Layer Moq – resources
https://exceptionnotfound.net/unit-testing-the-business-layer-in-asp-net-core-with-moq-and-xunit/
Repository Layer (EF) Moq – resources
https://rubikscode.net/2018/04/16/implementing-and-testing-repository-pattern-using-entity-framework/
