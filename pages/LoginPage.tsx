import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/authContext';
import { Button } from '../components/ui';
import { Lock, User, Key, GraduationCap, Crown, BookOpen, Shield, Info, Check, RotateCcw } from 'lucide-react';

// Base de datos de imágenes para el CAPTCHA
const CAPTCHA_DB: Record<string, string[]> = {
    autos: [
        "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=150&q=80",
        "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=150&q=80",
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=150&q=80",
        "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=150&q=80",
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=150&q=80",
        "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=150&q=80"
    ],
    gatos: [
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150&q=80",
        "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=150&q=80",
        "https://images.unsplash.com/photo-1495360019602-e001922271aa?w=150&q=80",
        "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=150&q=80",
        "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=150&q=80",
        "https://images.unsplash.com/photo-1513245543132-31f507417b26?w=150&q=80"
    ],
    perros: [
        "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=150&q=80",
        "https://images.unsplash.com/photo-1534361960057-19889db9621e?w=150&q=80",
        "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=150&q=80",
        "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=150&q=80",
        "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=150&q=80",
        "https://images.unsplash.com/photo-1552053831-71594a27632d?w=150&q=80"
    ],
    flores: [
        "https://images.unsplash.com/photo-1490750967868-58cb75069ed6?w=150&q=80",
        "https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=150&q=80",
        "https://images.unsplash.com/photo-1460533893673-a201bdd59208?w=150&q=80",
        "https://images.unsplash.com/photo-1507290439931-a861b5a38200?w=150&q=80",
        "https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?w=150&q=80",
        "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=150&q=80"
    ]
};

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, user } = useAuth();
    const navigate = useNavigate();

    const [isRegistering, setIsRegistering] = useState(false);
    const [registerData, setRegisterData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    // --- ESTADO DEL CAPTCHA ---
    const [captchaVerified, setCaptchaVerified] = useState(false);
    const [selectedImages, setSelectedImages] = useState<number[]>([]);
    const [captchaError, setCaptchaError] = useState(false);
    const [challengeImages, setChallengeImages] = useState<{ id: number; src: string; valid: boolean }[]>([]);
    const [targetCategory, setTargetCategory] = useState<string>('autos');

    // Generar nuevo desafío
    const shuffleImages = () => {
        // 1. Elegir categoría
        const categories = Object.keys(CAPTCHA_DB);
        const newCategory = categories[Math.floor(Math.random() * categories.length)];
        setTargetCategory(newCategory);

        // 2. Elegir 3 imágenes correctas
        const correctPool = [...CAPTCHA_DB[newCategory]];
        const selectedCorrect: string[] = [];
        while (selectedCorrect.length < 3) {
            const idx = Math.floor(Math.random() * correctPool.length);
            const img = correctPool.splice(idx, 1)[0];
            selectedCorrect.push(img);
        }

        // 3. Elegir 3 distractores
        const distractorPool = categories
            .filter(c => c !== newCategory)
            .flatMap(c => CAPTCHA_DB[c]);

        const selectedDistractors: string[] = [];
        while (selectedDistractors.length < 3) {
            const idx = Math.floor(Math.random() * distractorPool.length);
            const img = distractorPool.splice(idx, 1)[0];
            selectedDistractors.push(img);
        }

        // 4. Combinar y mezclar
        const mixedImages = [
            ...selectedCorrect.map(src => ({ src, valid: true })),
            ...selectedDistractors.map(src => ({ src, valid: false }))
        ];

        for (let i = mixedImages.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [mixedImages[i], mixedImages[j]] = [mixedImages[j], mixedImages[i]];
        }

        // 5. Establecer estado
        const finalImages = mixedImages.map((img, index) => ({
            id: Date.now() + index,
            src: img.src,
            valid: img.valid
        }));

        setChallengeImages(finalImages);
        setSelectedImages([]);
        setCaptchaVerified(false);
        setCaptchaError(false);
    };

    useEffect(() => {
        shuffleImages();
    }, []);

    const handleImageClick = (id: number) => {
        if (captchaVerified) return;

        setSelectedImages(prev => {
            if (prev.includes(id)) {
                return prev.filter(imgId => imgId !== id);
            } else {
                if (prev.length >= 3) return prev;
                const newSelection = [...prev, id];
                if (newSelection.length === 3) {
                    verifyCaptcha(newSelection);
                } else {
                    setCaptchaError(false);
                }
                return newSelection;
            }
        });
    };

    const verifyCaptcha = (selection: number[]) => {
        const isValid = selection.every(id => {
            const img = challengeImages.find(item => item.id === id);
            return img?.valid;
        });

        if (isValid) {
            setCaptchaVerified(true);
            setCaptchaError(false);
        } else {
            setCaptchaError(true);
            setTimeout(() => {
                setSelectedImages([]);
                setCaptchaError(false);
            }, 1000);
        }
    };

    React.useEffect(() => {
        if (user) navigate('/repositorio');
    }, [user, navigate]);

    // Métodos de seguridad
    const sanitizeInput = (input: string) => input.replace(/[;'"\\]/g, "");

    const preventCopyPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
    };

    const hashPassword = async (pwd: string) => {
        const msgBuffer = new TextEncoder().encode(pwd);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    };

    const saveUserToFirebase = async (userData: any) => {
        console.log("🔒 [SECURE STORAGE] Saving to FIREBASE (Simulated):", userData);
        return new Promise((resolve) => {
            setTimeout(() => {
                const users = JSON.parse(localStorage.getItem('mock_firebase_users') || '[]');
                users.push(userData);
                localStorage.setItem('mock_firebase_users', JSON.stringify(users));
                resolve(true);
            }, 1000);
        });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (registerData.password !== registerData.confirmPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(registerData.password)) {
            alert("⚠️ La contraseña no es segura.");
            return;
        }
        const cleanName = sanitizeInput(registerData.fullName);
        const cleanEmail = sanitizeInput(registerData.email);
        const passwordHash = await hashPassword(registerData.password);
        const newUser = {
            fullName: cleanName,
            email: cleanEmail,
            passwordHash: passwordHash,
            role: 'docente',
            createdAt: new Date().toISOString(),
            securityCheck: 'PASSED_XSS_SQLI_FILTER'
        };
        await saveUserToFirebase(newUser);
        alert("✅ Registro exitoso.");
        setIsRegistering(false);
        setRegisterData({ fullName: '', email: '', password: '', confirmPassword: '' });
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        if (!captchaVerified) {
            setCaptchaError(true);
            return;
        }

        const validPasswords = ['docente123', 'admin123', 'autoridad123'];
        if (validPasswords.includes(password)) {
            login(username);
            navigate('/repositorio');
        } else {
            alert('Credenciales incorrectas (Demo: use las credenciales mostradas abajo).');
            shuffleImages();
        }
    };

    const CredentialRow = ({ label, user, pass }: { label: string, user: string, pass: string }) => (
        <div className="flex justify-between items-center text-xs border-b last:border-0 border-dashed border-gray-200 py-2">
            <span className="text-slate-600 font-semibold">{label}</span>
            <div className="text-right flex items-center gap-2">
                <code className="bg-slate-100 px-1.5 py-0.5 rounded-none text-ue-blue font-bold tracking-tight">{user}</code>
                <span className="text-slate-300">/</span>
                <code className="text-slate-500 tracking-tight">{pass}</code>
            </div>
        </div>
    );

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 relative overflow-hidden py-12 px-4">
            {/* Background Decorations - Rotated for sharpness */}
            <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:radial-gradient(ellipse_at_center,black,transparent)] pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-ue-blue/5 rounded-none rotate-45 blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-ue-gold/5 rounded-none rotate-45 blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="max-w-md w-full relative z-10 animate-fade-in">
                <div className="text-center mb-10">
                    <div className="relative inline-block mb-6 group cursor-pointer">
                        {/* Glow Effect - Rotated */}
                        <div className="absolute inset-0 bg-ue-light-blue blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-700 rounded-none rotate-45 scale-150"></div>

                        {/* Floating Container */}
                        <div className="animate-float relative z-10">
                            {/* Interactive Box */}
                            <div className="inline-flex items-center justify-center h-24 w-24 bg-gradient-to-br from-ue-blue to-ue-dark-blue rounded-none rotate-3 shadow-xl shadow-blue-900/20 border border-white/10 ring-4 ring-white transition-all duration-500 ease-out group-hover:rotate-12 group-hover:scale-110 group-hover:shadow-ue-blue/50 group-hover:bg-gradient-to-tl group-hover:ring-ue-light-blue/30">
                                <GraduationCap className="h-10 w-10 text-white -rotate-3 transition-transform duration-500 ease-out group-hover:scale-125 group-hover:-rotate-12" />
                            </div>
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight font-outfit relative z-10">
                        Repositorio Institucional
                    </h2>
                    <p className="mt-3 text-slate-500 font-medium relative z-10">
                        Plataforma de Gestión Académica y Documental
                    </p>
                </div>

                {/* Main Card with Cut Corner Effect */}
                <div
                    className="bg-white/80 backdrop-blur-xl py-8 px-8 drop-shadow-2xl rounded-none border border-white ring-1 ring-black/5"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%)' }}
                >

                    {/* Toggle Switch */}
                    <div className="flex p-1 bg-slate-100 rounded-none mb-8 relative">
                        <button
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-none transition-all duration-300 font-outfit ${!isRegistering ? 'bg-white text-ue-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            onClick={() => setIsRegistering(false)}
                        >
                            <Key className="w-4 h-4" /> Acceso
                        </button>
                        <button
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-none transition-all duration-300 font-outfit ${isRegistering ? 'bg-white text-ue-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            onClick={() => setIsRegistering(true)}
                        >
                            <User className="w-4 h-4" /> Registro
                        </button>
                    </div>

                    {!isRegistering ? (
                        <form className="space-y-6" onSubmit={handleLogin}>
                            <div className="space-y-5">
                                <div>
                                    <label htmlFor="username" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1 font-outfit">
                                        Usuario
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-slate-400 group-focus-within:text-ue-light-blue transition-colors" />
                                        </div>
                                        <input
                                            id="username"
                                            name="username"
                                            type="text"
                                            required
                                            className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-none text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-ue-light-blue focus:ring-1 focus:ring-ue-light-blue transition-all duration-300 font-medium sm:text-sm"
                                            placeholder="Ej. docente"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1 font-outfit">
                                        Contraseña
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Key className="h-5 w-5 text-slate-400 group-focus-within:text-ue-light-blue transition-colors" />
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            required
                                            onPaste={preventCopyPaste}
                                            onCopy={preventCopyPaste}
                                            onCut={preventCopyPaste}
                                            autoComplete="off"
                                            className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-none text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-ue-light-blue focus:ring-1 focus:ring-ue-light-blue transition-all duration-300 font-medium sm:text-sm"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1 ml-1 text-right italic">
                                        Copiar y pegar deshabilitado por seguridad
                                    </p>
                                </div>

                                {/* IMAGE CAPTCHA SECTION */}
                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 font-outfit">
                                            Verificación de Seguridad
                                        </label>
                                        <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-none uppercase">
                                            Seleccione 3 {targetCategory}
                                        </span>
                                    </div>

                                    <div className={`relative p-3 bg-slate-50 rounded-none border-2 transition-all duration-300 ${captchaVerified ? 'border-green-500 bg-green-50/50' : 'border-slate-100'}`}>

                                        {!captchaVerified ? (
                                            <>
                                                <div className="grid grid-cols-3 gap-2 mb-2">
                                                    {challengeImages.map((img) => (
                                                        <div
                                                            key={img.id}
                                                            onClick={() => handleImageClick(img.id)}
                                                            className={`relative aspect-square rounded-none overflow-hidden cursor-pointer transition-all duration-200 transform active:scale-95 ${selectedImages.includes(img.id) ? 'ring-4 ring-ue-gold scale-95 shadow-lg' : 'hover:opacity-90'}`}
                                                        >
                                                            <img src={img.src} alt="Captcha" className="w-full h-full object-cover" />
                                                            {selectedImages.includes(img.id) && (
                                                                <div className="absolute inset-0 bg-ue-gold/20 flex items-center justify-center">
                                                                    <div className="h-6 w-6 bg-ue-gold rounded-none flex items-center justify-center text-white font-bold shadow-sm">✓</div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="flex justify-between items-center px-1">
                                                    <span className={`text-xs font-medium ${captchaError ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}>
                                                        {captchaError ? 'Selección incorrecta. Intente de nuevo.' : `${selectedImages.length}/3 seleccionados`}
                                                    </span>
                                                    <button type="button" onClick={shuffleImages} className="text-slate-400 hover:text-ue-blue transition-colors p-1" title="Cambiar imágenes">
                                                        <RotateCcw className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex items-center justify-center py-6 gap-3 animate-slide-up">
                                                <div className="h-12 w-12 bg-green-500 rounded-none flex items-center justify-center text-white shadow-lg shadow-green-500/30">
                                                    <Check className="w-6 h-6" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-sm font-black text-green-700 font-outfit">Verificación Exitosa</p>
                                                    <p className="text-xs text-green-600 font-medium font-outfit">Humano confirmado</p>
                                                </div>
                                                <button type="button" onClick={shuffleImages} className="absolute top-2 right-2 text-green-700/50 hover:text-green-700 p-2" title="Reiniciar">
                                                    <RotateCcw className="w-3 h-3" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    className={`w-full py-4 text-base rounded-none transition-all hover:scale-[1.01] font-outfit ${!captchaVerified ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    disabled={!captchaVerified}
                                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}
                                >
                                    <Lock className="mr-2 h-4 w-4" /> Iniciar Sesión Segura
                                </Button>
                            </div>

                            <div className="mt-8">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="h-px bg-slate-200 flex-grow"></div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 font-outfit">
                                        <Info className="w-3 h-3" /> Credenciales Demo
                                    </span>
                                    <div className="h-px bg-slate-200 flex-grow"></div>
                                </div>

                                <div className="bg-slate-50 rounded-none border border-slate-200 p-4 space-y-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-ue-gold uppercase tracking-wider font-outfit">
                                            <Crown className="w-3 h-3" /> Autoridades
                                        </div>
                                        <div className="bg-white rounded-none border border-slate-100 p-2 shadow-sm">
                                            <CredentialRow label="Rectorado" user="rector" pass="autoridad123" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-ue-blue uppercase tracking-wider font-outfit">
                                                <BookOpen className="w-3 h-3" /> Docentes
                                            </div>
                                            <div className="bg-white rounded-none border border-slate-100 p-2 shadow-sm text-center">
                                                <code className="text-xs font-bold text-slate-700 block mb-1">docente</code>
                                                <code className="text-[10px] text-slate-400 bg-slate-50 px-1 rounded-none">docente123</code>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-600 uppercase tracking-wider font-outfit">
                                                <Shield className="w-3 h-3" /> Admin
                                            </div>
                                            <div className="bg-white rounded-none border border-slate-100 p-2 shadow-sm text-center">
                                                <code className="text-xs font-bold text-slate-700 block mb-1">admin</code>
                                                <code className="text-[10px] text-slate-400 bg-slate-50 px-1 rounded-none">admin123</code>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <form className="space-y-6" onSubmit={handleRegister}>
                            <div className="space-y-5 animate-slide-up">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1 font-outfit">
                                        Nombre Completo
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-slate-400 group-focus-within:text-ue-blue transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-none text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-ue-blue focus:ring-1 focus:ring-ue-blue transition-all duration-300 font-medium sm:text-sm"
                                            placeholder="Nombres y Apellidos"
                                            value={registerData.fullName}
                                            onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1 font-outfit">
                                        Correo Institucional
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <div className="h-5 w-5 flex items-center justify-center text-slate-400 font-bold">@</div>
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-none text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-ue-blue focus:ring-1 focus:ring-ue-blue transition-all duration-300 font-medium sm:text-sm"
                                            placeholder="usuario@educacion.gob.ec"
                                            value={registerData.email}
                                            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1 font-outfit">
                                        Contraseña
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Key className="h-5 w-5 text-slate-400 group-focus-within:text-ue-blue transition-colors" />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            onPaste={preventCopyPaste}
                                            onCopy={preventCopyPaste}
                                            onCut={preventCopyPaste}
                                            autoComplete="off"
                                            className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-none text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-ue-blue focus:ring-1 focus:ring-ue-blue transition-all duration-300 font-medium sm:text-sm"
                                            placeholder="Mínimo 8 caracteres"
                                            value={registerData.password}
                                            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1 ml-1">
                                        Debe incluir: Mayúscula, minúscula, número y carácter especial (@$!%*?&)
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1 font-outfit">
                                        Confirmar Contraseña
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Shield className="h-5 w-5 text-slate-400 group-focus-within:text-ue-blue transition-colors" />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            onPaste={preventCopyPaste}
                                            onCopy={preventCopyPaste}
                                            onCut={preventCopyPaste}
                                            autoComplete="off"
                                            className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-none text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-ue-blue focus:ring-1 focus:ring-ue-blue transition-all duration-300 font-medium sm:text-sm"
                                            placeholder="Repita la contraseña"
                                            value={registerData.confirmPassword}
                                            onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    variant="secondary"
                                    className="w-full py-4 text-base rounded-none transition-all hover:scale-[1.01] font-outfit"
                                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}
                                >
                                    <User className="mr-2 h-4 w-4" /> Registrar Usuario
                                </Button>
                                <p className="text-center text-xs text-slate-400 mt-4 px-4 leading-relaxed">
                                    Al registrarse, sus datos serán encriptados (SHA-256) y almacenados de forma segura cumpliendo con la normativa de protección de datos.
                                </p>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;