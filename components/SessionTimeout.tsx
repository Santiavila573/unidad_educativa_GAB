import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../services/authContext';
import { Modal, Button } from './ui';
import { AlertCircle, Clock, LogOut, CheckCircle } from 'lucide-react';

// TIMEOUT CONFIGURATION
// For demo/testing, you might want these lower, but requirements say "lo habitual".
// 15 Minutes Inactivity -> Warning appears at 14 minutes.
const INACTIVITY_LIMIT_MS = 15 * 60 * 1000;
const WARNING_LIMIT_MS = 60 * 1000; // 1 Minute warning

const SessionTimeout: React.FC = () => {
    const { user, logout } = useAuth();
    const [lastActivity, setLastActivity] = useState(Date.now());
    const [timeLeft, setTimeLeft] = useState(0);
    const [showWarningModal, setShowWarningModal] = useState(false);

    // Use ref to access current state inside event listeners without re-binding
    const showModalRef = useRef(showWarningModal);

    useEffect(() => {
        showModalRef.current = showWarningModal;
    }, [showWarningModal]);

    const resetTimer = useCallback(() => {
        setLastActivity(Date.now());
        if (showWarningModal) setShowWarningModal(false);
    }, [showWarningModal]);

    // Handle user choice to stay
    const handleStayLoggedIn = () => {
        resetTimer();
        setShowWarningModal(false);
    };

    const handleLogout = () => {
        logout();
        setShowWarningModal(false);
    };

    useEffect(() => {
        if (!user) return;

        const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

        // Throttled event listener
        let timeoutId: NodeJS.Timeout;
        const handleActivity = () => {
            // If modal is showing, IGNORE activity (force manual choice)
            if (showModalRef.current) return;

            if (timeoutId) return;
            timeoutId = setTimeout(() => {
                setLastActivity(Date.now());
            }, 1000);
        };

        events.forEach(event => window.addEventListener(event, handleActivity));

        return () => {
            events.forEach(event => window.removeEventListener(event, handleActivity));
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [user]);

    // Timer Check
    useEffect(() => {
        if (!user) {
            setLastActivity(Date.now()); // Reset if no user, so when they login, it starts fresh
            return;
        }

        const interval = setInterval(() => {
            const now = Date.now();
            const timeSinceLastActivity = now - lastActivity;
            const timeRemaining = INACTIVITY_LIMIT_MS - timeSinceLastActivity;

            if (timeRemaining <= 0) {
                handleLogout();
            } else if (timeRemaining <= WARNING_LIMIT_MS) {
                setTimeLeft(Math.ceil(timeRemaining / 1000));
                if (!showWarningModal) setShowWarningModal(true);
            } else {
                if (showWarningModal) setShowWarningModal(false);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [user, lastActivity, showWarningModal, logout]);

    if (!user || !showWarningModal) return null;

    return (
        <Modal
            isOpen={showWarningModal}
            onClose={() => { }} // Disable closing via escape/backdrop for this critical modal
            title="Inactividad Detectada"
        >
            <div className="flex flex-col items-center text-center space-y-6 animate-fade-in">
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center animate-pulse">
                    <Clock className="w-10 h-10 text-amber-600" />
                </div>

                <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">¿Sigues ahí?</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">
                        Tu sesión está a punto de expirar por inactividad.
                        Para mantener tu seguridad, se cerrará automáticamente en:
                    </p>
                    <div className="text-5xl font-black text-ue-blue mt-6 font-mono tracking-tighter">
                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </div>
                </div>

                <div className="flex gap-4 w-full pt-4">
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="flex-1 border-2 border-slate-100 py-4 h-auto"
                    >
                        <LogOut className="w-4 h-4 mr-2" /> Cerrar Sesión
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleStayLoggedIn}
                        className="flex-1 py-4 h-auto"
                    >
                        <CheckCircle className="w-4 h-4 mr-2" /> Mantener Sesión
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default SessionTimeout;
