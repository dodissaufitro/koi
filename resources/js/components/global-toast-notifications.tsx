import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type FlashProps = {
    success?: string | null;
    error?: string | null;
    message?: string | null;
    status?: string | null;
};

function showPageFeedback(props: Record<string, any>) {
    if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const nativeAppView = params.has('screen') || params.get('view') === 'android' || localStorage.getItem('koki_view_mode') === 'android';
        if (nativeAppView) return;
    }

    const flash = (props.flash || {}) as FlashProps;

    if (flash.success) toast.success(flash.success, { toastId: `success:${flash.success}` });
    if (flash.error) toast.error(flash.error, { toastId: `error:${flash.error}` });
    if (flash.message) toast.info(flash.message, { toastId: `message:${flash.message}` });

    if (flash.status) {
        const statusMessages: Record<string, string> = {
            'verification-link-sent': 'Link verifikasi email berhasil dikirim.',
        };
        toast.info(statusMessages[flash.status] || flash.status, { toastId: `status:${flash.status}` });
    }

    if (!flash.error && props.errors && Object.keys(props.errors).length > 0) {
        const firstError = Object.values(props.errors).find((value): value is string => typeof value === 'string');
        if (firstError) toast.error(firstError, { toastId: `validation:${firstError}` });
    }
}

export default function GlobalToastNotifications({ initialFlash }: { initialFlash?: Record<string, any> }) {
    useEffect(() => {
        if (initialFlash) showPageFeedback({ flash: initialFlash });

        const removeListener = router.on('success', (event) => {
            showPageFeedback(event.detail.page.props as Record<string, any>);
        });
        const removeErrorListener = router.on('error', (event) => {
            showPageFeedback({ errors: event.detail.errors });
        });

        return () => {
            removeListener();
            removeErrorListener();
        };
    }, []);

    return (
        <ToastContainer
            position="top-right"
            autoClose={4000}
            newestOnTop
            closeOnClick
            pauseOnFocusLoss
            draggable
            theme="light"
            limit={4}
        />
    );
}
