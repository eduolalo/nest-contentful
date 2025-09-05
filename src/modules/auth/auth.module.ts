import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JwtStrategy } from '@modules/auth/strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET!,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [JwtStrategy],
  exports: [JwtStrategy],
})
export class AuthModule {}
