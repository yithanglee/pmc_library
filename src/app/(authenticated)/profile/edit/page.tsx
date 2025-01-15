'use client';

import DynamicForm from "@/components/data/dynaform";

import { useEffect, useState } from "react";
import { genInputs } from '@/lib/svt_utils'
import { PHX_ENDPOINT, PHX_HTTP_PROTOCOL } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";
import { useRouter } from 'next/navigation';
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth";

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
        console.log("data", e)
        try {
            await updateUserProfile(e.email, e.name);
            toast({
                title: "Success",
                description: "Profile updated successfully.",
            });
            window.location.href = '/profile';
        } catch (error) {
            console.error("Error updating profile:", error);
          
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-bold tracking-tight">Edit Profile</h2>
                    <div className="text-sm text-gray-500">Update your personal details here</div>
                </div>
            </div>
            <Separator />
            <div className="grid grid-cols-6">
                <div className="col-span-6">
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
                    ) : null}
                    
                </div>
            </div>
        </div>
    );
} 