import { ModuleRef } from "@nestjs/core";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { StrategyType } from "./types";
import { TotalizationStrategy } from "./interfaces";
import { Call } from "../../invoices/interfaces";
import { TOTALIZATION_STRATEGY_METADATA } from "./decorators/totalization-strategy.decorator";

@Injectable()
export class TotalizationContext implements OnModuleInit {
    private totalizationStrategies: TotalizationStrategy[] = [];

    constructor(private moduleRef: ModuleRef) { }

    onModuleInit() {
        const modules = this.moduleRef['container'].getModules();
        for (const module of modules.values()) {
            const providers = module.providers;
            for (const [key, provider] of providers) {
                const instance = provider.instance;
                if (instance && Reflect.getMetadata(TOTALIZATION_STRATEGY_METADATA, instance.constructor)) {
                    this.registerStrategy(instance as TotalizationStrategy);
                }
            }
        }
        if (this.totalizationStrategies.length === 0) {
            throw new Error('No totalization strategies found');
        }
    }

    registerStrategy(strategy: TotalizationStrategy) {
        this.totalizationStrategies.push(strategy);
    }

    processCalls(calls: Call[]): Record<string, number> {
        this.setUpProcessCalls();
        const totals: Record<StrategyType, number> = {} as Record<StrategyType, number>;

        this.totalizationStrategies.forEach(strategy => {
            calls.forEach(call => strategy.processCall(call));
            const [field, value] = strategy.getResult();
            totals[field] = value;
        });

        return totals;
    }

    private setUpProcessCalls(): void {
        this.totalizationStrategies.forEach(strategy => {
            strategy.reset();
        });
    }
}