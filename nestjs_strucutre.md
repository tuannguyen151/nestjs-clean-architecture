.
├── src - The root directory for the application's source code.
│   ├── adapters - This layer contains interface adapters that convert data between the format most convenient for entities and use cases and the format most convenient for some external agency such as the Database or the Web.
│   │   ├── controllers - Controllers handle incoming HTTP requests and return responses to the client. They act as a bridge between the web and the application logic.
│   │   │   └── [feature] - A directory dedicated to a specific feature of the application, containing related controllers.
│   │   │       ├── dto - Data Transfer Objects (DTOs) are used to define the format of data as it is transferred from the client to the server.
│   │   │       ├── presenters - Presenters are responsible for transforming data from the format most convenient for the use cases and entities into a format that can be returned to and understood by the client.
│   │   │       └── [feature].controller.ts - A specific controller for handling requests related to a feature.
│   │   └── gateways - Gateways are responsible for handling real-time communication, often through WebSockets.
│   │       └── [feature] - A directory for gateways related to a specific feature.
│   │           ├── dto - Similar to controllers, these DTOs are for the input data in real-time communication.
│   │           ├── presenters - Presenters for transforming output data in real-time communication.
│   │           └── [feature].gateway.ts - A specific gateway for handling real-time events related to a feature.
│   │
│   ├── domain - This layer contains the business logic of the application. It is the heart of the application.
│   │   ├── entities - Domain entities are the business objects of the application.
│   │   ├── repositories - Interfaces for the data access layer. They abstract the persistence layer, allowing the use cases to access the data without knowing the implementation details.
│   │   ├── services - Domain services contain business logic that doesn't naturally fit within an entity.
│   │   ├── config - Configuration interfaces specific to the domain layer.
│   │   ├── exceptions - Custom exceptions that represent errors within the domain layer.
│   │   └── logger - Interfaces for logging, allowing the domain layer to log information without depending on a specific logging implementation.
│   │
│   ├── infrastructure - This layer contains implementations of the interfaces defined in the domain layer, such as repositories and loggers, as well as other infrastructure concerns.
│   │   ├── databases - Implementations of the data access layer for specific databases.
│   │   │   └── postgressql - PostgreSQL database implementations.
│   │   │       ├── entities - TypeORM entities that map the application's domain entities to database tables.
│   │   │       ├── repositories - Implementations of the repository interfaces for PostgreSQL using TypeORM.
│   │   │       ├── typeorm.config.ts - TypeORM configuration file.
│   │   │       └── typeorm.module.ts - TypeORM module setup.
│   │   ├── services - Implementations of infrastructure services, such as email services or external API clients.
│   │   ├── common - Common infrastructure utilities and helpers.
│   │   │   ├── filter - Exception filters for handling and transforming exceptions into HTTP responses.
│   │   │   ├── guards - Security guards for protecting routes and enforcing authorization.
│   │   │   ├── interceptors - Interceptors for manipulating request and response objects, or for cross-cutting concerns like logging or transaction management.
│   │   │   ├── pipes - Pipes for validation and data transformation.
│   │   │   └── strategies - Authentication strategies for implementing various authentication mechanisms.
│   │   ├── config - Implementations of configuration services, for managing application settings.
│   │   ├── exceptions - Implementations of exception handling mechanisms.
│   │   └── logger - Implementations of the logging interface, providing concrete logging capabilities.
│   │
│   ├── use-cases - This layer contains the application-specific business rules. It encapsulates and implements all of the use cases of the system.
│   │
│   ├── modules - Organizational units that group related code together. Each module is dedicated to a specific area of functionality within the application.
│   │
│   ├── app.module.ts - The root module of the application. It ties all the modules together.
│   │
│   └── main.ts - The entry point of the application. It sets up the NestJS application and starts the server.
|
├── database - Contains database-related files, such as migrations, seeders, and scripts.
|
├── test - Contains testing-related files, including unit and integration tests.
|
├── docker-compose.yml - A Docker Compose configuration file for defining and running multi-container Docker applications.
└── Dockerfile - Contains instructions for Docker to build an image of the application.
