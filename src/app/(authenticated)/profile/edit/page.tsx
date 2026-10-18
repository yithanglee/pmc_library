'use client';

import DynamicForm from "@/components/data/dynaform";
import { useEffect, useState } from "react";
import { genInputs } from '@/lib/svt_utils'
import { PHX_ENDPOINT, PHX_HTTP_PROTOCOL } from "@/lib/constants";
import { useRouter } from 'next/navigation';
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserCog } from "lucide-react";
import Link from "next/link";

export default function EditProfilePage() {
    const { user, updateUserProfile } = useAuth();
    const router = useRouter();
    const [colInputs, setColInputs] = useState<any[]>([]);
    const url = PHX_HTTP_PROTOCOL + PHX_ENDPOINT;

    useEffect(() => {
        const fetchColInputs = async () => {
            const inputs = await genInputs(url, 'Member');
            setColInputs(inputs);
        };
        fetchColInputs();
    }, []);

    const handleUpdateProfile = async (e: any) => {
        try {
            await updateUserProfile(e.email, e.name);
            toast({
                title: "Profile Updated",
                description: "Your member profile details have been saved.",
            });
            window.location.href = '/profile';
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <Link href="/profile">
                    <Button variant="ghost" className="text-stone-600 hover:text-stone-900 -ml-3 gap-2 text-sm">
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to My Loans & Profile</span>
                    </Button>
                </Link>
            </div>

            <div className="paper-card rounded-3xl p-6 sm:p-8 lg:p-10 space-y-6">
                <div className="flex items-center gap-3.5 border-b border-stone-200/80 pb-6">
                    <div className="h-12 w-12 rounded-2xl bg-rose-900/10 text-rose-900 flex items-center justify-center shrink-0">
                        <UserCog className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                            Edit Member Profile
                        </h1>
                        <p className="text-sm text-stone-500 mt-0.5">
                            Update your contact information and library membership preferences
                        </p>
                    </div>
                </div>

                <div className="pt-2">
                    {user ? (
                        <DynamicForm
                            style="flat"
                            data={user.userStruct}
                            inputs={colInputs}
                            customCols={[
                                {
                                    title: 'Personal Information',
                                    description: 'Your personal information',
                                    list: [
                                        { label: 'id', alt_class: 'hidden w-1/3 mx-4 my-2' },
                                        { label: 'name', alt_class: 'w-full mx-4 my-2' },
                                        { label: 'email', alt_class: 'w-full mx-4 my-2 lg:w-2/3' },
                                        { label: 'phone', alt_class: 'w-full mx-4 my-2 lg:w-1/3' },
                                    ]
                                },
                                {
                                    title: 'Additional Details',
                                    description: 'Other information about you',
                                    list: [
                                        { label: 'address', alt_class: 'w-full mx-4 my-2' },
                                        { label: 'notes', alt_class: 'w-full mx-4 my-2' },
                                    ]
                                }
                            ]}
                            module={'Member'}
                            postFn={handleUpdateProfile}
                        />
                    ) : (
                        <div className="py-12 text-center text-sm text-stone-500">
                            Loading your profile details...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}