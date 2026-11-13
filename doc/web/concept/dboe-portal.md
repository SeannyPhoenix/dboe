[README](../../../README.md)

# DBOE Portal

## What is DBOE Portal?

DBOE Portal is an application to view and modify the data in a DBOE database. A single portal is made up of individual views. Each view maintains a connection to the server with a query and subscriptions. A view might spawn a new view.

Portals, views, queries, and subscriptions are represented as records in DBOE, meaning they can be modified and loaded, with full history possible.

## Definitions

**Portal**

A portal is a collection of views into a DBOE database. To begin, a portal is a full web page.

**View**

A view can be thought of as a small app that displays the result of a query. It's made up of components to display and/or edit data. It uses subscriptions to stay up to date. For example, the current weather in the Castro, or a recipe book.

**Component**

A component is composed of the code for displaying and handling data from the database. For example, a selector for the status of a job application.

**Query**

A query is a defined request to the DBOE databse. It may be as simple as an entity ID, or it make be complex, such as the average temperature in October for each of the last 10 years.

**Subscription**

A susbscription is an open stream request for updates to data. For example, a query for the current departures of a subway station may request to be notified of updates every 10 seconds.

**Module**

A well-defined and published set of value types, link types, and views with components. For example, a cooking module with types and components for measurements, ingredients, and recipes.
