import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
  ArrayNotEmpty,
  IsNumber,
  Min,
  Max,
  IsBoolean,
  IsInt
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { SentencePersonIconEnum } from "@domain/entities/sentence-person-icon-enum";
import { IsUniqueInArray } from "@infra/utils/validate-unique-key-in-array";
import { ToBoolean } from "@infra/utils/to-boolean";

class CreateVideoActivityDto {
  @ApiProperty({
    example: "https://example.com/video.mp4",
    description: "Video URL used in the activity"
  })
  @IsString()
  url: string;

  @ApiProperty({
    example: 0,
    description: "Unique index of this activity within the step"
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(4)
  stepPosition: number;

  @ApiPropertyOptional({
    description:
      "If the activity belongs to the activities that will be on the final exam of the mission",
    example: true
  })
  @ToBoolean()
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isFinalTest?: boolean;
}

class CreateAnswersDto {
  @ApiProperty({
    example: "Apple",
    description: "Answer text for the question"
  })
  @IsString()
  text: string;

  @ApiProperty({ example: true, description: "Whether the answer is correct" })
  @Type(() => Boolean)
  @ToBoolean()
  @IsBoolean()
  isCorrect: boolean;
}

export class CreateFileAnswersDto {
  @ApiProperty({ example: false, description: "Whether the answer is correct" })
  @Type(() => Boolean)
  @ToBoolean()
  @IsBoolean()
  isCorrect: boolean;
}

class CreateDialogSentenceDto {
  @ApiProperty({
    example: SentencePersonIconEnum.SOLINHO,
    description: "Character speaking in the dialog"
  })
  @IsEnum(SentencePersonIconEnum)
  character: SentencePersonIconEnum;

  @ApiProperty({
    example: "Hello, how are you?",
    description: "Text of the dialog sentence"
  })
  @IsString()
  text: string;
}

class CreateTrueOrFalseActivityDto {
  @ApiProperty({
    example: "Is the sky blue?",
    description: "True/False question"
  })
  @IsString()
  question: string;

  @ApiProperty({ example: 1, description: "Unique index within the step" })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(4)
  stepPosition: number;

  @ApiPropertyOptional({
    description:
      "If the activity belongs to the activities that will be on the final exam of the mission",
    example: true
  })
  @ToBoolean()
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isFinalTest?: boolean;

  @ApiProperty({
    type: [CreateAnswersDto],
    description: "List of possible answers (True/False)"
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateAnswersDto)
  answers: CreateAnswersDto[];
}

class CreateImageActivityDto {
  @ApiProperty({
    example: "Select the image of an apple",
    description: "Question prompt"
  })
  @IsString()
  question: string;

  @ApiProperty({ example: 2, description: "Unique index within the step" })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(4)
  stepPosition: number;

  @ApiPropertyOptional({
    description:
      "If the activity belongs to the activities that will be on the final exam of the mission",
    example: true
  })
  @ToBoolean()
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isFinalTest?: boolean;

  @ApiProperty({
    type: [CreateFileAnswersDto],
    description: "List of image options and their correctness"
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateFileAnswersDto)
  answers: CreateFileAnswersDto[];
}

class CreateMultipleResponseActivityDto {
  @ApiProperty({
    example: "Which are fruits?",
    description: "Question with multiple correct answers"
  })
  @IsString()
  question: string;

  @ApiProperty({ example: 3, description: "Unique index within the step" })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(4)
  stepPosition: number;

  @ApiPropertyOptional({
    description:
      "If the activity belongs to the activities that will be on the final exam of the mission",
    example: true
  })
  @ToBoolean()
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isFinalTest?: boolean;

  @ApiProperty({
    type: [CreateAnswersDto],
    description: "Answer options (multiple correct answers allowed)"
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateAnswersDto)
  answers: CreateAnswersDto[];
}

class CreateDialogActivityDto {
  @ApiProperty({ example: 4, description: "Unique index within the step" })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(4)
  stepPosition: number;

  @ApiPropertyOptional({
    description:
      "If the activity belongs to the activities that will be on the final exam of the mission",
    example: true
  })
  @ToBoolean()
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isFinalTest?: boolean;

  @ApiProperty({
    type: [CreateDialogSentenceDto],
    description: "List of dialog sentences between characters"
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateDialogSentenceDto)
  dialogues: CreateDialogSentenceDto[];
}

class CreateGapDto {
  @ApiProperty({ example: 0, description: "Gap position in the sentence" })
  @IsNumber()
  @Type(() => Number)
  index: number;

  @ApiProperty({
    example: ["blue", "green", "yellow"],
    description: "List of words as options to fill the gap"
  })
  @IsArray()
  options: string[];

  @ApiProperty({
    example: "blue",
    description: "Correct word to complete the gap"
  })
  @IsString()
  correct: string;
}

class CreateCompleteSentenceActivityDto {
  @ApiProperty({
    example: "Complete the sentence",
    description: "Instruction for the user"
  })
  @IsString()
  question: string;

  @ApiProperty({
    example: "The sky is blue.",
    description: "Complete sentence"
  })
  @IsString()
  sentence: string;

  @ApiPropertyOptional({
    description:
      "If the activity belongs to the activities that will be on the final exam of the mission",
    example: true
  })
  @ToBoolean()
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isFinalTest?: boolean;

  @ApiProperty({
    example: ["The sky is ", "."],
    description: "Parts of the sentence around the gaps"
  })
  @IsArray()
  textParts: string[];

  @ApiProperty({ example: 5, description: "Unique index within the step" })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(4)
  stepPosition: number;

  @ApiProperty({
    type: [CreateGapDto],
    description: "List of gaps with their options and correct answers"
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateGapDto)
  gaps: CreateGapDto[];
}

class InitialDialogDto {
  @ApiProperty({
    type: [CreateDialogSentenceDto],
    description: "Initial dialog sentences shown before the steps"
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDialogSentenceDto)
  dialogues: CreateDialogSentenceDto[];
}

export class CreateStepDto {
  @ApiProperty({
    example: "Step 1: Introduction",
    description: "Title of the step"
  })
  @IsString()
  title: string;

  @ApiProperty({ example: 0, description: "Step order index" })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(4)
  index: number;

  @ApiPropertyOptional({
    type: [CreateVideoActivityDto],
    description: "List of video-based activities (optional)"
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVideoActivityDto)
  videoActivities?: CreateVideoActivityDto[];

  @ApiPropertyOptional({
    type: [CreateDialogActivityDto],
    description: "List of dialog-based activities (optional)"
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDialogActivityDto)
  dialogActivities?: CreateDialogActivityDto[];

  @ApiPropertyOptional({
    type: [CreateTrueOrFalseActivityDto],
    description: "List of true or false activities (optional)"
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTrueOrFalseActivityDto)
  trueOrFalseActivities?: CreateTrueOrFalseActivityDto[];

  @ApiPropertyOptional({
    type: [CreateMultipleResponseActivityDto],
    description: "List of multiple response activities (optional)"
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMultipleResponseActivityDto)
  multipleResponseActivities?: CreateMultipleResponseActivityDto[];

  @ApiPropertyOptional({
    type: [CreateImageActivityDto],
    description: "List of image selection activities (optional)"
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateImageActivityDto)
  imageActivities?: CreateImageActivityDto[];

  @ApiPropertyOptional({
    type: [CreateCompleteSentenceActivityDto],
    description: "List of sentence completion activities (optional)"
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCompleteSentenceActivityDto)
  completeSentenceActivities?: CreateCompleteSentenceActivityDto[];
}

export class EditMissionDto {
  @ApiPropertyOptional({
    example: "https://example.com/intro.mp4",
    description: "Optional introductory video shown before the steps"
  })
  @IsOptional()
  @IsString()
  initialVideo?: string;

  @ApiPropertyOptional({
    type: InitialDialogDto,
    description: "Optional initial dialog before the mission begins"
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => InitialDialogDto)
  initialDialog?: InitialDialogDto;

  @ApiProperty({
    description: "How many solecas will each activity give",
    example: 3
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(4)
  solecasActivity: number;

  @ApiProperty({
    description: "How many solecas will final test give",
    example: 100
  })
  @Type(() => Number)
  @IsInt()
  @Min(100)
  @Max(500)
  solecasFinalTest: number;

  @ApiProperty({
    type: [CreateStepDto],
    description: "List of steps included in this mission"
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStepDto)
  @IsUniqueInArray("title", { message: "Step titles must be unique" })
  @IsUniqueInArray("index", { message: "Step index must be unique" })
  steps: CreateStepDto[];
}
