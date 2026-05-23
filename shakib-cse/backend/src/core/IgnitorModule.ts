import { Context } from './Context';

export interface IgnitorModule {
    name: string;
    dependencies?: string[];
    initialize(context: Context): Promise<void>;
    onShutdown?(): Promise<void>;
}
