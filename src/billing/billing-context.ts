import { Injectable, OnModuleInit } from '@nestjs/common';
import { BillingStrategy, BillingContextData } from './strategies/interfaces';
import { BILLING_STRATEGY_METADATA } from './strategies/decorators/billing-strategy.decorator';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class BillingContext implements OnModuleInit {
    private billingStrategies: BillingStrategy[] = [];

    constructor(private moduleRef: ModuleRef) { }

    async onModuleInit() {
        const modules = this.moduleRef['container'].getModules();
        for (const module of modules.values()) {
            const providers = module.providers;
            for (const [key, provider] of providers) {
                const instance = provider.instance;
                if (instance && Reflect.getMetadata(BILLING_STRATEGY_METADATA, instance.constructor)) {
                    this.registerStrategy(instance as BillingStrategy);
                }
            }
        }
        if (this.billingStrategies.length === 0) {
            throw new Error('No billing strategies found');
        }
    }

    registerStrategy(strategy: BillingStrategy): void {
        if (!this.billingStrategies.includes(strategy)) {
            this.billingStrategies.push(strategy);
        }
    }

    calculateCost(context: BillingContextData): number {
        const strategy = this.billingStrategies.find(strategy => strategy.shouldApply(context));

        if (!strategy) {
            throw new Error(`No strategy found for call: ${context.origin}->${context.destination}`);
        }

        return strategy.calculateCost(context);
    }
}