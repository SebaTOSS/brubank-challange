import { Module } from '@nestjs/common';
import { TotalizationContext } from './totalization-context';
import { TotalizationStrategiesModule } from './strategies/strategies.module';

@Module({
  imports: [TotalizationStrategiesModule],
  providers: [TotalizationContext],
  exports: [TotalizationContext],
})
export class TotalizationModule { }