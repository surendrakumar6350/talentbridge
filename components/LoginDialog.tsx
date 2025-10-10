"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { GoogleLogin } from "@react-oauth/google";

interface LoginDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function LoginDialog({ isOpen, onClose }: LoginDialogProps) {
    const success = async (credentialResponse: any) => {
        try {
            const credential = credentialResponse?.credential;
            if (!credential) return alert('Missing credential from Google');

            const res = await fetch('/api/auth/google', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ credential }) });
            const j = await res.json();
            if (j.success && j.token) {
                localStorage.setItem('token', j.token);
                alert('Login successful');
                onClose();
                window.location.href = '/';
            } else {
                alert(j.message || 'Login failed');
            }
        } catch (err: any) {
            alert(err.message || String(err));
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Login to Your Account</DialogTitle>
                    <DialogDescription>Choose your preferred login method</DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-center py-4">
                    <GoogleLogin
                        width="100%"
                        size="large"
                        text="continue_with"
                        onSuccess={success}
                        onError={() => alert('Login Failed')}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
