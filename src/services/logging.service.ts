import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class LogginService {
  logError(message: string): void {
    console.error('LogginService: ' + message)
  }

  logInfo(message: string): void {
    console.info('LogginService: ' + message)
  }
}
