
interface IAppConfig {
    port: number; 
}

export const appConfig:IAppConfig= {
    port: process.env.PORT ? parseInt(process.env.PORT) : 4004
}
