interface IJwtConfig {
  secret: string;
  expiration: string;
}

export const jwtConfig: IJwtConfig = {
  secret: process.env.JWT_SECRET,
  expiration: process.env.JWT_EXPIRATION,
};
