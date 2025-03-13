# 📃📞 Telephone Invoice System - BruBank

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

Telephone call processing and invoice generation system with different billing strategies, developed with NestJS following SOLID principles and Clean Architecture.

## 🚀 Key Features

- **CSV processing** with format validation
- **Multiple billing strategies** (national, international, friends)
- **Extensible system** for new call types
- **Dynamic configuration** using environment variables
- **Billing period validation**
- **API documentation** with OpenAPI/Swagger
- **Robust typing** with TypeScript
- **Unit and integration tests** with Jest

## 🏗 Project Structure

```bash
BRUBANK/
├── src/
│   ├── billing/
│   │   ├── billing-context.ts # Billing context
│   │   ├── billing.module.ts # Billing module
│   │   ├── strategies/
│   │   │   ├── decorators/
│   │   │   │   └── billing-strategy.decorator.ts # Billing strategy decorator
│   │   │   ├── interfaces/
│   │   │   │   └── index.ts # Billing strategy interfaces
│   │   │   ├── tests/
│   │   │   │   ├── friends-strategy.spec.ts # Friends strategy test
│   │   │   │   ├── index.ts # Test index
│   │   │   │   ├── international-strategy.spec.ts # International strategy test
│   │   │   │   ├── national-strategy.spec.ts # National strategy test
│   │   │   │   └── strategies.module.ts # Strategies module test
│   │   │   ├── friend.strategy.ts # Friend calls strategy
│   │   │   ├── index.ts # Strategies index
│   │   │   ├── international.strategy.ts # International calls strategy
│   │   │   └── national.strategy.ts # National calls strategy
│   │   ├── totalization/
│   │   │   ├── decorators/
│   │   │   │   └── totalization-strategy.decorator.ts # Totalization strategy decorator
│   │   │   ├── interfaces/
│   │   │   │   └── index.ts # Totalization interfaces
│   │   │   ├── strategies/
│   │   │   │   ├── friends-total.strategy.ts # Friends total strategy
│   │   │   │   ├── index.ts # Strategies index
│   │   │   │   ├── international-total.strategy.ts # International total strategy
│   │   │   │   ├── national-total.strategy.ts # National total strategy
│   │   │   │   └── totalization-amount.strategy.ts # Totalization amount strategy
│   │   │   ├── tests/
│   │   │   │   ├── friends-total-strategy.ts # Friends total strategy test
│   │   │   │   ├── index.ts # Test index
│   │   │   │   ├── international-total-strategy.ts # International total strategy test
│   │   │   │   ├── national-total-strategy.ts # National total strategy test
│   │   │   │   ├── totalization-amount-strategy.ts # Totalization amount strategy test
│   │   │   │   ├── totalization-context.ts # Totalization context test
│   │   │   │   └── totalization.module.ts # Totalization module test
│   │   │   ├── totalization-context.ts # Totalization context
│   │   │   └── totalization.module.ts # Totalization module
│   │   └── type-strategies/
│   │       ├── call-type-context.ts # Call type context
│   │       ├── call-type-decorator.ts # Call type decorator
│   │       ├── interfaces/
│   │       │   └── index.ts # Call type strategy interfaces
│   │       ├── tests/
│   │       │   ├── friend-call-type-strategy.ts # Friend call type strategy test
│   │       │   ├── index.ts # Test index
│   │       │   ├── international-call-type-strategy.ts # International call type strategy test
│   │       │   └── national-call-type-strategy.ts # National call type strategy test
│   │       ├── friend-call-type.strategy.ts # Friend call type strategy
│   │       ├── index.ts # Type strategies index
│   │       ├── international-call-type.strategy.ts # International call type strategy
│   │       ├── national-call-type.strategy.ts # National call type strategy
│   │       └── type-strategies.module.ts # Type strategies module
│   ├── invoices/
│   │   ├── constants.ts # Module constants
│   │   ├── controller/
│   │   │   ├── invoices.controller.ts # Invoices controller
│   │   │   └── tests/
│   │   │       └── invoices.controller.ts # Invoices controller test
│   │   ├── dto/
│   │   │   ├── call.dto.ts # Call DTO
│   │   │   ├── create-invoice.dto.ts # Create invoice DTO
│   │   │   ├── index.ts # DTO index
│   │   │   └── invoices-response.dto.ts # Invoices response DTO
│   │   ├── interfaces/
│   │   │   ├── index.ts # Interfaces index
│   │   │   └── validators.ts # Validators interface
│   │   ├── invoices.module.ts # Invoices module
│   │   ├── service/
│   │   │   ├── call-processing.service.ts # Call processing service
│   │   │   ├── invoices.service.ts # Invoices service
│   │   │   └── tests/
│   │   │       ├── call-processing.service.ts # Call processing service test
│   │   │       └── invoices.service.ts # Invoices service test
│   │   ├── tests/
│   │   │   ├── index.ts # Test index
│   │   │   ├── is-end-date-after-start-date-validator.ts # End date validator test
│   │   │   ├── is-phone-number-validator.ts # Phone number validator test
│   │   │   └── invoices.module.ts # Invoices module test
│   │   └── validators/
│   │       ├── is-end-date-after-start-date.validator.ts # End date validator
│   │       ├── is-phone-number.validator.ts # Phone number validator
│   │       └── index.ts # Validators index
│   ├── users/
│   │   ├── dto/
│   │   │   ├── index.ts # DTO index
│   │   │   └── user.dto.ts # User DTO
│   │   ├── service/
│   │   │   ├── tests/
│   │   │   │   └── users.service.ts # Users service test
│   │   │   └── users.service.ts # Users service
│   │   ├── tests/
│   │   │   └── users.module.ts # Users module test
│   │   ├── users.module.ts # Users module
│   │   └── index.ts # Users index
│   ├── utils/
│   │   ├── tests/
│   │   │   └── utils.ts # Utils test
│   │   └── utils.ts # Shared utilities
│   ├── app.module.ts # Main module
│   └── main.ts # Main entry point
├── env # Environment variables
├── .gitignore # Git ignore file
├── prettierc # Prettier configuration
├── prettierignore # Prettier ignore file
├── docker-compose.yml # Docker compose configuration
└── NPM_SCRIPTS # NPM scripts
```

