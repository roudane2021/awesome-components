import { Pipe, PipeTransform } from "@angular/core";

@Pipe(
    {
        name: 'shorten'
    }
)
export class ShortenPipe implements PipeTransform{

    transform(value: string, maxLength = 50) {
        if (value.length <= maxLength) {
            return value;
        }
        else {
            return value.substring(0,maxLength)+'...';
        }
    }
    
}