'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function AdminApprovePage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<string>('Initializing...');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const id = searchParams?.get('id');
        const action = searchParams?.get('action');

        if (!id || !action || !['approve', 'deny'].includes(action)) {
            setStatus('Invalid approval link parameters.');
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setStatus('Authentication required. Redirecting to login...');
                setTimeout(() => {
                    router.push(`/admin/login?redirect=/admin/approve?id=${id}&action=${action}`);
                }, 1500);
                return;
            }

            // User is authenticated, proceed automatically
            if (!isProcessing) {
                processApproval(id, action);
            }
        });

        return () => unsubscribe();
    }, [searchParams, router]);

    const processApproval = async (id: string, action: string) => {
        setIsProcessing(true);
        setStatus(`Processing ${action} decision...`);

        try {
            const requestRef = doc(db, 'access_requests', id);
            const requestDoc = await getDoc(requestRef);

            if (!requestDoc.exists()) {
                setStatus('Error: Access request not found.');
                setIsProcessing(false);
                return;
            }

            const data = requestDoc.data();

            if (data.status !== 'pending') {
                setStatus(`Notice: This request has already been ${data.status}. Redirecting to dashboard...`);
                setTimeout(() => router.push('/admin/access-requests'), 2500);
                return;
            }

            if (action === 'approve') {
                await updateDoc(requestRef, {
                    status: 'approved',
                    approved_at: serverTimestamp(),
                });

                if (data.uid) {
                    await setDoc(doc(db, 'users', data.uid), { access_level: 'private' }, { merge: true });
                }

                setStatus('Database updated. Dispatching approval email...');
                
                // Send Email
                await fetch('/api/send-approval-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'approve',
                        email: data.requester_email,
                        name: data.requester_name
                    })
                });

                setStatus('Success! Request approved and email dispatched. Redirecting...');
            } else {
                await updateDoc(requestRef, {
                    status: 'denied',
                });
                
                setStatus('Database updated. Dispatching denial email...');

                // Send Email
                await fetch('/api/send-approval-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'deny',
                        email: data.requester_email,
                        name: data.requester_name
                    })
                });

                setStatus('Success! Request denied and email dispatched. Redirecting...');
            }

            setTimeout(() => router.push('/admin/access-requests'), 2000);

        } catch (error: any) {
            console.error('Error processing approval:', error);
            setStatus(`Error: ${error.message}`);
            setIsProcessing(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', color: '#333' }}>
            <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
                <i className="fa-solid fa-envelope-open-text" style={{ fontSize: '48px', color: '#667eea', marginBottom: '20px' }}></i>
                <h2 style={{ margin: '0 0 16px', fontSize: '24px' }}>Processing Request</h2>
                <p style={{ margin: '0 0 24px', color: '#666' }}>{status}</p>
                {isProcessing && <div className="spinner-border text-primary"></div>}
            </div>
        </div>
    );
}
