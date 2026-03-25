// RBAC Utility Functions
// Used by Meedhanshu's RBAC system and Anagha's portfolio pages

export type AccessLevel = 'public' | 'private';

/**
 * Get the current user's access level from localStorage
 */
export function getAccessLevel(): AccessLevel {
    if (typeof window === 'undefined') return 'public';
    return localStorage.getItem('rbac_access_level') === 'private' ? 'private' : 'public';
}

/**
 * Get the stored access code
 */
export function getAccessCode(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('rbac_access_code');
}

/**
 * Store access level and code after successful validation
 */
export function setAccess(code: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('rbac_access_code', code);
    localStorage.setItem('rbac_access_level', 'private');
}

/**
 * Clear access (revoke private access)
 */
export function clearAccess(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('rbac_access_code');
    localStorage.removeItem('rbac_access_level');
}

/**
 * Check if user has private access
 */
export function isPrivateAccessGranted(): boolean {
    return getAccessLevel() === 'private';
}

/**
 * Validate an access code against the server
 */
export async function validateAccessCode(code: string): Promise<{
    valid: boolean;
    error?: string;
}> {
    try {
        const res = await fetch('/api/validate-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: code.trim().toUpperCase() }),
        });

        const data = await res.json();
        return data;
    } catch {
        return { valid: false, error: 'Network error. Please try again.' };
    }
}
