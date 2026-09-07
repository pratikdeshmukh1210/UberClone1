import { z } from 'zod';

// ============================================
// SIGNUP VALIDATION SCHEMA
// ============================================
// Validates user registration data
// All fields in req.body will be checked against these rules

// Result: If validation fails, user gets clear error message
// Example: "Email must be a valid email address"


export const signupSchema = z.object({
    body: z.object({
        name: z
            .string({
                required_error: 'Name is required'
            })
            .min(2, 'Name must be at least 2 characters')
            .max(50, 'Name cannot exceed 50 characters')
            .trim(),
        
        email: z
            .string({
                required_error: 'Email is required'
            })
            .email('Invalid email format')
            .trim(),
        
        phone: z
            .string({
                required_error: 'Phone number is required'
            })
            .regex(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
            .trim(),
        
        password: z
            .string({
                required_error: 'Password is required'
            })
            .min(6, 'Password must be at least 6 characters')
            .max(100, 'Password too long')
        
        // Role removed - will be set to RIDER by default in controller
    })
});

// ============================================
// LOGIN VALIDATION SCHEMA
// ============================================
// Validates login credentials
// User can login with either email OR phone + password

// Result: Ensures at least one identifier (email or phone) is present
export const loginSchema = z.object({
    body: z.object({
        email: z
            .string()
            .email('Invalid email format')
            .trim()
            .optional()
            .or(z.literal('')), // Allow empty string
        
        phone: z
            .string()
            .regex(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
            .trim()
            .optional()
            .or(z.literal('')), // Allow empty string
        
        password: z
            .string({
                required_error: 'Password is required'
            })
            .min(1, 'Password is required')
    })
    .refine(
        (data) => {
            // Check if email or phone has actual value (not empty string)
            const hasEmail = data.email && data.email.trim().length > 0;
            const hasPhone = data.phone && data.phone.trim().length > 0;
            return hasEmail || hasPhone;
        },
        {
            message: 'Either email or phone number is required',
            path: ['email'] // Show error on email field
        }
    )
});