// confirm-leave.guard.ts
import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
export interface CanLeave {
  canLeave(): boolean | Promise<boolean> | import('rxjs').Observable<boolean>;
}

@Injectable({ providedIn: 'root' })
export class ConfirmLeaveGuard implements CanDeactivate<CanLeave> {
  canDeactivate(component: CanLeave) {
    return component.canLeave();
  }
}
