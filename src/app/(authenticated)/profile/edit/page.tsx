'use client';

import DynamicForm from "@/components/data/dynaform";
import { useEffect, useState } from "react";
import { genInputs } from '@/lib/svt_utils'
import { PHX_ENDPOINT, PHX_HTTP_PROTOCOL } from "@/lib/constants";
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserCog } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/i18n";

export default function EditProfilePage() {
    const { user, updateUserProfile } = useAuth();
    const { t } = useLanguage();
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
                title: t("会友资料已更新！", "Profile Updated!"),
                description: t("您的个人资料已成功保存。", "Your member profile details have been saved."),
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
                    <Button variant="ghost" className="text-slate-600 hover:text-[#0097bf] hover:bg-sky-50/60 -ml-3 gap-2 text-sm font-medium rounded-full px-4">
                        <ArrowLeft className="h-4 w-4" />
                        <span>{t('返回会友借阅特区', 'Back to My Loans & Profile')}</span>
                    </Button>
                </Link>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 lg:p-10 space-y-6 shadow-sm">
                <div className="flex items-center gap-3.5 border-b border-slate-100 pb-6">
                    <div className="h-11 w-11 rounded-xl bg-sky-50 text-[#00bff2] border border-sky-100 flex items-center justify-center shrink-0">
                        <UserCog className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-800">
                            {t('编辑会友资料', 'Edit Member Profile')}
                        </h1>
                        <p className="text-sm text-slate-500 mt-0.5">
                            {t('更新您的联络方式与图书馆会友借阅信息', 'Update your contact information and library membership details')}
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
                                    title: t('个人基本资料', 'Personal Information'),
                                    description: t('您的姓名、电子邮箱与电话', 'Your personal information'),
                                    list: [
                                        { label: 'id', alt_class: 'hidden w-1/3 mx-4 my-2' },
                                        { label: 'name', alt_class: 'w-full mx-4 my-2' },
                                        { label: 'email', alt_class: 'w-full mx-4 my-2 lg:w-2/3' },
                                        { label: 'phone', alt_class: 'w-full mx-4 my-2 lg:w-1/3' },
                                    ]
                                },
                                {
                                    title: t('其他资料', 'Additional Details'),
                                    description: t('通讯地址与备注信息', 'Other information about you'),
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
                        <div className="py-12 text-center text-sm font-medium text-slate-500">
                            {t('正在加载您的会友资料...', 'Loading your profile details...')}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}