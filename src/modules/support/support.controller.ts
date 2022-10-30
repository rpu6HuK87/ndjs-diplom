import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete
} from '@nestjs/common'
import { SupportService } from './support.service'

@Controller('comments')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}
}
