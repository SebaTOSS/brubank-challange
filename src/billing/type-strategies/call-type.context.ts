import { ModuleRef } from '@nestjs/core';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { CALL_TYPE_METADATA } from './decorators/call-type.decorator';
import { CallData, CallMetadata, CallTypeStrategy } from './interfaces';

@Injectable()
export class CallTypeContext implements OnModuleInit {
    private strategies: CallTypeStrategy[] = [];

    constructor(private moduleRef: ModuleRef) { }

    onModuleInit() {
        const modules = this.moduleRef['container'].getModules();
        for (const module of modules.values()) {
            const providers = module.providers;
            for (const [key, provider] of providers) {
                const instance = provider.instance;
                if (instance && Reflect.getMetadata(CALL_TYPE_METADATA, instance.constructor)) {
                    this.registerStrategy(instance as CallTypeStrategy);
                }
            }
        }
        if (this.strategies.length === 0) {
            throw new Error('No call type strategies found');
        }
    }

    registerStrategy(strategy: CallTypeStrategy): void {
        if (!this.strategies.includes(strategy)) {
            this.strategies.push(strategy);
        }
    }

    initialize(): void {
        this.strategies.forEach(strategy => {
            if (strategy.initialize) {
                strategy.initialize();
            }
        });
    }

    processCall(callData: CallData): CallMetadata {
        const metadata: CallMetadata = {};
        this.strategies.forEach(strategy => {
            Object.assign(metadata, strategy.processCall(callData));
        });

        return metadata;
    }
}