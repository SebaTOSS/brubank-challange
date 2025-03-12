import { ExecutionContext } from '@nestjs/common';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { createMock } from '@golevelup/ts-jest';
import { LoggedUser } from '../logged-user.decorator';

function getParamDecoratorFactory(decorator: Function) {
    class TestDecorator {
        public test(@decorator() value: any) { }
    }

    const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestDecorator, 'test');

    return args[Object.keys(args)[0]].factory;
}

describe('LoggedUser Decorator', () => {
    it('should return the user from the request object', () => {
        const mockUser = { id: 1, name: 'Test User' };
        const mockExecutionContext = createMock<ExecutionContext>({
            switchToHttp: () => ({
                getRequest: () => ({
                    user: mockUser,
                }),
            }),
        });
        const decorator = getParamDecoratorFactory(LoggedUser);
        const result = decorator(null, mockExecutionContext);

        expect(result).toEqual(mockUser);
    });

    it('should return undefined if there is no user in the request object', () => {
        const mockExecutionContext = createMock<ExecutionContext>({
            switchToHttp: () => ({
                getRequest: () => ({}),
            }),
        });

        const decorator = getParamDecoratorFactory(LoggedUser);
        const result = decorator(null, mockExecutionContext);

        expect(result).toBeUndefined();
    });
});