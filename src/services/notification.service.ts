import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private messageService: MessageService) {}

  successMessage(summary: string, detail: string) {
    this.messageService.add({ severity: 'success', summary, detail });
  }

  infoMessage(summary: string, detail: string) {
    this.messageService.add({ severity: 'info', summary, detail });
  }

  errorMessage(summary: string, detail: string) {
    this.messageService.add({ severity: 'error', summary, detail });
  }
}
