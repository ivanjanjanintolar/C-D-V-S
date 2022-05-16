import { Injectable } from '@nestjs/common';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { UserRegisterDTO } from './dto/users-register.dto';
import { UserDTO } from './dto/users.dto';

// This should be a real class/interface representing a user entity

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ username });
  }

  public async saveUser(userRegisterDTO: UserRegisterDTO): Promise<UserDTO> {
    const savedUser = userRegisterDTO;

    return this.userRepository.save({ ...savedUser });
  }
}
