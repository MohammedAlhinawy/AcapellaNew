import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import MainLayout from '../../Layout/MainLayout';
import managerService from '../../Services/managerService';
import uploadService from '../../Services/uploadService';
import { toast } from '../../Components/ToastContainer';
import CreateChoirDialog from '../../Components/CreateChoirDialog';
import CreateChoirDraggableBox from '../../Components/CreateChoirDraggableBox';
import EditChoirDialog from '../../Components/EditChoirDialog';
import EditChoirDraggableBox from '../../Components/EditChoirDraggableBox';
import '../../../css/manager.css';
import useTranslation from '../../hooks/useTranslation';

export default function Choirs() {
    const { t } = useTranslation();
    const [choirs, setChoirs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedChoir, setSelectedChoir] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const fetchChoirs = async () => {
            try {
                const data = await managerService.getMyChoirs();
                setChoirs(Array.isArray(data) ? data : []);
            } catch {
                setChoirs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchChoirs();
    }, []);

    const handleCreateChoir = () => {
        setIsCreateDialogOpen(true);
    };

    const handleEditChoir = (choir) => {
        setSelectedChoir(choir);
        setIsEditDialogOpen(true);
    };

    const handleSaveChoir = async (data) => {
        try {
            // If there's an image file, use FormData and uploadService
            if (data.image instanceof File) {
                const formData = new FormData();
                formData.append('name', data.name);
                formData.append('location', data.location);
                formData.append('bio', data.bio || '');
                if (data.image) {
                    formData.append('image', data.image);
                }
                
                await uploadService.createChoir(formData);
            } else {
                // No image, use regular managerService
                await managerService.createChoir(data);
            }
            
            setIsCreateDialogOpen(false);
            toast.success(t('manager.choir_created_success'));
            // Refresh the choirs list
            const updatedChoirs = await managerService.getMyChoirs();
            setChoirs(Array.isArray(updatedChoirs) ? updatedChoirs : []);
        } catch (_error) {
            // Display specific error message if available
            const errorMessage = _error.response?.data?.message || 
                                _error.response?.data?.errors?.image?.[0] ||
                                _error.response?.data?.errors?.name?.[0] ||
                                _error.response?.data?.errors?.location?.[0] ||
                                'Failed to create choir';
            
            toast.error(errorMessage);
        }
    };

    const handleUpdateChoir = async (data) => {
        try {
            // If there's an image file, use FormData and uploadService
            if (data.image instanceof File) {
                const formData = new FormData();
                formData.append('name', data.name);
                formData.append('location', data.location);
                formData.append('bio', data.bio || '');
                if (data.image) {
                    formData.append('image', data.image);
                }
                formData.append('_method', 'PUT');
                
                await uploadService.updateChoir(selectedChoir.id, formData);
            } else {
                // No image, use regular managerService
                await managerService.updateChoir(selectedChoir.id, data);
            }
            
            setIsEditDialogOpen(false);
            setSelectedChoir(null);
            toast.success(t('manager.choir_updated_success'));
            // Refresh the choirs list
            const updatedChoirs = await managerService.getMyChoirs();
            setChoirs(Array.isArray(updatedChoirs) ? updatedChoirs : []);
        } catch (_error) {
            // Display specific error message if available
            const errorMessage = _error.response?.data?.message || 
                                _error.response?.data?.errors?.image?.[0] ||
                                _error.response?.data?.errors?.name?.[0] ||
                                _error.response?.data?.errors?.location?.[0] ||
                                'Failed to update choir';
            
            toast.error(errorMessage);
        }
    };

    return (
        <MainLayout>
            <div className="manager-page">
                <div className="manager-container">
                    <div className="manager-header">
                        <h1>{t('manager.my_choirs')}</h1>
                        <p>{t('manager.manage_choir_profiles')}</p>
                    </div>

                    <div className="manager-section-header">
                        <span className="manager-section-count">
                            {loading ? t('manager.loading') : `${choirs.length} ${choirs.length === 1 ? t('manager.choir') : t('manager.choirs')}`}
                        </span>
                        <button onClick={handleCreateChoir} className="manager-primary-button">
                            + {t('manager.create_new_choir')}
                        </button>
                    </div>

                    {loading ? (
                        <div className="manager-empty-state">
                            <p>{t('manager.loading')}</p>
                        </div>
                    ) : choirs.length === 0 ? (
                        <div className="manager-empty-state">
                            <div className="manager-empty-icon">🎶</div>
                            <h3 className="manager-empty-title">{t('manager.no_choirs_yet')}</h3>
                            <p className="manager-empty-description">
                                {t('manager.create_first_choir')}
                            </p>
                            <button onClick={handleCreateChoir} className="manager-primary-button">
                                {t('manager.create_your_first_choir')}
                            </button>
                        </div>
                    ) : (
                        <div className="manager-choirs-grid">
                            {choirs.map((choir) => (
                                <div key={choir.id} className="manager-choir-card">
                                    <div className="manager-choir-avatar">
                                        {choir.image_path ? (
                                            <img
                                                src={choir.image_path}
                                                alt={choir.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover'}}
                                            />
                                        ) : (
                                            choir.name.charAt(0).toUpperCase()
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="manager-choir-name">{choir.name}</h3>
                                        <p className="manager-choir-location">📍 {choir.location}</p>
                                        {choir.is_verified && (
                                            <span className="manager-choir-badge">✓ {t('manager.verified')}</span>
                                        )}
                                    </div>

                                    <div className="manager-choir-actions">
                                        <Link
                                            href={`/manager/choirs/${choir.id}/content`}
                                            className="manager-choir-action-link"
                                        >
                                            {t('manager.manage_content')}
                                        </Link>
                                        <button
                                            onClick={() => handleEditChoir(choir)}
                                            className="manager-choir-action-button"
                                        >
                                            {t('manager.edit')}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Dialogs */}
            {isMobile ? (
                <CreateChoirDraggableBox
                    isOpen={isCreateDialogOpen}
                    onClose={() => setIsCreateDialogOpen(false)}
                    onSave={handleSaveChoir}
                />
            ) : (
                <CreateChoirDialog
                    isOpen={isCreateDialogOpen}
                    onClose={() => setIsCreateDialogOpen(false)}
                    onSave={handleSaveChoir}
                />
            )}

            {isMobile ? (
                <EditChoirDraggableBox
                    isOpen={isEditDialogOpen}
                    onClose={() => {
                        setIsEditDialogOpen(false);
                        setSelectedChoir(null);
                    }}
                    onSave={handleUpdateChoir}
                    choir={selectedChoir}
                />
            ) : (
                <EditChoirDialog
                    isOpen={isEditDialogOpen}
                    onClose={() => {
                        setIsEditDialogOpen(false);
                        setSelectedChoir(null);
                    }}
                    onSave={handleUpdateChoir}
                    choir={selectedChoir}
                />
            )}
        </MainLayout>
    );
}
