import migrationRunner from 'node-pg-migrate';
import { join } from "node:path";
import database from 'infra/database';

export default async function migrations(request, response) {
  const dbClient = await database.getNewClient();
  const defaultMigrationOptions = {
    dbClient: dbClient,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: "true",
    migrationsTable: "pgmigrations",    
  }

  try {  

    if (request.method === "GET") {
      const pendingMigrations = await migrationRunner(defaultMigrationOptions);        
      response.status(200).json(pendingMigrations);
    }

    if (request.method === "POST") {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationOptions,
        dryRun: false,   
      });  

      if(migratedMigrations.length > 0){
      response.status(201).json(migratedMigrations);    
      }

      response.status(200).json(migratedMigrations);    
    }

    return response.status(405).end();

  } catch (error) {
    console.log(error);
  } finally {
    await dbClient.end();
    return response;
  }
  //add try catch in the future
}
