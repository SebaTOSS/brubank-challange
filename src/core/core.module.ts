import { Logger, Module } from '@nestjs/common';

@Module({
  controllers: [],
  providers: [Logger],
})
export class CoreModule {}