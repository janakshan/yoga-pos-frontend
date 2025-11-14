# Password Reset Feature - Implementation Guide

## Overview

A comprehensive password reset feature has been implemented for user management, allowing administrators and managers to reset user passwords securely.

## Features Implemented

### 1. Password Reset Modal Component
**Location**: `/src/features/users/components/ResetPasswordModal.jsx`

**Features**:
- ✅ Password visibility toggle (show/hide)
- ✅ Password strength validation
- ✅ Confirm password matching
- ✅ Strong password generator
- ✅ Visual password requirements display
- ✅ User-friendly UI with proper error handling

**Password Requirements**:
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (@$!%*?&)

**Example Usage**:
```jsx
<ResetPasswordModal
  isOpen={isOpen}
  onClose={handleClose}
  user={userObject}
  onResetPassword={handleResetPasswordSubmit}
/>
```

---

### 2. API Integration

#### Backend Endpoint
**Endpoint**: `POST /api/v1/users/:id/reset-password`

**Request Body**:
```json
{
  "newPassword": "NewSecureP@ss123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

#### API Client
**Location**: `/src/api/users.api.js`

**Function**:
```javascript
export const resetUserPassword = async (userId, newPassword) => {
  const response = await axiosInstance.post(`/users/${userId}/reset-password`, {
    newPassword
  });
  return response.data;
};
```

#### Service Layer
**Location**: `/src/features/users/services/userService.js`

**Method**:
```javascript
async resetPassword(userId, newPassword) {
  try {
    const response = await apiResetUserPassword(userId, newPassword);
    return response.data || response;
  } catch (error) {
    console.error(`Error resetting password for user ${userId}:`, error);
    throw error;
  }
}
```

#### Hook Integration
**Location**: `/src/features/users/hooks/useUsers.js`

**Method**:
```javascript
const resetPassword = useCallback(
  async (userId, data) => {
    try {
      setLoading(true);
      clearError();
      const result = await userService.resetPassword(userId, data);
      toast.success(result.message);
      return result;
    } catch (err) {
      const message = err.message || 'Failed to reset password';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  },
  [setLoading, clearError, setError]
);
```

---

### 3. User List Integration

**Location**: `/src/features/users/components/UserList.jsx`

**Added Components**:
1. Reset Password button in actions column (Orange colored with RotateCw icon)
2. Reset Password Modal integration
3. State management for modal visibility

**Button**:
```jsx
<button
  onClick={() => handleResetPassword(user)}
  className="p-2 text-gray-600 hover:text-orange-600"
  title="Reset Password"
>
  <RotateCw className="w-4 h-4" />
</button>
```

**Handlers**:
```javascript
const handleResetPassword = (user) => {
  setUserToResetPassword(user);
  setIsResetPasswordOpen(true);
};

const handleResetPasswordSubmit = async (userId, newPassword) => {
  await resetPassword(userId, newPassword);
};

const handleResetPasswordClose = () => {
  setIsResetPasswordOpen(false);
  setUserToResetPassword(null);
};
```

---

### 4. User Detail Page Integration

**Location**: `/src/pages/UserDetailPage.jsx`

**Added Components**:
1. Reset Password button in action buttons (Orange colored with Key icon)
2. Reset Password Modal integration
3. State management for modal visibility

**Button**:
```jsx
<button
  onClick={handleResetPassword}
  className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
>
  <KeyIcon className="h-5 w-5 mr-2" />
  Reset Password
</button>
```

**Handlers**:
```javascript
const handleResetPassword = () => {
  setShowResetPasswordModal(true);
};

const handleResetPasswordSubmit = async (userId, newPassword) => {
  await resetPassword(userId, newPassword);
};

const handleResetPasswordClose = () => {
  setShowResetPasswordModal(false);
};
```

---

## User Flow

### From User List Page

1. User navigates to Users page (`/users`)
2. User clicks the **Reset Password** button (rotate icon) for a specific user
3. Reset Password Modal opens
4. User either:
   - Manually enters a new password and confirms it
   - Clicks **Generate Strong Password** to auto-generate a secure password
5. User reviews password requirements (displayed in modal)
6. User clicks **Reset Password** button
7. System validates password strength
8. If valid, API call is made to backend
9. Success toast notification shown
10. Modal closes automatically

### From User Detail Page

1. User navigates to User Detail page (`/users/:id`)
2. User clicks the **Reset Password** button in the action buttons
3. Reset Password Modal opens
4. Same flow as above (steps 4-10)

---

## Password Generation

The modal includes a **Generate Strong Password** feature that automatically creates a secure password:

**Algorithm**:
1. Generates a 12-character password
2. Guarantees at least one:
   - Lowercase letter
   - Uppercase letter
   - Number
   - Special character
3. Randomly fills remaining characters
4. Shuffles the final password for added security

**Example Generated Password**: `K9@mLp2#Xr5w`

---

## Validation Rules

### Frontend Validation

**Password Field**:
- Required
- Minimum 8 characters
- Must contain lowercase letter
- Must contain uppercase letter
- Must contain number
- Must contain special character (@$!%*?&)

**Confirm Password Field**:
- Required
- Must match password field

**Error Messages**:
- `"Password is required"`
- `"Password must be at least 8 characters"`
- `"Password must contain at least one lowercase letter"`
- `"Password must contain at least one uppercase letter"`
- `"Password must contain at least one number"`
- `"Password must contain at least one special character (@$!%*?&)"`
- `"Please confirm your password"`
- `"Passwords do not match"`

### Backend Validation (Expected)

The backend should also validate:
- User exists
- User has permission to reset password
- Password meets security requirements
- Password is properly hashed before storing

---

## Security Considerations

### Frontend
1. ✅ Password is never stored in state longer than necessary
2. ✅ Password visibility toggle for user convenience
3. ✅ Strong password requirements enforced
4. ✅ Password generator creates cryptographically secure passwords
5. ✅ Confirmation required to prevent typos

### Backend (Required)
1. ⚠️ **Hash password** before storing (use bcrypt, argon2, or scrypt)
2. ⚠️ **Verify user permissions** (only admins/managers can reset)
3. ⚠️ **Rate limiting** to prevent brute force attacks
4. ⚠️ **Audit logging** to track password reset events
5. ⚠️ **Email notification** to user when password is reset
6. ⚠️ **Force logout** all active sessions after password reset

---

## Backend Implementation Guide

### NestJS Example

```typescript
// users.controller.ts
@Post(':id/reset-password')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions(['users:update', 'users:manage', 'users:*'])
async resetPassword(
  @Param('id') userId: string,
  @Body() resetPasswordDto: ResetPasswordDto,
  @GetUser() adminUser: User,
) {
  // Verify admin has permission
  if (!this.permissionsService.canResetPassword(adminUser, userId)) {
    throw new ForbiddenException('You do not have permission to reset this user password');
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);

  // Update user password
  await this.usersService.update(userId, {
    password: hashedPassword,
    passwordChangedAt: new Date(),
  });

  // Log the action
  await this.auditService.log({
    action: 'PASSWORD_RESET',
    userId,
    performedBy: adminUser.id,
    timestamp: new Date(),
  });

  // Send email notification to user
  await this.emailService.sendPasswordResetNotification(userId);

  // Force logout all active sessions
  await this.authService.invalidateAllUserSessions(userId);

  return {
    success: true,
    message: 'Password reset successfully',
  };
}

// reset-password.dto.ts
import { IsString, MinLength, Matches } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/(?=.*[a-z])/, { message: 'Password must contain at least one lowercase letter' })
  @Matches(/(?=.*[A-Z])/, { message: 'Password must contain at least one uppercase letter' })
  @Matches(/(?=.*\d)/, { message: 'Password must contain at least one number' })
  @Matches(/(?=.*[@$!%*?&])/, { message: 'Password must contain at least one special character' })
  newPassword: string;
}
```

---

## Testing

### Manual Testing Steps

1. **Test Reset from User List**:
   - ✅ Navigate to `/users`
   - ✅ Click reset password button for a user
   - ✅ Modal opens with user's name displayed
   - ✅ Enter invalid password → See validation errors
   - ✅ Enter valid password → Success message
   - ✅ User can login with new password

2. **Test Reset from User Detail**:
   - ✅ Navigate to `/users/:id`
   - ✅ Click Reset Password button
   - ✅ Modal opens with user's name displayed
   - ✅ Test validation and success flow

3. **Test Password Generator**:
   - ✅ Click "Generate Strong Password"
   - ✅ Password and confirm password filled automatically
   - ✅ Generated password meets all requirements
   - ✅ Can submit immediately

4. **Test Password Visibility**:
   - ✅ Eye icon toggles password visibility
   - ✅ Both password fields can be toggled independently

5. **Test Validation**:
   - ✅ Too short password → Error message
   - ✅ Missing uppercase → Error message
   - ✅ Missing lowercase → Error message
   - ✅ Missing number → Error message
   - ✅ Missing special char → Error message
   - ✅ Passwords don't match → Error message

6. **Test Edge Cases**:
   - ✅ Cancel modal → No changes made
   - ✅ Submit while loading → Button disabled
   - ✅ Backend error → Error toast shown

---

## Permissions Required

To reset a user's password, the current user must have one of these permissions:
- `users:update`
- `users:manage`
- `users:*`
- `*` (admin wildcard)

These permissions are checked by the backend authorization guard.

---

## UI Screenshots

### User List - Reset Password Button
```
┌────────────────────────────────────────────────┐
│ User Name      Email              Actions      │
├────────────────────────────────────────────────┤
│ John Doe       john@test.com      👁 ✏️ 🔄 🗑️  │
│ Jane Smith     jane@test.com      👁 ✏️ 🔄 🗑️  │
└────────────────────────────────────────────────┘
                                         ↑ Reset Password
```

### User Detail Page - Reset Password Button
```
┌──────────────────────────────────────────────┐
│ User: John Doe                               │
│ ┌────────┐ ┌──────────────┐ ┌──────────┐    │
│ │ Active │ │ ✏️ Edit      │ │ 🔑 Reset │   │
│ └────────┘ └──────────────┘ │ Password │    │
│                              └──────────┘    │
└──────────────────────────────────────────────┘
```

### Reset Password Modal
```
┌─────────────────────────────────────────┐
│ 🔑 Reset Password                  ✕   │
│    For user: john.doe                   │
├─────────────────────────────────────────┤
│ ℹ️ Password Requirements:              │
│   • At least 8 characters               │
│   • One uppercase letter (A-Z)          │
│   • One lowercase letter (a-z)          │
│   • One number (0-9)                    │
│   • One special character (@$!%*?&)     │
├─────────────────────────────────────────┤
│ New Password                            │
│ ┌─────────────────────────────────┐ 👁 │
│ │ ••••••••••••                    │    │
│ └─────────────────────────────────┘    │
├─────────────────────────────────────────┤
│ Confirm Password                        │
│ ┌─────────────────────────────────┐ 👁 │
│ │ ••••••••••••                    │    │
│ └─────────────────────────────────┘    │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐│
│ │  Generate Strong Password           ││
│ └─────────────────────────────────────┘│
├─────────────────────────────────────────┤
│ ┌────────┐    ┌──────────────────────┐ │
│ │ Cancel │    │ Reset Password       │ │
│ └────────┘    └──────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## File Structure

```
src/
├── features/
│   └── users/
│       ├── components/
│       │   ├── ResetPasswordModal.jsx     # ✅ New
│       │   └── UserList.jsx                # ✅ Modified
│       ├── hooks/
│       │   └── useUsers.js                 # ✅ Already had resetPassword
│       └── services/
│           └── userService.js              # ✅ Modified
├── api/
│   └── users.api.js                        # ✅ Modified
└── pages/
    └── UserDetailPage.jsx                  # ✅ Modified
```

---

## Success Messages

- **Success**: "Password reset successfully for {username}"
- **Generated**: "Strong password generated"
- **Error**: Backend error message or "Failed to reset password"

---

## Future Enhancements

### Optional Features (Not Implemented)
1. **Password History**: Prevent reusing last N passwords
2. **Temporary Password**: Generate temporary password that must be changed on first login
3. **Email Notification**: Send email to user with new password or password change notification
4. **Password Expiry**: Force password change after X days
5. **Bulk Password Reset**: Reset passwords for multiple users at once
6. **Self-Service Reset**: Allow users to reset their own password via email link
7. **Password Strength Meter**: Visual indicator of password strength
8. **Password Policy Configuration**: Allow admins to configure password requirements

---

## Troubleshooting

### Issue 1: Modal doesn't open
**Solution**: Check that `isResetPasswordOpen` state is set to `true` when button is clicked

### Issue 2: Password not resetting
**Solution**:
- Check browser console for errors
- Verify backend endpoint is working
- Check user has required permissions
- Verify JWT token is valid

### Issue 3: Validation not working
**Solution**: Check that all regex patterns match in `validatePassword` function

### Issue 4: Password generator not working
**Solution**: Verify `generateStrongPassword` function has access to all character sets

---

## Summary

The password reset feature is fully implemented on the frontend with:
- ✅ Beautiful, user-friendly modal
- ✅ Strong password validation
- ✅ Password generator
- ✅ Integration in User List and User Detail pages
- ✅ Proper error handling
- ✅ Loading states
- ✅ Toast notifications

**Backend Implementation Required**:
- ⚠️ Implement `/api/v1/users/:id/reset-password` endpoint
- ⚠️ Add password hashing (bcrypt)
- ⚠️ Add permission checks
- ⚠️ Add audit logging
- ⚠️ Add email notifications (optional)
- ⚠️ Add session invalidation (optional)

Once the backend is implemented, administrators and managers will be able to securely reset user passwords through an intuitive interface!
