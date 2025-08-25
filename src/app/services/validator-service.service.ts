// validator.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  constructor() { }

  private testRegex(event: any, regex: RegExp): boolean {
    return regex.test(event.key);
  }

  // Common Validators
  isNumber(event: any): boolean {
    const regex = /^[0-9]$/;
    return this.testRegex(event, regex);
  }

  isAlphaNumeric(event: any): boolean {
    const regex = /^[A-Za-z0-9]$/;
    return this.testRegex(event, regex);
  }

  isEmailAllowedChars(event: any): boolean {
    const regex = /^[a-zA-Z0-9@._-]$/;
    return this.testRegex(event, regex);
  }

  // Specific Business Validators
  validateTrueMoney(event: any, type: string): boolean {
    if (type === 'P') { // Phone Number
      return this.isNumber(event);
    } else if (type === 'W') { // Wallet ID
      // You can add more specific Wallet ID validation logic here
      return true; // Placeholder
    } else { // Bank Account
      return this.isNumber(event);
    }
  }

  validateCrypto(event: any): boolean {
    const regex = /^[A-Za-z0-9]$/;
    return this.testRegex(event, regex);
  }

  validateEmailOrNumber(event: any): boolean {
    if (this.isNumber(event)) {
      return this.isNumber(event);
    } else {
      return this.isEmailAllowedChars(event);
    }
  }

  validateWallet(event: any): boolean {
    return this.isNumber(event);
  }

  validateQRCode(event: any): boolean {
    return this.isAlphaNumeric(event);
  }

  validateBankAccount(event: any): boolean {
    return this.isNumber(event);
  }

  validateWalletId(event: any): boolean {
    // Implement your specific Wallet ID validation regex here
    const regex = /^[a-zA-Z0-9ก-๙!@#$%^&*()_+]$/;
    return this.testRegex(event, regex);
  }

  validatePhoneNumber(event: any): boolean {
    return this.isNumber(event);
  }
}