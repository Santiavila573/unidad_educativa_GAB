import React, { useState } from 'react';
import { Card, Button } from '../components/ui';
import { MapPin, Phone, Mail, Clock, Send, Award } from 'lucide-react';
import { ContactForm } from '../types';

const ContactPage: React.FC = () => {
    const [formData, setFormData] = useState<ContactForm>({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate sending
        console.log("Form Submitted", formData);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    const inputClasses = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:bg-white focus:border-ue-light-blue focus:ring-4 focus:ring-blue-50 transition-all duration-300 outline-none placeholder-gray-400 hover:bg-gray-100 hover:border-gray-300 focus:hover:border-ue-light-blue";
    const labelClasses = "block text-sm font-semibold text-gray-600 mb-1.5 ml-1 font-outfit";

    return (
        <div className="relative min-h-screen bg-gray-50/50">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0 h-[60vh]">
                <img
                    src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop"
                    className="w-full h-full object-cover opacity-10 blur-[2px]"
                    alt="Contact Background"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-50/0 to-gray-50/100"></div>
            </div>

            <div className="container mx-auto px-4 py-12 md:py-24 relative z-10">
                <div className="max-w-5xl mx-auto text-center mb-12 md:mb-20">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight font-outfit animate-title-reveal">
                        Contacto <span className="text-ue-blue italic">Institucional</span>
                    </h1>
                    <div className="h-1.5 w-24 bg-ue-gold mx-auto rounded-full mb-8"></div>
                    <p className="text-slate-500 max-w-2xl mx-auto text-base md:text-xl font-outfit leading-relaxed animate-fade-in">
                        Estamos aquí para atenderte. Envíanos un mensaje o visítanos en nuestras instalaciones físicas en Cayambe.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    <div className="space-y-6">
                        <Card title="Información de Contacto" className="shadow-lg border-0">
                            <div className="space-y-8">
                                <div className="flex items-start group">
                                    <div className="bg-blue-50 p-3 rounded-2xl mr-4 text-ue-blue group-hover:bg-ue-light-blue group-hover:text-white transition-colors duration-300">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-lg font-outfit">Dirección</h3>
                                        <p className="text-gray-500 leading-relaxed">Comunidad Compañía Lote 2,<br />Parroquia Cangahua, Cayambe,<br />Pichincha, Ecuador.</p>
                                    </div>
                                </div>
                                <div className="flex items-start group">
                                    <div className="bg-blue-50 p-3 rounded-2xl mr-4 text-ue-blue group-hover:bg-ue-light-blue group-hover:text-white transition-colors duration-300">
                                        <Award className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-lg font-outfit">Identificación Institucional</h3>
                                        <p className="text-gray-500 leading-relaxed font-bold">Código Escuela (DINEIB): 17B00153</p>
                                    </div>
                                </div>
                                <div className="flex items-start group">
                                    <div className="bg-blue-50 p-3 rounded-2xl mr-4 text-ue-blue group-hover:bg-ue-light-blue group-hover:text-white transition-colors duration-300">
                                        <Clock className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-lg font-outfit">Horario de Atención</h3>
                                        <p className="text-gray-500 leading-relaxed">Lunes a Viernes<br />07:00 AM - 03:00 PM</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Map Link Section */}
                        <div className="bg-white p-2 rounded-2xl shadow-lg border border-gray-100 overflow-hidden group">
                            <a
                                href="https://maps.app.goo.gl/sgps5Tx1Zr6BymwG7"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block relative h-64 rounded-xl overflow-hidden bg-slate-100 transition-all duration-500"
                            >
                                {/* Decorative Background for Map Placeholder */}
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50 via-slate-50 to-white"></div>
                                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] group-hover:scale-110 transition-transform duration-1000"></div>

                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                    <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-ue-blue mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 ring-1 ring-slate-100">
                                        <MapPin className="h-8 w-8" />
                                    </div>
                                    <h4 className="text-slate-900 font-black text-lg mb-1 font-outfit">Ubicación Geográfica</h4>
                                    <p className="text-slate-500 text-sm font-medium mb-4 max-w-[200px]">Pulsa para abrir navegación en Google Maps</p>
                                    <div className="bg-ue-blue text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-900/20 group-hover:bg-ue-gold group-hover:text-ue-blue transition-colors duration-300">
                                        Abrir Mapa Satelital
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>

                    <Card className="shadow-xl border-0 ring-1 ring-black/5">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-gray-800 font-outfit">Envíanos un mensaje</h3>
                            <p className="text-sm text-gray-500">Completa el formulario y te responderemos lo antes posible.</p>
                        </div>

                        {submitted ? (
                            <div className="bg-green-50 text-green-700 p-8 rounded-xl text-center border border-green-100 flex flex-col items-center animate-in fade-in duration-500">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <Send className="h-8 w-8 text-green-600" />
                                </div>
                                <h4 className="text-lg font-bold mb-2 font-outfit">¡Mensaje Enviado!</h4>
                                <p>Gracias por contactarnos. Nuestro equipo revisará tu mensaje y responderá a la brevedad.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className={labelClasses}>Nombre Completo</label>
                                    <input required type="text" name="name" onChange={handleChange} className={inputClasses} placeholder="Ej. Juan Pérez" />
                                </div>
                                <div>
                                    <label className={labelClasses}>Correo Electrónico</label>
                                    <input required type="email" name="email" onChange={handleChange} className={inputClasses} placeholder="nombre@ejemplo.com" />
                                </div>
                                <div>
                                    <label className={labelClasses}>Teléfono <span className="text-gray-400 font-normal">(Opcional)</span></label>
                                    <input type="tel" name="phone" onChange={handleChange} className={inputClasses} placeholder="099 999 9999" />
                                </div>
                                <div>
                                    <label className={labelClasses}>Asunto</label>
                                    <input required type="text" name="subject" onChange={handleChange} className={inputClasses} placeholder="Motivo de su consulta" />
                                </div>
                                <div>
                                    <label className={labelClasses}>Mensaje</label>
                                    <textarea required name="message" rows={4} onChange={handleChange} className={`${inputClasses} resize-none`} placeholder="Escriba su mensaje aquí..."></textarea>
                                </div>
                                <Button type="submit" className="w-full py-4 text-base font-outfit">
                                    Enviar Mensaje
                                </Button>
                            </form>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;