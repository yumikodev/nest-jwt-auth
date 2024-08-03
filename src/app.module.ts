import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import env from "./config/env";

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [env],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
