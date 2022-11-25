import { User } from '../src/users/user.entity';
import DBConfig from '../src/config/ormconfig';

export class TestService {
  public async cleanDatabase(): Promise<void> {
    let connection;
    connection = await DBConfig.initialize();

    try {
      const entities = connection.entityMetadatas;
      const tableNames = entities
        .map((entity) => `"${entity.tableName}"`)
        .join(', ');

      // console.log(tableNames);

      await connection.query(`TRUNCATE TABLE ${tableNames};`);
      await connection.close();

      console.log('[TEST DATABASE]: Clean');
    } catch (error) {
      await connection.close();
      console.log('error ', error);

      // throw new Error(`ERROR: Cleaning test database: ${error}`);
    }
  }
}
