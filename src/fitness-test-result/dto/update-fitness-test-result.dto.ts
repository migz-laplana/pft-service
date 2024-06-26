import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class UpdateFitnessTestResultDto {
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  weight: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  height: number;

  @IsOptional()
  @IsInt()
  zipperTestPoints: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  sitAndReachDistanceCm: number;

  @IsOptional()
  @IsInt()
  pulseBeatsTenSec: number;

  @IsOptional()
  @IsInt()
  pushupsCount: number;

  @IsOptional()
  @IsString()
  @Matches(/^\d:[0-5]\d:[0-5]\d$/, {
    message: 'Time must be valid format: H:MM:SS',
  })
  plankHoldDuration: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d:[0-5]\d:[0-5]\d$/, {
    message: 'Time must be valid format: H:MM:SS',
  })
  fortyMeterSprintDuration: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  longJumpDistCm: number;

  @IsOptional()
  @IsString()
  @Matches(/^\d:[0-5]\d:[0-5]\d$/, {
    message: 'Time must be valid format: H:MM:SS',
  })
  hexTestFirstRev: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d:[0-5]\d:[0-5]\d$/, {
    message: 'Time must be valid format: H:MM:SS',
  })
  hexTestSecondRev: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  dropTestFirstRead: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  dropTestSecondRead: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  dropTestThirdRead: number;

  @IsOptional()
  @IsInt()
  jugglingHits: number;

  @IsOptional()
  @IsString()
  @Matches(/^\d:[0-5]\d:[0-5]\d$/, {
    message: 'Time must be valid format: H:MM:SS',
  })
  balanceLeft: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d:[0-5]\d:[0-5]\d$/, {
    message: 'Time must be valid format: H:MM:SS',
  })
  balanceRight: string;
}
