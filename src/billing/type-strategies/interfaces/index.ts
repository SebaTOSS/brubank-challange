import { UserDto } from '../../../users/dto/user.dto';

export interface CallTypeStrategy {
    processCall(callData: CallData): CallMetadata;
    initialize?(): void;
}

export interface CallMetadata {
    [key: string]: any;
}

export interface CallData {
    origin: string;
    destination: string;
    duration: number;
    timestamp: string;
    user?: UserDto;
}
