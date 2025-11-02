/**
 * Data Generator utility for creating test data
 */
export class DataGenerator {
  /**
   * Generate random string
   */
  static randomString(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate random email
   */
  static randomEmail(): string {
    return `test_${this.randomString(8)}@example.com`;
  }

  /**
   * Generate random number in range
   */
  static randomNumber(min: number = 0, max: number = 100): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Generate random boolean
   */
  static randomBoolean(): boolean {
    return Math.random() < 0.5;
  }

  /**
   * Generate random date
   */
  static randomDate(start: Date = new Date(2020, 0, 1), end: Date = new Date()): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  /**
   * Generate random UUID (v4)
   */
  static randomUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Generate random phone number
   */
  static randomPhoneNumber(): string {
    return `+1${this.randomNumber(1000000000, 9999999999)}`;
  }

  /**
   * Pick random item from array
   */
  static randomFromArray<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Generate random user object
   */
  static randomUser(): User {
    return {
      id: this.randomNumber(1, 10000),
      name: `User_${this.randomString(8)}`,
      email: this.randomEmail(),
      phone: this.randomPhoneNumber(),
      username: `user_${this.randomString(6)}`,
    };
  }

  /**
   * Generate timestamp
   */
  static timestamp(): number {
    return Date.now();
  }

  /**
   * Generate ISO date string
   */
  static isoDate(): string {
    return new Date().toISOString();
  }
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  username: string;
}