## ⚙️ Configuration

### 1. Clone repository

```bash
git clone https://github.com/SebaTOSS/brubank-challenge
cd brubank-challenge
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables (create .env)

```bash
# Example .env
BILLING_NATIONAL_RATE=2.5
BILLING_INTERNATIONAL_RATE=0.75
BILLING_FREE_FRIEND_CALLS=10
USER_SERVICE_BASE_URL=http://some-user-api # User service base URL
```

## 🚨 Usage

To start the application, run:

```bash
npm run start
```

The application will be available at `http://localhost:3000`.

## 🧪 Testing

To run tests, use the following command:

```bash
npm run test
```

## 📚 API Documentation

The API documentation is available at `http://localhost:3000/api/documentation`.

## API Endpoints

- **GET /health**: Check the health of the application.
- **POST /invoice/generate**: Generate an invoice based on the provided payload.

```bash
curl -X POST http://localhost:3000/invoice/generate \
  -F "file=@calls.csv" \
  -F "phoneNumber=+549116543219" \
  -F "billingPeriodStart=2023-01-01" \
  -F "billingPeriodEnds=2023-01-31"
```

## 🧮 Call Cost Calculation Strategy Architecture

The billing system implements a Strategy Pattern to handle different call types, following SOLID principles for maintainability and extensibility.

### Strategy Breakdown

- National Calls Strategy

  - Condition: Same country code for origin/destination

  - Calculation: Fixed rate per call

  - Configuration:

```bash
env
BILLING_NATIONAL_RATE=2.5
```

- International Calls Strategy

  - Condition: Different country codes

  - Calculation: Rate × call duration (seconds)

  - Configuration:

```bash
env
BILLING_INTERNATIONAL_RATE=0.75
```

- Friend Calls Strategy

  - Condition: Destination in user's friends list

  - Calculation:

  - First N calls: Free

  - Subsequent calls: International rate × duration

  - Configuration:

```bash
env
BILLING_FREE_FRIEND_CALLS=10
```

### 🛠️ Architectural Implementation

The system leverages the **Strategy Pattern** with three distinct contexts—`BillingContext`, `TotalizationContext`, and `CallTypeContext`— to handle different aspects of call processing in a modular and extensible manner. Each context manages a set of strategies registered via decorators, allowing new behaviors to be added without modifying existing code.

### Strategy Registration

#### Billing Strategies

Billing strategies calculate the cost of individual calls based on specific criteria:

```ts
// national.strategy.ts
@Injectable()
@BillingStrategy()
export class NationalStrategy implements BillingStrategy {
  shouldApply(context: BillingContextData) {
    return context.metadata.originCountry === context.metadata.destinationCountry;
  }
  
  calculateCost(context: BillingContextData) {
    return NATIONAL_RATE;
  }
}
```

