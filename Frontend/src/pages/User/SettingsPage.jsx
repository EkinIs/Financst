import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router';
import { updateUserApi, deleteUserApi } from '../../api/authService';
import { useAuthStore, logoutUser } from '../../controller/Auth';
import { FiUser, FiLock, FiAlertTriangle, FiSave, FiTrash2 } from 'react-icons/fi';

const SettingsPage = () => {
    const { t } = useTranslation();
    
    // Zustand Hooks
    const user = useAuthStore((state) => state.user);
    const token = useAuthStore((state) => state.token);
    const setLogin = useAuthStore((state) => state.setLogin);
    
    const navigate = useNavigate();

    // Local state for profile form
    const [profileData, setProfileData] = useState({
        name: '',
        surname: '',
        email: ''
    });

    // Local state for password form
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    // UI States
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                surname: user.surname || '',
                email: user.email || ''
            });
        }
    }, [user]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        const updates = {
            name: profileData.name,
            surname: profileData.surname
        };

        const result = await updateUserApi(user.id, updates);

        if (result.error) {
            setMessage({ type: 'error', text: result.error });
        } else {
            setMessage({ type: 'success', text: t('settings.updatedSuccess') });
            // Update Zustand state with new user info, keeping the same token
            setLogin(result.user, token);
        }
        setIsLoading(false);
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            setMessage({ type: 'error', text: t('settings.passwordMismatch') });
            return;
        }

        if (passwordData.newPassword.length < 6) {
             setMessage({ type: 'error', text: t('settings.passwordLength') });
             return;
        }

        setIsLoading(true);

        const updates = {
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword
        };

        const result = await updateUserApi(user.id, updates);

        if (result.error) {
            setMessage({ type: 'error', text: result.error });
        } else {
            setMessage({ type: 'success', text: t('settings.passwordChanged') });
            setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        }
        setIsLoading(false);
    };

    const handleDeleteAccount = async () => {
        setIsLoading(true);
        const result = await deleteUserApi(user.id);

        if (result.error) {
             setMessage({ type: 'error', text: result.error });
             setIsLoading(false);
             setDeleteConfirmOpen(false);
        } else {
            // Logout and redirect
            await logoutUser();
            navigate('/');
        }
    };

    if (!user) return <div className="p-10 text-center text-gray-500 dark:text-white">{t('settings.loading')}</div>;

    return (
        <div className="w-full p-6 md:p-12 font-sans fade-in pb-24">
            <div className="max-w-4xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white bg-clip-text bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500">
                        {t('settings.title')}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">{t('settings.subTitle')}</p>
                </div>

                {/* Feedback Message */}
                {message.text && (
                    <div className={`p-4 rounded-lg flex items-center gap-2 ${message.type === 'error' ? 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/50' : 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-500/20 dark:text-green-300 dark:border-green-500/50'}`}>
                        {message.type === 'error' ? <FiAlertTriangle /> : <FiSave />}
                        {message.text}
                    </div>
                )}

                {/* Profile Section */}
                <section className="bg-white dark:bg-midnight-dark rounded-xl p-6 shadow-sm dark:shadow-lg border border-gray-200 dark:border-gray-700/50">
                    <div className="flex items-center gap-2 mb-6 text-xl text-blue-600 dark:text-blue-400 font-semibold">
                        <FiUser />
                        <h2>{t('settings.profileInfo')}</h2>
                    </div>
                    
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.firstName')}</label>
                                <input 
                                    type="text" 
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-midnight-dark/50 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.lastName')}</label>
                                <input 
                                    type="text" 
                                    value={profileData.surname}
                                    onChange={(e) => setProfileData({...profileData, surname: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-midnight-dark/50 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.email')}</label>
                            <input 
                                type="email" 
                                value={profileData.email}
                                disabled
                                className="w-full bg-gray-100 dark:bg-midnight-dark/50 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2.5 text-gray-500 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500 mt-1">{t('settings.emailNote')}</p>
                        </div>

                        <div className="flex justify-end">
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? t('settings.saving') : <>{t('settings.saveChanges')}</>}
                            </button>
                        </div>
                    </form>
                </section>

                {/* Security Section */}
                {(!user.authProvider || user.authProvider === 'local') && (
                    <section className="bg-white dark:bg-midnight-dark rounded-xl p-6 shadow-sm dark:shadow-lg border border-gray-200 dark:border-gray-700/50">
                        <div className="flex items-center gap-2 mb-6 text-xl text-purple-600 dark:text-purple-400 font-semibold">
                            <FiLock />
                            <h2>{t('settings.security')}</h2>
                        </div>

                        <form onSubmit={handlePasswordUpdate} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.currentPassword')}</label>
                                <input 
                                    type="password" 
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-midnight-dark/50 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.newPassword')}</label>
                                    <input 
                                        type="password" 
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                        className="w-full bg-gray-50 dark:bg-midnight-dark/50 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.confirmNewPassword')}</label>
                                    <input 
                                        type="password" 
                                        value={passwordData.confirmNewPassword}
                                        onChange={(e) => setPasswordData({...passwordData, confirmNewPassword: e.target.value})}
                                        className="w-full bg-gray-50 dark:bg-midnight-dark/50 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button 
                                    type="submit" 
                                    disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword}
                                    className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? t('settings.updating') : <>{t('settings.updatePassword')}</>}
                                </button>
                            </div>
                        </form>
                    </section>
                )}

                {/* Danger Zone */}
                <section className="border border-red-500/30 bg-red-50 dark:bg-midnight-dark/5 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4 text-xl text-red-600 dark:text-red-400 font-semibold">
                        <FiAlertTriangle />
                        <h2>{t('settings.dangerZone')}</h2>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">{t('settings.deleteAccount')}</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">{t('settings.deleteAccountDesc')}</p>
                        </div>
                        <button 
                            onClick={() => setDeleteConfirmOpen(true)}
                            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg font-medium transition-colors whitespace-nowrap"
                        >
                            {t('settings.deleteAccount')}
                        </button>
                    </div>
                </section>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirmOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-midnight-dark rounded-2xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-700 shadow-2xl transform transition-all scale-100">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiTrash2 className="text-3xl text-red-600 dark:text-red-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('settings.deleteAccountModalTitle')}</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">{t('settings.deleteAccountModalDesc')}</p>
                            
                            <div className="flex gap-3 justify-center">
                                <button 
                                    onClick={() => setDeleteConfirmOpen(false)}
                                    className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-gray-800 dark:text-white font-medium transition-colors"
                                >
                                    {t('settings.cancel')}
                                </button>
                                <button 
                                    onClick={handleDeleteAccount}
                                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors"
                                >
                                    {t('settings.deleteAccountConfirm')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPage;
