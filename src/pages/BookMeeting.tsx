import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../calendar-overrides.css';
import Reveal from '../components/Reveal';
import { supabase } from '../supabaseClient';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const BookMeeting: React.FC = () => {
    const [orgType, setOrgType] = useState<string>('');
    const [fileName, setFileName] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [date, setDate] = useState<Value>(new Date());
    const [bookedDates, setBookedDates] = useState<string[]>([]);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Load booked dates from Supabase on mount
    useEffect(() => {
        fetchBookedDates();
    }, []);

    const fetchBookedDates = async () => {
        const { data } = await supabase
            .from('meetings')
            .select('date');

        if (data) {
            const dates = data.map((m: any) => new Date(m.date).toDateString());
            setBookedDates(dates);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setFileName(e.target.files[0].name);
        }
    };

    const isDateDisabled = ({ date }: { date: Date }) => {
        const dateString = date.toDateString();
        // Disable past dates and booked dates
        return date < new Date(new Date().setHours(0, 0, 0, 0)) || bookedDates.includes(dateString);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!(date instanceof Date)) return;

        // Combine date and time
        const meetingDateTime = new Date(date);
        meetingDateTime.setHours(17, 0, 0, 0); // 5:00 PM

        // Collect form data
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const submission: any = {};
        formData.forEach((value, key) => submission[key] = value);

        // Add manual fields
        submission.date = meetingDateTime.toISOString();
        submission.organization = orgType === 'Other' ? submission.customOrganization : orgType;
        submission.file_name = fileName;

        try {
            // 1. Upload File if exists
            if (file) {
                const fileExt = file.name.split('.').pop();
                const filePath = `${Date.now()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('meeting-uploads')
                    .upload(filePath, file);

                if (uploadError) {
                    throw uploadError;
                }

                // Get Public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('meeting-uploads')
                    .getPublicUrl(filePath);

                submission.file_url = publicUrl;
            }

            // 2. Insert Data
            const { error } = await supabase
                .from('meetings')
                .insert([submission]);

            if (!error) {
                const dateString = date.toDateString();
                setBookedDates([...bookedDates, dateString]);
                setIsSubmitted(true);
                alert('Meeting booked successfully! We will contact you shortly.');
            } else {
                console.error('Supabase error:', error);
                alert('Failed to book meeting. Please try again.');
            }
        } catch (error) {
            console.error('Error booking meeting:', error);
            alert('An error occurred. Please try again later.');
        }
    };

    const inputStyle = {
        padding: 'var(--space-4)',
        backgroundColor: 'var(--color-bg)',
        border: '1px solid var(--color-text-muted)',
        color: 'var(--color-text-main)',
        fontFamily: 'inherit',
        width: '100%',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        outline: 'none'
    };

    const labelStyle = {
        fontSize: 'var(--text-xs)',
        fontWeight: 700,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.05em',
        marginBottom: 'var(--space-2)',
        display: 'block',
        color: 'var(--color-text-muted)'
    };

    const requiredMark = <span style={{ color: 'var(--color-primary)', marginLeft: '4px' }}>*</span>;

    return (
        <section className="section" style={{ paddingTop: 'var(--space-24)', minHeight: '90vh' }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <Reveal width="100%">
                    <h1 style={{
                        fontSize: 'var(--text-5xl)',
                        fontWeight: 700,
                        marginBottom: 'var(--space-12)',
                        textAlign: 'center',
                        textTransform: 'uppercase',
                        letterSpacing: '-0.02em'
                    }}>
                        Book a Meeting
                    </h1>
                </Reveal>

                <Reveal delay={0.2} width="100%">
                    <form
                        onSubmit={handleSubmit}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: 'var(--space-12)',
                        }}
                    >

                        {/* Left Column: Form Fields */}
                        <div style={{ display: 'grid', gap: 'var(--space-6)', alignContent: 'start' }}>
                            {/* Name */}
                            <div>
                                <label style={labelStyle}>Name {requiredMark}</label>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    style={inputStyle}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                                    onBlur={(e) => e.target.style.borderColor = 'var(--color-text-muted)'}
                                />
                            </div>

                            {/* School */}
                            <div>
                                <label style={labelStyle}>School {requiredMark}</label>
                                <input
                                    name="school"
                                    type="text"
                                    required
                                    style={inputStyle}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                                    onBlur={(e) => e.target.style.borderColor = 'var(--color-text-muted)'}
                                />
                            </div>

                            {/* Organization Type */}
                            <div>
                                <label style={labelStyle}>Organization {requiredMark}</label>
                                <select
                                    value={orgType}
                                    onChange={(e) => setOrgType(e.target.value)}
                                    style={inputStyle}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                                    onBlur={(e) => e.target.style.borderColor = 'var(--color-text-muted)'}
                                >
                                    <option value="">Select Type...</option>
                                    <option value="Fraternity">Fraternity</option>
                                    <option value="Sorority">Sorority</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* Chapter Name (Conditional: Fraternity/Sorority) */}
                            {(orgType === 'Fraternity' || orgType === 'Sorority') && (
                                <div style={{ animation: 'fadeIn 0.3s ease' }}>
                                    <label style={labelStyle}>Chapter Name {requiredMark}</label>
                                    <input
                                        name="chapterName"
                                        type="text"
                                        required
                                        style={inputStyle}
                                        onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                                        onBlur={(e) => e.target.style.borderColor = 'var(--color-text-muted)'}
                                    />
                                </div>
                            )}

                            {/* Organization Name (Conditional: Other) */}
                            {orgType === 'Other' && (
                                <div style={{ animation: 'fadeIn 0.3s ease' }}>
                                    <label style={labelStyle}>Organization Name {requiredMark}</label>
                                    <input
                                        name="customOrganization"
                                        type="text"
                                        required
                                        style={inputStyle}
                                        onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                                        onBlur={(e) => e.target.style.borderColor = 'var(--color-text-muted)'}
                                    />
                                </div>
                            )}

                            {/* Organization Role */}
                            <div>
                                <label style={labelStyle}>Organization Role</label>
                                <input
                                    name="role"
                                    type="text"
                                    style={inputStyle}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                                    onBlur={(e) => e.target.style.borderColor = 'var(--color-text-muted)'}
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label style={labelStyle}>Phone {requiredMark}</label>
                                <input
                                    name="phone"
                                    type="tel"
                                    style={inputStyle}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                                    onBlur={(e) => e.target.style.borderColor = 'var(--color-text-muted)'}
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label style={labelStyle}>Email {requiredMark}</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    style={inputStyle}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                                    onBlur={(e) => e.target.style.borderColor = 'var(--color-text-muted)'}
                                />
                            </div>
                        </div>

                        {/* Right Column: Message, File, Calendar */}
                        <div style={{ display: 'grid', gap: 'var(--space-6)', alignContent: 'start' }}>

                            {/* Calendar Section */}
                            <div>
                                <label style={labelStyle}>Select Date (5:00 PM EST) {requiredMark}</label>
                                <div style={{
                                    backgroundColor: 'var(--color-surface)',
                                    padding: 'var(--space-4)',
                                    border: '1px solid var(--color-border)'
                                }}>
                                    <Calendar
                                        onChange={setDate}
                                        value={date}
                                        tileDisabled={isDateDisabled}
                                        className="industrial-calendar"
                                    />
                                    <div style={{
                                        marginTop: 'var(--space-4)',
                                        textAlign: 'center',
                                        color: 'var(--color-primary)',
                                        fontWeight: 700,
                                        fontSize: 'var(--text-sm)'
                                    }}>
                                        {date instanceof Date && !isDateDisabled({ date })
                                            ? `Selected: ${date.toDateString()} @ 5:00 PM EST`
                                            : 'Please select an available date'}
                                    </div>
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <label style={labelStyle}>Message {requiredMark}</label>
                                <textarea
                                    name="message"
                                    rows={4}
                                    placeholder="I am looking to buy 50 rush shirts with our letters embroidered with this design..."
                                    style={{ ...inputStyle, resize: 'vertical' }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                                    onBlur={(e) => e.target.style.borderColor = 'var(--color-text-muted)'}
                                />
                            </div>

                            {/* File Upload */}
                            <div>
                                <label style={labelStyle}>
                                    Upload Design <span style={{ opacity: 0.6, textTransform: 'none' }}>(Optional)</span>
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            opacity: 0,
                                            cursor: 'pointer',
                                            zIndex: 2
                                        }}
                                    />
                                    <div style={{
                                        border: '2px dashed var(--color-text-muted)',
                                        padding: 'var(--space-4)',
                                        textAlign: 'center',
                                        backgroundColor: 'var(--color-surface)',
                                        transition: 'all 0.2s ease'
                                    }}>
                                        <div style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)' }}>📁</div>
                                        <div style={{ color: 'var(--color-text-main)', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                                            {fileName || 'Click or Drag to Upload'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div style={{ marginTop: 'var(--space-2)' }}>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{ width: '100%', padding: 'var(--space-4)' }}
                                    disabled={isSubmitted}
                                >
                                    {isSubmitted ? 'Request Sent!' : 'Confirm Meeting'}
                                </button>
                            </div>
                        </div>

                    </form>
                </Reveal>
            </div>
        </section>
    );
};

export default BookMeeting;
