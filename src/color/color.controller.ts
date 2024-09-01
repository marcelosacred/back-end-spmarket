import { Controller } from '@nestjs/common';
import { ColorService } from './color.service';

@Controller('colors')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

}
