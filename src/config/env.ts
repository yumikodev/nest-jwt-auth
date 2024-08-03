export interface JwtConfig {
  ACCESS_SECRET: string;
  REFRESH_SECRET: string;
  ACCESS_EXP: number;
  REFRESH_EXP: number;
}

interface Configuration {
  JWT: JwtConfig;
}

export default (): Configuration => ({
  JWT: {
    ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    ACCESS_EXP: 15 * 60,
    REFRESH_SECRET: process.env.JWT_ACCESS_SECRET,
    REFRESH_EXP: 60 * 60,
  },
});
