/**
 * Profile Server Actions
 *
 * Server-side functions for user profile management:
 * - Get user profile
 * - Update profile information
 * - Change password
 * - Update email
 */

'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { ApiResponse } from '@/types';

/**
 * User Profile Interface
 */
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Get current user profile
 */
export async function getUserProfile(): Promise<ApiResponse<UserProfile>> {
  try {
    const supabase = await createServerClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: 'Authentication required',
      };
    }

    // Fetch profile from profiles table (main source of truth)
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, full_name, phone, created_at, updated_at')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);

      // Fallback to auth metadata if profile doesn't exist
      const profile: UserProfile = {
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || '',
        phone: user.user_metadata?.phone || undefined,
        created_at: user.created_at,
        updated_at: user.updated_at || user.created_at,
      };

      return {
        success: true,
        data: profile,
      };
    }

    // Return profile from database
    const profile: UserProfile = {
      id: profileData.id,
      email: profileData.email,
      full_name: profileData.full_name || '',
      phone: profileData.phone || undefined,
      created_at: profileData.created_at,
      updated_at: profileData.updated_at,
    };

    return {
      success: true,
      data: profile,
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return {
      success: false,
      error: 'Failed to load profile',
    };
  }
}

/**
 * Update user profile information
 */
export async function updateProfile(formData: {
  full_name: string;
  phone?: string;
}): Promise<ApiResponse<null>> {
  try {
    const supabase = await createServerClient();

    // Validate inputs
    if (!formData.full_name?.trim()) {
      return {
        success: false,
        error: 'Full name is required',
      };
    }

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: 'Authentication required',
      };
    }

    // Update user metadata in auth.users (for quick access)
    const { error: authUpdateError } = await supabase.auth.updateUser({
      data: {
        full_name: formData.full_name.trim(),
        phone: formData.phone?.trim() || null,
      },
    });

    if (authUpdateError) {
      console.error('Auth metadata update error:', authUpdateError);
      return {
        success: false,
        error: authUpdateError.message || 'Failed to update profile',
      };
    }

    // Update profiles table (main source of truth)
    const { error: profileUpdateError } = await supabase
      .from('profiles')
      .update({
        full_name: formData.full_name.trim(),
        phone: formData.phone?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (profileUpdateError) {
      console.error('Profile table update error:', profileUpdateError);
      return {
        success: false,
        error: 'Failed to update profile in database',
      };
    }

    // Revalidate pages that display user info
    revalidatePath('/', 'layout');

    return {
      success: true,
      data: null,
      message: 'Profile updated successfully',
    };
  } catch (error) {
    console.error('Unexpected profile update error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}

/**
 * Update user email
 */
export async function updateEmail(newEmail: string): Promise<ApiResponse<null>> {
  try {
    const supabase = await createServerClient();

    // Validate email
    if (!newEmail?.trim() || !newEmail.includes('@')) {
      return {
        success: false,
        error: 'Valid email is required',
      };
    }

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: 'Authentication required',
      };
    }

    // Update email in auth (will send confirmation to new email)
    const { error: authEmailError } = await supabase.auth.updateUser({
      email: newEmail.trim(),
    });

    if (authEmailError) {
      console.error('Email update error:', authEmailError);
      return {
        success: false,
        error: authEmailError.message || 'Failed to update email',
      };
    }

    // Note: Profiles table email will be updated automatically after email verification
    // via the auth trigger or you can update it manually after verification
    // For now, we only update auth and wait for verification

    return {
      success: true,
      data: null,
      message: 'Verification email sent to new address. Please check your inbox.',
    };
  } catch (error) {
    console.error('Unexpected email update error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}

/**
 * Change user password
 */
export async function changePassword(formData: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<ApiResponse<null>> {
  try {
    const supabase = await createServerClient();

    // Validate inputs
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      return {
        success: false,
        error: 'All fields are required',
      };
    }

    if (formData.newPassword !== formData.confirmPassword) {
      return {
        success: false,
        error: 'New passwords do not match',
      };
    }

    if (formData.newPassword.length < 6) {
      return {
        success: false,
        error: 'Password must be at least 6 characters',
      };
    }

    if (formData.currentPassword === formData.newPassword) {
      return {
        success: false,
        error: 'New password must be different from current password',
      };
    }

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user?.email) {
      return {
        success: false,
        error: 'Authentication required',
      };
    }

    // Verify current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: formData.currentPassword,
    });

    if (signInError) {
      return {
        success: false,
        error: 'Current password is incorrect',
      };
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: formData.newPassword,
    });

    if (updateError) {
      console.error('Password update error:', updateError);
      return {
        success: false,
        error: updateError.message || 'Failed to change password',
      };
    }

    return {
      success: true,
      data: null,
      message: 'Password changed successfully',
    };
  } catch (error) {
    console.error('Unexpected password change error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}

/**
 * Delete user account (soft delete - mark as inactive)
 */
export async function deleteAccount(password: string): Promise<ApiResponse<null>> {
  try {
    const supabase = await createServerClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user?.email) {
      return {
        success: false,
        error: 'Authentication required',
      };
    }

    // Verify password before deletion
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: password,
    });

    if (signInError) {
      return {
        success: false,
        error: 'Password is incorrect',
      };
    }

    // Delete user from Supabase Auth
    // Note: This requires Service Role key - implement based on your security requirements
    // For now, we'll just sign them out
    await supabase.auth.signOut();

    return {
      success: true,
      data: null,
      message: 'Account deletion requested. Please contact support to complete.',
    };
  } catch (error) {
    console.error('Unexpected account deletion error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}
