# Telephone Billing System - BruBank

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
src/
├── billing/
│   ├── strategies/
│   │   ├── decorators/
│   │   │   └── billing-strategy.decorator.ts # Billing strategy decorator
│   │   ├── interfaces/
│   │   │   └── index.ts # Billing strategy interfaces
│   │   ├── tests/
│   │   │   ├── friend.strategy.ts # Friend strategy test
│   │   │   ├── index.ts # Test index
│   │   │   ├── international.strategy.ts # International strategy test
│   │   │   ├── national.strategy.ts # National strategy test
│   │   └── strategies.module.ts # Strategies module test
│   ├── totalization/
│   │   ├── decorators/
│   │   │   └── totalization-strategy.decorator.ts # Totalization strategy decorator
│   │   ├── interfaces/
│   │   │   └── index.ts # Totalization interfaces
│   │   ├── strategies/
│   │   │   ├── friends-total.strategy.ts # Friends total strategy
│   │   │   ├── index.ts # Strategies index
│   │   │   ├── international-total.strategy.ts # International total strategy
│   │   │   ├── national-total.strategy.ts # National total strategy
│   │   │   └── totalization-amount.strategy.ts # Totalization amount strategy
│   │   ├── tests/
│   │   │   ├── index.ts # Test index
│   │   │   ├── totalization-context.ts # Totalization context test
│   │   │   └── totalization.module.ts # Totalization module test
│   │   ├── totalization-context.ts # Totalization context
│   │   └── totalization.module.ts # Totalization module
│   ├── billing-context.ts # Billing context
│   └── billing.module.ts # Billing module
├── invoices/
│   ├── controller/
│   │   ├── tests/
│   │   │   └── invoices.controller.ts # Invoices controller test
│   │   └── invoices.controller.ts # Invoices controller
│   ├── dto/
│   │   ├── call.dto.ts # Call DTO
│   │   ├── create-invoice.dto.ts # Create invoice DTO
│   │   ├── index.ts # DTO index
│   │   └── invoices-response.dto.ts # Invoices response DTO
│   ├── interfaces/
│   │   ├── index.ts # Interfaces index
│   │   └── validators.ts # Validators interface
│   ├── service/
│   │   ├── tests/
│   │   │   ├── call-processing.service.ts # Call processing service test
│   │   │   └── invoices.service.ts # Invoices service test
│   │   ├── call-processing.service.ts # Call processing service
│   │   └── invoices.service.ts # Invoices service
│   ├── tests/
│   │   ├── index.ts # Test index
│   │   ├── is-end-date-after-start-date-validator.ts # End date validator test
│   │   ├── is-phone-number-validator.ts # Phone number validator test
│   │   └── invoices.module.ts # Invoices module test
│   ├── validators/
│   │   ├── is-end-date-after-start-date.validator.ts # End date validator
│   │   ├── is-phone-number.validator.ts # Phone number validator
│   │   └── index.ts # Validators index
│   ├── constants.ts # Module constants
│   └── invoices.module.ts # Invoices module
├── users/
│   ├── dto/
│   │   ├── index.ts # DTO index
│   │   └── user.dto.ts # User DTO
│   ├── service/
│   │   ├── tests/
│   │   │   └── users.service.ts # Users service test
│   │   └── users.service.ts # Users service
│   ├── tests/
│   │   └── users.module.ts # Users module test
│   └── users.module.ts # Users module
├── utils/
│   ├── tests/
│   │   └── utils.ts # Utils test
│   └── utils.ts # Shared utilities
├── app.module.ts # Main module
└── main.ts # Main entry point
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

### Architectural Implementation

### Strategy Registration

Strategies are registered using a decorator pattern:

```ts
// national.strategy.ts
@Injectable()
@BillingStrategy()
export class NationalStrategy implements BillingStrategy {
  shouldApply(context) {
    return context.metadata.originCountry === context.metadata.destinationCountry;
  }
  
  calculateCost(context) {
    return NATIONAL_RATE;
  }
}
```

With this approach, new strategies can be added without modifying existing code.

### Totalization Strategy

The system also includes a totalization strategy to calculate the total cost of all calls
using the same strategy pattern:

```ts
// national-total.strategy.ts
@Injectable()
@TotalizationStrategy()
export class NationalTotalStrategy implements TotalizationStrategy {
  shouldApply(context) {
    return context.strategy instanceof NationalStrategy;
  }
  
  calculateTotal(context) {
    return context.calls.reduce((total, call) => total + call.cost, 0);
  }
}
```

With this approach, the system can calculate the total cost of all calls using the same strategy pattern.

### Billing Context

The billing context contains metadata for each call and is used to determine the applicable strategy:

```ts
// billing-context.ts
export class BillingContext {
  constructor(public metadata: CallMetadata, public duration: number) {}
}
```

Having a single context object allows the system to determine the applicable strategy based on call metadata.
Also, the context object can be easily extended with additional properties if needed.

### Runtime Determination

For each call, the system:

1. Creates billing context with call metadata
2. Checks all registered strategies
3. Selects applicable strategy based on metadata
4. Delegates calculation to selected strategy
Extensibility Example
Add new strategies without modifying existing code:

```ts
// weekend.strategy.ts
@Injectable()
export class WeekendStrategy implements BillingStrategy {
  shouldApply(context) {
    return isWeekend(context.metadata.timestamp);
  }
  
  calculateCost(context) {
    return context.duration * WEEKEND_RATE;
  }
}
```

### Benefits Achieved

- Clear Separation: Each strategy encapsulates one pricing rule

- Central Configuration: Rates controlled via environment variables

- Testability: Strategies can be tested in isolation

- Flexibility: New call types added as independent modules

- Business Rule Integrity: Changes to one strategy don't affect others

This architecture allows BruBank to easily adapt to new pricing models while maintaining consistency across different call types.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## 📄 License

MIT License - See LICENSE for details.

___
Made with ❤️ by Seba - Questions? Open an issue!
