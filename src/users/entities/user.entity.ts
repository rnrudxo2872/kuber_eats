import { InternalServerErrorException } from '@nestjs/common';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';

enum UserRole {
  Client,
  Owner,
  Delivery,
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'User Info Object',
});

@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column()
  @IsString()
  @Field((_) => String)
  email: string;

  @Column()
  @IsString()
  @Field((_) => String)
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  @Field((_) => UserRole)
  role: UserRole;

  @BeforeInsert()
  async beforInsertDB() {
    try {
      this.password = await bcrypt.hash(this.password, 5);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
