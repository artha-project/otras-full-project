import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ResultModule } from '../result/result.module';

@Module({
  imports: [forwardRef(() => ResultModule)],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule { }
