import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thaiDate'
})
export class ThaiDatePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    const date = new Date(value);
    if (isNaN(date.getTime())) return 'Invalid Date';

    const thaiMonths = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];

    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543; // Convert to Buddhist Era (B.E.)

    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Ensures two-digit minutes

    return `${day} ${month} ${year}`;
  }
}