import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, X, Plus, Trash2, CheckCircle, FileText, Image } from 'lucide-react';
import { useDataStore } from '../contexts/DataStoreContext';
import { useUI } from '../contexts/UIContext';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Breadcrumbs from '../components/ui/Breadcrumbs';

const stepSchemas = [
    z.object({
        name: z.string().min(2),
        email: z.string().email(),
        phone: z.string().optional(),
        ideaTitle: z.string().min(3),
        domain: z.string().min(1),
    }),
    z.object({
        problem: z.string().min(20),
        solution: z.string().min(20),
        market: z.string().min(10),
    }),
    z.object({}),
    z.object({}),
];

export default function SubmitIdea() {
    const { t, i18n } = useTranslation();
    const lang = i18n.language;
    const { addSubmission } = useDataStore();
    const { addToast } = useUI();
    const fileInputRef = useRef(null);

    const [step, setStep] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [refCode, setRefCode] = useState('');
    const [teamMembers, setTeamMembers] = useState([{ name: '', role: '' }]);
    const [needs, setNeeds] = useState('');
    const [attachments, setAttachments] = useState([]);

    const steps = [t('submit.step1'), t('submit.step2'), t('submit.step3'), t('submit.step4')];

    const { register, handleSubmit, formState: { errors }, trigger, getValues } = useForm({
        resolver: zodResolver(stepSchemas[step]),
        mode: 'onChange',
    });

    const domainOptions = [
        { value: 'tech', label: t('submit.domains.tech') },
        { value: 'agriculture', label: t('submit.domains.agriculture') },
        { value: 'health', label: t('submit.domains.health') },
        { value: 'education', label: t('submit.domains.education') },
        { value: 'energy', label: t('submit.domains.energy') },
        { value: 'tourism', label: t('submit.domains.tourism') },
        { value: 'other', label: t('submit.domains.other') },
    ];

    const nextStep = async () => {
        const valid = await trigger();
        if (valid && step < 3) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 0) setStep(step - 1);
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files || []);
        const validFiles = files.filter(f => {
            if (f.size > 10 * 1024 * 1024) {
                addToast({ type: 'error', title: t('submit.validation.maxSize') });
                return false;
            }
            const validTypes = ['application/pdf', 'image/png', 'image/jpeg'];
            if (!validTypes.includes(f.type)) {
                addToast({ type: 'error', title: t('submit.validation.fileType') });
                return false;
            }
            return true;
        });
        setAttachments(prev => [...prev, ...validFiles.map(f => ({
            name: f.name, size: f.size, type: f.type
        }))]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeFile = (index) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const addTeamMember = () => {
        setTeamMembers(prev => [...prev, { name: '', role: '' }]);
    };

    const removeTeamMember = (index) => {
        setTeamMembers(prev => prev.filter((_, i) => i !== index));
    };

    const updateTeamMember = (index, field, value) => {
        setTeamMembers(prev => prev.map((m, i) => i === index ? { ...m, [field]: value } : m));
    };

    const onSubmit = async () => {
        setSubmitting(true);
        await new Promise(r => setTimeout(r, 1500));
        const values = getValues();
        const submission = addSubmission({
            user: { name: values.name, email: values.email },
            ideaTitle: values.ideaTitle,
            domain: values.domain,
            problem: values.problem,
            solution: values.solution,
            market: values.market,
            teamMembers: teamMembers.filter(m => m.name),
            needs,
            attachments,
        });
        setRefCode(submission.refCode);
        setSubmitted(true);
        setSubmitting(false);
        addToast({ type: 'success', title: t('submit.success.title'), message: t('submit.success.message') });
    };

    const formatSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    if (submitted) {
        return (
            <div className="fade-in pb-20">
                <div className="bg-gradient-primary text-white py-20 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-dots opacity-30"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">{t('submit.success.title')}</h1>
                    </div>
                </div>
                <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                    <div className="w-24 h-24 bg-success-500/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                        <CheckCircle className="h-12 w-12 text-success-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">{t('submit.success.title')}</h2>
                    <p className="text-surface-400 mb-10 text-lg">{t('submit.success.message')}</p>
                    <div className="bg-bg-card border border-white/5 rounded-2xl p-8 mb-10 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-3xl rounded-full"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-highlight/10 blur-3xl rounded-full"></div>
                        
                        <div className="text-sm text-surface-400 mb-2 relative z-10 uppercase tracking-widest">{t('submit.success.refCode')}</div>
                        <div className="text-4xl font-bold text-highlight font-mono tracking-wider relative z-10">{refCode}</div>
                        <div className="text-sm text-surface-500 mt-4 relative z-10">{t('submit.success.refCodeDesc')}</div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/my-submissions">
                            <button className="modern-btn modern-btn-primary w-full sm:w-auto">{t('submit.success.viewSubmissions')}</button>
                        </Link>
                        <button className="modern-btn w-full sm:w-auto" onClick={() => { setSubmitted(false); setStep(0); }}>
                            {t('submit.success.submitAnother')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fade-in pb-20">
            <div className="bg-gradient-primary text-white py-20 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-dots opacity-30"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">{t('submit.title')}</h1>
                    <p className="text-surface-400 text-lg max-w-2xl mx-auto">{t('submit.subtitle')}</p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Breadcrumbs items={[
                    { label: t('nav.home'), href: '/' },
                    { label: t('nav.submit') },
                ]} />

                {/* Stepper */}
                <div className="flex items-center justify-between mb-12 relative z-10">
                    {steps.map((label, i) => (
                        <div key={i} className="flex items-center flex-1">
                            <div className="flex flex-col items-center flex-shrink-0 relative">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 shadow-lg ${
                                    i < step ? 'bg-success-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]' :
                                    i === step ? 'bg-primary-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] ring-4 ring-primary-500/30' :
                                    'bg-surface-800 text-surface-500 border border-white/5'
                                }`}>
                                    {i < step ? '✓' : i + 1}
                                </div>
                                <span className={`text-xs mt-3 text-center hidden sm:block max-w-[90px] font-medium transition-colors ${i <= step ? 'text-white' : 'text-surface-500'}`}>
                                    {label}
                                </span>
                            </div>
                            {i < steps.length - 1 && (
                                <div className="flex-1 px-4">
                                    <div className={`h-1 w-full rounded-full transition-colors duration-500 ${i < step ? 'bg-success-500/50 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-surface-800'}`} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="card-modern md:p-10">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Step 1: Basic Info */}
                        {step === 0 && (
                            <div className="space-y-6 fade-in">
                                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <span className="text-primary-400">01.</span> {t('submit.step1')}
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <Input label={t('submit.name')} className="modern-input" {...register('name')} error={errors.name?.message && t('submit.validation.required')} />
                                    <Input label={t('submit.email')} type="email" className="modern-input" {...register('email')} error={errors.email?.message && t('submit.validation.email')} />
                                </div>
                                <Input label={t('submit.phone')} className="modern-input" {...register('phone')} />
                                <Input label={t('submit.ideaTitle')} className="modern-input" {...register('ideaTitle')} error={errors.ideaTitle?.message && t('submit.validation.required')} />
                                <div className="form-group">
                                    <label className="form-label">{t('submit.domain')}</label>
                                    <select 
                                        className="modern-input" 
                                        {...register('domain')}
                                    >
                                        <option value="">-- {t('submit.domain')} --</option>
                                        {domainOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                    </select>
                                    {errors.domain?.message && <div className="form-error">{t('submit.validation.required')}</div>}
                                </div>
                            </div>
                        )}

                        {/* Step 2: Problem & Solution */}
                        {step === 1 && (
                            <div className="space-y-6 fade-in">
                                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <span className="text-primary-400">02.</span> {t('submit.step2')}
                                </h3>
                                <Input label={t('submit.problem')} type="textarea" className="modern-input min-h-[120px]" placeholder={t('submit.problemPlaceholder')} {...register('problem')} error={errors.problem?.message && t('submit.validation.minLength', { min: 20 })} />
                                <Input label={t('submit.solution')} type="textarea" className="modern-input min-h-[120px]" placeholder={t('submit.solutionPlaceholder')} {...register('solution')} error={errors.solution?.message && t('submit.validation.minLength', { min: 20 })} />
                                <Input label={t('submit.market')} type="textarea" className="modern-input min-h-[120px]" placeholder={t('submit.marketPlaceholder')} {...register('market')} error={errors.market?.message && t('submit.validation.minLength', { min: 10 })} />
                            </div>
                        )}

                        {/* Step 3: Team & Needs */}
                        {step === 2 && (
                            <div className="space-y-6 fade-in">
                                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <span className="text-primary-400">03.</span> {t('submit.step3')}
                                </h3>
                                <div className="bg-surface-800/30 rounded-xl p-6 border border-white/5">
                                    <label className="block text-sm font-medium text-surface-300 mb-4">{t('submit.teamMembers')}</label>
                                    {teamMembers.map((member, i) => (
                                        <div key={i} className="flex gap-4 mb-4 items-start">
                                            <Input
                                                placeholder={t('submit.teamMemberName')}
                                                value={member.name}
                                                onChange={(e) => updateTeamMember(i, 'name', e.target.value)}
                                                className="modern-input flex-1"
                                            />
                                            <Input
                                                placeholder={t('submit.teamMemberRole')}
                                                value={member.role}
                                                onChange={(e) => updateTeamMember(i, 'role', e.target.value)}
                                                className="modern-input flex-1"
                                            />
                                            {teamMembers.length > 1 && (
                                                <button type="button" onClick={() => removeTeamMember(i)} className="p-3 bg-danger-500/10 text-danger-400 hover:bg-danger-500 hover:text-white rounded-lg transition-colors mt-0.5 border border-danger-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]">
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button type="button" onClick={addTeamMember} className="modern-btn mt-2 text-sm">
                                        <Plus className="h-4 w-4" /> {t('submit.addMember')}
                                    </button>
                                </div>
                                <Input
                                    label={t('submit.needs')}
                                    type="textarea"
                                    className="modern-input min-h-[100px]"
                                    placeholder={t('submit.needsPlaceholder')}
                                    value={needs}
                                    onChange={(e) => setNeeds(e.target.value)}
                                />
                            </div>
                        )}

                        {/* Step 4: Attachments */}
                        {step === 3 && (
                            <div className="space-y-6 fade-in">
                                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <span className="text-primary-400">04.</span> {t('submit.step4')}
                                </h3>
                                <p className="text-sm text-surface-400 bg-surface-800/50 p-4 rounded-xl border border-white/5">{t('submit.attachmentsDesc')}</p>

                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-white/10 rounded-2xl p-10 text-center cursor-pointer hover:border-highlight hover:bg-highlight/5 transition-all duration-300 group"
                                >
                                    <div className="w-16 h-16 bg-surface-800 group-hover:bg-highlight/20 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                                        <Upload className="h-8 w-8 text-surface-400 group-hover:text-highlight transition-colors" />
                                    </div>
                                    <p className="text-white font-medium mb-1">{t('submit.dropzone')}</p>
                                    <p className="text-surface-500 text-sm">{t('submit.maxSize')}</p>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.png,.jpg,.jpeg"
                                    multiple
                                    onChange={handleFileChange}
                                    className="hidden"
                                    aria-label={t('submit.attachments')}
                                />

                                {attachments.length > 0 && (
                                    <div className="space-y-3 mt-6">
                                        {attachments.map((file, i) => (
                                            <div key={i} className="flex items-center justify-between bg-surface-800 rounded-xl p-4 border border-white/5 shadow-sm">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-surface-900 flex items-center justify-center shadow-inner">
                                                        {file.type === 'application/pdf' ? (
                                                            <FileText className="h-5 w-5 text-danger-400" />
                                                        ) : (
                                                            <Image className="h-5 w-5 text-highlight" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-white truncate max-w-[200px] sm:max-w-xs">{file.name}</div>
                                                        <div className="text-xs text-surface-500 mt-0.5">{formatSize(file.size)}</div>
                                                    </div>
                                                </div>
                                                <button type="button" onClick={() => removeFile(i)} className="w-8 h-8 rounded-full bg-danger-500/10 text-danger-400 hover:bg-danger-500 hover:text-white flex items-center justify-center transition-colors">
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="flex justify-between mt-10 pt-8 border-t border-white/10">
                            <button type="button" className="modern-btn" onClick={prevStep} disabled={step === 0} style={{ opacity: step === 0 ? 0 : 1, visibility: step === 0 ? 'hidden' : 'visible' }}>
                                {t('submit.previous')}
                            </button>
                            {step < 3 ? (
                                <button type="button" className="modern-btn modern-btn-primary" onClick={nextStep}>
                                    {t('submit.next')} ➔
                                </button>
                            ) : (
                                <button type="submit" className="modern-btn modern-btn-primary" disabled={submitting}>
                                    {submitting ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            {t('submit.submitting')}
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Upload className="w-4 h-4" />
                                            {t('submit.submitBtn')}
                                        </span>
                                    )}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