The **BillingContext** orchestrates these strategies to determine the cost for each call, ensuring that the appropriate strategy is applied based on the call's context.

With this approach, new strategies can be added without modifying existing code.

#### Call Type Strategies

Call type strategies classify calls and generate metadata (e.g., friend status, call counts) to enrich call data:

```ts
// friend-call-type.strategy.ts
@Injectable()
@CallTypeDecorator()
export class FriendCallTypeStrategy implements CallTypeStrategy {
  private friendCallCounts: Record<string, number> = {};

  processCall(callData: CallData): CallMetadata {
    const isFriend = callData.userFriends.includes(callData.destination);
    if (isFriend) {
      this.friendCallCounts[callData.destination] = (this.friendCallCounts[callData.destination] || 0) + 1;
    }
    return {
      isFriend,
      callCount: this.friendCallCounts[callData.destination] || 0,
    };
  }

  reset(): void {
    this.friendCallCounts = {};
  }
}
```

The **CallTypeContext** manages these strategies, initializing them before processing and providing metadata that can be used by other contexts (e.g., billing or totalization).

### Totalization Strategy

Totalization strategies aggregate call data to compute totals based on applied billing strategies:

```ts
// national-total.strategy.ts
@Injectable()
@TotalizationStrategy()
export class NationalTotalStrategy implements TotalizationStrategy {
  shouldApply(context: TotalizationContextData) {
    return context.strategy instanceof NationalStrategy;
  }
  
  calculateTotal(context: TotalizationContextData) {
    return context.calls.reduce((total, call) => total + call.amount, 0);
  }
}
```

The TotalizationContext coordinates these strategies to calculate the overall cost or other aggregated metrics for all processed calls.

#### Workflow Integration

The three contexts work together seamlessly:

- **CallTypeContext** first classifies each call and generates metadata (e.g., isFriend, callCount), which is passed to **BillingContext**.

- **BillingContext** uses the metadata to select the appropriate billing strategy and calculate the call's cost.

- **TotalizationContext** then aggregates the results using the totalization strategies, leveraging metadata from **CallTypeContext** for detailed breakdowns (e.g., total cost for friend calls).

This approach ensures extensibility: new billing rules, call classifications, or aggregation methods can be added by creating new strategies and registering them with their respective contexts, adhering to the Open/Closed Principle.

### Benefits Achieved

- Clear Separation: Each strategy encapsulates one pricing rule

- Central Configuration: Rates controlled via environment variables

- Testability: Strategies can be tested in isolation

- Flexibility: New call types added as independent modules

- Business Rule Integrity: Changes to one strategy don't affect others

This architecture allows BruBank to easily adapt to new pricing models while maintaining consistency across different call types.

## 🛠️ Technologies

- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.

- **TypeScript**: A strongly typed superset of JavaScript that compiles to plain JavaScript.

- **Jest**: A delightful JavaScript Testing Framework with a focus on simplicity.

- **Docker**: A platform for developing, shipping, and running applications in containers.

- **Swagger**: An open-source software framework backed by a large ecosystem of tools that helps developers design, build, document, and consume RESTful web services.

## 🗺️ Next Steps

To enhance the system's flexibility and maintainability, the following improvement is proposed:

### Dynamic Tariff Management Module

Currently, tariff rates (e.g., `NATIONAL_RATE`) are defined as environment variables or static constants, which limits the ability to update them dynamically without redeploying the application. A new module, tentatively named `TariffManagementModule`, should be introduced to manage tariffs for each strategy (e.g., `BillingStrategy`, `CallTypeStrategy`, `TotalizationStrategy`) in a centralized and configurable manner. This module would:

- Store tariff data in a database or configuration service.

- Provide an API or service to update tariffs in real-time (hot reloading).

- Integrate with existing contexts (`BillingContext`, `CallTypeContext`, `TotalizationContext`) to apply updated rates dynamically.

#### Affected Modules

The introduction of `TariffManagementModule` will impact the following modules:

- **BillingModule**: To integrate with `BillingContext` and allow dynamic tariff updates for billing strategies (e.g., `NationalStrategy`).

- **TypeStrategiesModule**: To enable `CallTypeContext` to use tariff-related metadata if required (e.g., for friend call discounts).

- **TotalizationModule**: To adjust `TotalizationContext` calculations based on updated tariff data from billing or call type strategies.

This enhancement will adhere to the Open/Closed Principle by allowing tariff modifications without altering strategy logic, improving the system's adaptability to changing business requirements.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## 📄 License

MIT License - See LICENSE for details.

___
Made with ❤️ by Seba - Questions? Open an issue!
