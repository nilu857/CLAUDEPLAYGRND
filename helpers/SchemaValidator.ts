/**
 * JSON Schema Validator for API responses
 */
export class SchemaValidator {
  /**
   * Validate object against a schema definition
   */
  static validate(data: any, schema: Schema): ValidationResult {
    const errors: string[] = [];

    // Check required fields
    if (schema.required) {
      for (const field of schema.required) {
        if (!(field in data)) {
          errors.push(`Missing required field: ${field}`);
        }
      }
    }

    // Check properties
    if (schema.properties) {
      for (const [key, fieldSchema] of Object.entries(schema.properties)) {
        if (key in data) {
          const fieldErrors = this.validateField(data[key], fieldSchema, key);
          errors.push(...fieldErrors);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate individual field
   */
  private static validateField(value: any, fieldSchema: FieldSchema, fieldName: string): string[] {
    const errors: string[] = [];

    // Type validation
    if (fieldSchema.type) {
      const actualType = Array.isArray(value) ? 'array' : typeof value;
      if (actualType !== fieldSchema.type) {
        errors.push(`Field '${fieldName}' has wrong type. Expected: ${fieldSchema.type}, Got: ${actualType}`);
      }
    }

    // Enum validation
    if (fieldSchema.enum && !fieldSchema.enum.includes(value)) {
      errors.push(`Field '${fieldName}' value '${value}' is not in allowed values: [${fieldSchema.enum.join(', ')}]`);
    }

    // String validations
    if (typeof value === 'string') {
      if (fieldSchema.minLength && value.length < fieldSchema.minLength) {
        errors.push(`Field '${fieldName}' length is less than minimum: ${fieldSchema.minLength}`);
      }
      if (fieldSchema.maxLength && value.length > fieldSchema.maxLength) {
        errors.push(`Field '${fieldName}' length exceeds maximum: ${fieldSchema.maxLength}`);
      }
      if (fieldSchema.pattern && !new RegExp(fieldSchema.pattern).test(value)) {
        errors.push(`Field '${fieldName}' does not match pattern: ${fieldSchema.pattern}`);
      }
    }

    // Number validations
    if (typeof value === 'number') {
      if (fieldSchema.minimum !== undefined && value < fieldSchema.minimum) {
        errors.push(`Field '${fieldName}' is less than minimum: ${fieldSchema.minimum}`);
      }
      if (fieldSchema.maximum !== undefined && value > fieldSchema.maximum) {
        errors.push(`Field '${fieldName}' exceeds maximum: ${fieldSchema.maximum}`);
      }
    }

    // Array validations
    if (Array.isArray(value)) {
      if (fieldSchema.minItems && value.length < fieldSchema.minItems) {
        errors.push(`Field '${fieldName}' has fewer items than minimum: ${fieldSchema.minItems}`);
      }
      if (fieldSchema.maxItems && value.length > fieldSchema.maxItems) {
        errors.push(`Field '${fieldName}' has more items than maximum: ${fieldSchema.maxItems}`);
      }
    }

    return errors;
  }

  /**
   * Assert that data matches schema (throws error if invalid)
   */
  static assertValid(data: any, schema: Schema): void {
    const result = this.validate(data, schema);
    if (!result.valid) {
      throw new Error(`Schema validation failed:\n${result.errors.join('\n')}`);
    }
  }
}

// Type definitions
export interface Schema {
  required?: string[];
  properties?: Record<string, FieldSchema>;
}

export interface FieldSchema {
  type?: 'string' | 'number' | 'boolean' | 'object' | 'array';
  enum?: any[];
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  minimum?: number;
  maximum?: number;
  minItems?: number;
  maxItems?: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}
