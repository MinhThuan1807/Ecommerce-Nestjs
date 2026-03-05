import { ClassSerializerInterceptor, Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
// import { PostsModule } from './routes/posts/posts.module';
import { SharedModule } from './shared/shared.module'
// import { ConfigModule } from '@nestjs/config';
// import { AuthModule } from './routes/auth/auth.module';
// import { AuthService } from './routes/auth/auth.service';
import { APP_INTERCEPTOR } from '@nestjs/core'

@Module({
  imports: [SharedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
