import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "109.70.148.67",
  port: 3306,
  username: "codepointcreativ_fms_api",
  password: "(&6{ocx4(l~E",
  database: "codepointcreativ_fms_api",
  synchronize: true,
  logging: false,
  // Add new entites here
  entities: [],
  migrations: [],
  subscribers: [],
});
