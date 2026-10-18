import { useToast } from '@/components/ui/use-toast';

export const useCleanupNotifications = () => {
    const { toast } = useToast();

    const sendCleanupStartedNotification = () => {
        toast({
            title: "Cleanup Started",
            description: "Mail Helper is scanning your inbox based on your schedule...",
            duration: 5000,
            className: "bg-blue-50 border-blue-200 text-blue-900"
        });
    };

    const sendCleanupCompletedNotification = (results) => {
        const total = (results.social_deleted || 0) + (results.promotions_deleted || 0) + (results.junk_deleted || 0);
        
        toast({
            title: "Cleanup Completed Successfully",
            description: `Deleted ${total} emails. Detected ${results.junk_detected || 0} junk items. Summary available in dashboard.`,
            duration: 8000,
            className: "bg-green-50 border-green-200 text-green-900"
        });
    };

    const sendErrorNotification = (errorMsg) => {
        toast({
            title: "Cleanup Failed",
            description: errorMsg || "An unexpected error occurred during scheduled cleanup.",
            variant: "destructive",
            duration: 10000
        });
    };

    return {
        sendCleanupStartedNotification,
        sendCleanupCompletedNotification,
        sendErrorNotification
    };
};