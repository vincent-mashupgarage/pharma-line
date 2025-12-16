/**
 * Profile Settings Page
 *
 * Allows users to view and edit their profile information
 * Includes: name, email, phone
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserProfile, updateProfile, updateEmail } from '@/lib/actions/profile-actions';
import type { UserProfile } from '@/lib/actions/profile-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle2, Loader2, Mail, Phone, User } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [emailSaving, setEmailSaving] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
  });

  const [emailData, setEmailData] = useState({
    newEmail: '',
  });

  // Load profile on mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    const result = await getUserProfile();

    if (!result.success) {
      toast.error('Failed to load profile');
      if (result.error === 'Authentication required') {
        router.push('/login?redirect=/account/profile');
      }
      return;
    }

    if (result.data) {
      setProfile(result.data);
      setFormData({
        full_name: result.data.full_name || '',
        phone: result.data.phone || '',
      });
    }

    setLoading(false);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const result = await updateProfile(formData);

      if (!result.success) {
        toast.error(result.error || 'Failed to update profile');
        return;
      }

      toast.success('Profile updated successfully');
      await loadProfile(); // Reload to get updated data
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSaving(true);

    try {
      const result = await updateEmail(emailData.newEmail);

      if (!result.success) {
        toast.error(result.error || 'Failed to update email');
        return;
      }

      toast.success(result.message || 'Email update initiated');
      setEmailData({ newEmail: '' });
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setEmailSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="flex min-h-[400px] flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Failed to Load Profile</h2>
          <p className="text-muted-foreground mb-6">
            Please try refreshing the page or logging in again.
          </p>
          <Button onClick={() => router.push('/login')}>Go to Login</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Personal Information Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="full_name"
                  type="text"
                  placeholder="Juan Dela Cruz"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  required
                  disabled={saving}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="09171234567"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  disabled={saving}
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Used for delivery updates and order confirmations
              </p>
            </div>

            {/* Account Created Date */}
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm font-medium mb-1">Account Created</p>
              <p className="text-sm text-muted-foreground">
                {new Date(profile.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            <Separator />

            {/* Save Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={saving} size="lg">
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Email Address Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle>Email Address</CardTitle>
              <CardDescription>
                Change your email address (requires verification)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            {/* Current Email */}
            <div className="space-y-2">
              <Label>Current Email</Label>
              <div className="rounded-lg bg-muted/50 px-4 py-3 border border-border">
                <p className="font-medium">{profile.email}</p>
              </div>
            </div>

            {/* New Email */}
            <div className="space-y-2">
              <Label htmlFor="new_email">New Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="new_email"
                  type="email"
                  placeholder="newemail@example.com"
                  value={emailData.newEmail}
                  onChange={(e) =>
                    setEmailData({ newEmail: e.target.value })
                  }
                  disabled={emailSaving}
                  className="pl-10"
                />
              </div>
              <Alert className="mt-3">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  You will receive a verification email at your new address. Your email will be updated once you click the verification link.
                </AlertDescription>
              </Alert>
            </div>

            <Separator />

            {/* Update Email Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={emailSaving || !emailData.newEmail}
                variant="outline"
                size="lg"
              >
                {emailSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Update Email
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Security Link */}
      <Card className="border-dashed">
        <CardContent className="flex items-center justify-between py-6">
          <div>
            <p className="font-medium">Password & Security</p>
            <p className="text-sm text-muted-foreground mt-1">
              Change your password and manage security settings
            </p>
          </div>
          <Button asChild variant="outline">
            <a href="/account/security">Manage Security</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
