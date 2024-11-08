"use client"

import { Loading } from '@/components/loading';
import * as React from 'react';
import { toast } from 'sonner';

type PrivacyPolicy = {
    id: number;
    description: string;
    title: string;
    dateCreated: string;
    dateUpdated: string;
};

const PrivacyPolicyPage = () => {
    const [privacyPolicy, setPrivacyPolicy] = React.useState<PrivacyPolicy | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);

    const fetchPrivacyPolicy = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/privacypolicys`);
            if (!response.ok) throw new Error("Failed to fetch privacy policy.");
            const data = await response.json();
            setPrivacyPolicy(data[0]);
        } catch (error) {
            console.error("Error fetching privacy policy:", error);
            toast.error("Failed to fetch privacy policy");
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchPrivacyPolicy();
    }, [loading]);

    if (loading) {
        return (
            <div className='h-[calc(100vh-380px)]'>
                <Loading />
            </div>
        )
    }


    return (
        <div className="container">
            <h1 className="font-bold text-center text-2xl">INSYNC - PRIVACY POLICY</h1>
            <div
                className="rich-text default-style"
                dangerouslySetInnerHTML={{ __html: privacyPolicy?.description || '' }}
            />


        </div>
    )
}

export default PrivacyPolicyPage 