import { ModuleRef } from "@nestjs/core";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { TotalizationStrategy } from "./interfaces";
import { TOTALIZATION_STRATEGY_METADATA } from "./decorators/totalization-strategy.decorator";
import { Call } from "../../invoices/interfaces";

@Injectable()
export class TotalizationContext implements OnModuleInit {
    private totalizationStrategies: TotalizationStrategy[] = [];
    private totals: Record<string, number> = {};

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

    processCalls(calls: Call[]): void {
        this.initialize();
        calls.forEach(call => this.processCall(call));
    }

    processCall(call: Call): void {
        this.totalizationStrategies.forEach(strategy => {
            strategy.processCall(call);
            const [field, value] = strategy.getResult();
            this.totals[field] = value;
        });
    }

    initialize() {
        this.resetStrategies();
        this.resetTotals();
    }

    getTotals(): Record<string, number> {
        return { ...this.totals };
    }

    private resetTotals(): void {
        this.totals = {};
    }

    private resetStrategies() {
        this.totalizationStrategies.forEach(strategy => {
            strategy.reset();
        });
    }
}