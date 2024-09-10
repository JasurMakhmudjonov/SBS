interface ISwaggerConfig {
  username: string;
  password: string;
}

export const swaggerConfig: ISwaggerConfig = {
  username: process.env.SWAGGER_USERNAME,
  password: process.env.SWAGGER_PASSWORD,
};
