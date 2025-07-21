import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  async sendTaxCalculationComplete(
    plotId: string,
    amount: number,
    dueDate: Date,
  ) {
    // Implement your notification logic (email, SMS, etc.)
    console.log(
      `Tax calculation complete for plot ${plotId}: ${amount} RWF due by ${dueDate}`,
    );
  }
}
