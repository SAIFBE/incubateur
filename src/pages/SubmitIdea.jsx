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
            <div className="fade-in">
                <div className="hero-gradient text-white py-16 text-center">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl sm:text-4xl font-bold">{t('submit.success.title')}</h1>
                    </div>
                </div>
                <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                    <CheckCircle className="h-20 w-20 text-success-500 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-surface-900 mb-3">{t('submit.success.title')}</h2>
                    <p className="text-surface-500 mb-8">{t('submit.success.message')}</p>
                    <div className="bg-primary-50 rounded-2xl p-6 mb-8">
                        <div className="text-sm text-primary-600 mb-1">{t('submit.success.refCode')}</div>
                        <div className="text-3xl font-bold text-primary-700 font-mono">{refCode}</div>
                        <div className="text-xs text-primary-500 mt-2">{t('submit.success.refCodeDesc')}</div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link to="/my-submissions">
                            <Button>{t('submit.success.viewSubmissions')}</Button>
                        </Link>
                        <Button variant="secondary" onClick={() => { setSubmitted(false); setStep(0); }}>
                            {t('submit.success.submitAnother')}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <div className="hero-gradient text-white py-16 text-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-3">{t('submit.title')}</h1>
                    <p className="text-white/80 text-lg">{t('submit.subtitle')}</p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Breadcrumbs items={[
                    { label: t('nav.home'), href: '/' },
                    { label: t('nav.submit') },
                ]} />

                {/* Stepper */}
                <div className="flex items-center justify-between mb-10">
                    {steps.map((label, i) => (
                        <div key={i} className="flex items-center flex-1">
                            <div className="flex flex-col items-center flex-shrink-0">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${i < step ? 'bg-success-500 text-white' :
                                        i === step ? 'bg-primary-600 text-white ring-4 ring-primary-200' :
                                            'bg-surface-200 text-surface-500'
                                    }`}>
                                    {i < step ? '✓' : i + 1}
                                </div>
                                <span className="text-xs text-surface-500 mt-2 text-center hidden sm:block max-w-[80px]">
                                    {label}
                                </span>
                            </div>
                            {i < steps.length - 1 && (
                                <div className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-success-500' : 'bg-surface-200'}`} />
                            )}
                        </div>
                    ))}
                </div>

                <Card hover={false} className="p-6 md:p-10 shadow-lg">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Step 1: Basic Info */}
                        {step === 0 && (
                            <div className="space-y-5">
                                <h3 className="text-lg font-bold text-surface-900 mb-4">{t('submit.step1')}</h3>
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <Input label={t('submit.name')} {...register('name')} error={errors.name?.message && t('submit.validation.required')} />
                                    <Input label={t('submit.email')} type="email" {...register('email')} error={errors.email?.message && t('submit.validation.email')} />
                                </div>
                                <Input label={t('submit.phone')} {...register('phone')} />
                                <Input label={t('submit.ideaTitle')} {...register('ideaTitle')} error={errors.ideaTitle?.message && t('submit.validation.required')} />
                                <Select
                                    label={t('submit.domain')}
                                    options={domainOptions}
                                    placeholder={`-- ${t('submit.domain')} --`}
                                    {...register('domain')}
                                    error={errors.domain?.message && t('submit.validation.required')}
                                />
                            </div>
                        )}

                        {/* Step 2: Problem & Solution */}
                        {step === 1 && (
                            <div className="space-y-5">
                                <h3 className="text-lg font-bold text-surface-900 mb-4">{t('submit.step2')}</h3>
                                <Input label={t('submit.problem')} type="textarea" placeholder={t('submit.problemPlaceholder')} {...register('problem')} error={errors.problem?.message && t('submit.validation.minLength', { min: 20 })} />
                                <Input label={t('submit.solution')} type="textarea" placeholder={t('submit.solutionPlaceholder')} {...register('solution')} error={errors.solution?.message && t('submit.validation.minLength', { min: 20 })} />
                                <Input label={t('submit.market')} type="textarea" placeholder={t('submit.marketPlaceholder')} {...register('market')} error={errors.market?.message && t('submit.validation.minLength', { min: 10 })} />
                            </div>
                        )}

                        {/* Step 3: Team & Needs */}
                        {step === 2 && (
                            <div className="space-y-5">
                                <h3 className="text-lg font-bold text-surface-900 mb-4">{t('submit.step3')}</h3>
                                <div>
                                    <label className="block text-sm font-medium text-surface-700 mb-3">{t('submit.teamMembers')}</label>
                                    {teamMembers.map((member, i) => (
                                        <div key={i} className="flex gap-3 mb-3 items-start">
                                            <Input
                                                placeholder={t('submit.teamMemberName')}
                                                value={member.name}
                                                onChange={(e) => updateTeamMember(i, 'name', e.target.value)}
                                                className="flex-1"
                                            />
                                            <Input
                                                placeholder={t('submit.teamMemberRole')}
                                                value={member.role}
                                                onChange={(e) => updateTeamMember(i, 'role', e.target.value)}
                                                className="flex-1"
                                            />
                                            {teamMembers.length > 1 && (
                                                <Button type="button" variant="ghost" onClick={() => removeTeamMember(i)} className="mt-0.5 text-danger-500">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    <Button type="button" variant="ghost" icon={Plus} onClick={addTeamMember} size="sm">
                                        {t('submit.addMember')}
                                    </Button>
                                </div>
                                <Input
                                    label={t('submit.needs')}
                                    type="textarea"
                                    placeholder={t('submit.needsPlaceholder')}
                                    value={needs}
                                    onChange={(e) => setNeeds(e.target.value)}
                                />
                            </div>
                        )}

                        {/* Step 4: Attachments */}
                        {step === 3 && (
                            <div className="space-y-5">
                                <h3 className="text-lg font-bold text-surface-900 mb-4">{t('submit.step4')}</h3>
                                <p className="text-sm text-surface-500">{t('submit.attachmentsDesc')}</p>

                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-surface-300 rounded-2xl p-8 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 transition-all"
                                >
                                    <Upload className="h-10 w-10 text-surface-400 mx-auto mb-3" />
                                    <p className="text-surface-600 font-medium">{t('submit.dropzone')}</p>
                                    <p className="text-surface-400 text-sm mt-1">{t('submit.maxSize')}</p>
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
                                    <div className="space-y-2">
                                        {attachments.map((file, i) => (
                                            <div key={i} className="flex items-center justify-between bg-surface-50 rounded-xl p-3">
                                                <div className="flex items-center gap-3">
                                                    {file.type === 'application/pdf' ? (
                                                        <FileText className="h-5 w-5 text-danger-500" />
                                                    ) : (
                                                        <Image className="h-5 w-5 text-primary-500" />
                                                    )}
                                                    <div>
                                                        <div className="text-sm font-medium text-surface-700 truncate max-w-[200px]">{file.name}</div>
                                                        <div className="text-xs text-surface-400">{formatSize(file.size)}</div>
                                                    </div>
                                                </div>
                                                <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(i)} className="text-danger-500">
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="flex justify-between mt-8 pt-6 border-t border-surface-200">
                            <Button type="button" variant="secondary" onClick={prevStep} disabled={step === 0}>
                                {t('submit.previous')}
                            </Button>
                            {step < 3 ? (
                                <Button type="button" onClick={nextStep}>
                                    {t('submit.next')}
                                </Button>
                            ) : (
                                <Button type="submit" variant="accent" loading={submitting}>
                                    {submitting ? t('submit.submitting') : t('submit.submitBtn')}
                                </Button>
                            )}
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}
