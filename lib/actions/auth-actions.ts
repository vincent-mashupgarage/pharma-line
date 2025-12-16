/**
 * Authentication Server Actions
 *
 * Server-side functions for user authentication:
 * - Sign up with email/password
 * - Sign in with email/password
 * - Sign out
 * - Password reset
 */

'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { ApiResponse } from '@/types';

/**
 * Sign up new user with email and password
 */
export async function signUp(formData: {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
}): Promise<ApiResponse<{ user_id: string }>> {
  try {
    const supabase = await createServerClient();

    // Validate inputs
    if (!formData.email || !formData.password || !formData.full_name) {
      return {
        success: false,
        error: 'Email, password, and full name are required',
      };
    }

    if (formData.password.length < 6) {
      return {
        success: false,
        error: 'Password must be at least 6 characters',
      };
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.full_name,
          phone: formData.phone || null,
        },
      },
    });

    if (authError) {
      console.error('Signup error:', authError);
      return {
        success: false,
        error: authError.message || 'Failed to create account',
      };
    }

    if (!authData.user) {
      return {
        success: false,
        error: 'Failed to create account',
      };
    }

    // Note: Profile will be created automatically by database trigger
    // if you have a trigger set up, otherwise you can create it here

    return {
      success: true,
      data: { user_id: authData.user.id },
      message: 'Account created successfully! Please check your email to verify your account.',
    };
  } catch (error) {
    console.error('Unexpected signup error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * Sign in user with email and password
 */
export async function signIn(formData: {
  email: string;
  password: string;
}): Promise<ApiResponse<{ user_id: string }>> {
  try {
    const supabase = await createServerClient();

    // Validate inputs
    if (!formData.email || !formData.password) {
      return {
        success: false,
        error: 'Email and password are required',
      };
    }

    // Sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      console.error('Sign in error:', error);
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }

    if (!data.user) {
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }

    // Revalidate paths to update auth state
    revalidatePath('/', 'layout');

    return {
      success: true,
      data: { user_id: data.user.id },
      message: 'Signed in successfully!',
    };
  } catch (error) {
    console.error('Unexpected sign in error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<ApiResponse<null>> {
  try {
    const supabase = await createServerClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Sign out error:', error);
      return {
        success: false,
        error: 'Failed to sign out',
      };
    }

    // Revalidate paths to update auth state
    revalidatePath('/', 'layout');

    return {
      success: true,
      data: null,
      message: 'Signed out successfully',
    };
  } catch (error) {
    console.error('Unexpected sign out error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<ApiResponse<null>> {
  try {
    const supabase = await createServerClient();

    if (!email) {
      return {
        success: false,
        error: 'Email is required',
      };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
    });

    if (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        error: 'Failed to send reset email',
      };
    }

    return {
      success: true,
      data: null,
      message: 'Password reset email sent! Please check your inbox.',
    };
  } catch (error) {
    console.error('Unexpected password reset error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser() {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}
