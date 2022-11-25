import { Report } from '../reports/report.entity';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

// By convention only for the entity types class name is NOT UserEntity, but simply User.

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  admin: boolean;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log('Inserted User with id ', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed User with id ', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with id ', this.id);
  }
}
