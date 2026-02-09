import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, UserPlus, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ACADEMIC_YEARS, YEAR_LABELS, CLASS_SECTIONS } from '@/lib/constants';
import { AcademicYear, ClassSection } from '@/types';
import { useToast } from '@/hooks/use-toast';

// UCS Mandalay student ID format: KPTM-XXXXX
const UCS_ID_PATTERN = /^KPTM-\d{5}$/;
const UCS_EMAIL_DOMAIN = '@ucsm.edu.mm';

export default function StudentRegister() {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [year, setYear] = useState<AcademicYear>(1);
  const [section, setSection] = useState<ClassSection>('A');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Full name is required';
    if (name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';

    if (!UCS_ID_PATTERN.test(studentId)) {
      newErrors.studentId = 'Invalid Student ID. Format: KPTM-XXXXX (5 digits)';
    }

    if (!email.endsWith(UCS_EMAIL_DOMAIN)) {
      newErrors.email = `Email must end with ${UCS_EMAIL_DOMAIN}`;
    }

    if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate registration
    await new Promise((r) => setTimeout(r, 1200));
    setIsSubmitting(false);

    toast({
      title: 'Account Created',
      description: 'Your UCS (Mandalay) student account has been registered. You can now log in.',
    });
    navigate('/student/login');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-primary/5 to-background" />
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 gold-glow">
              <GraduationCap className="h-10 w-10 text-primary" />
            </div>
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">
              UCS <span className="text-gradient-gold">Mandalay</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-sm">
              University of Computer Studies — Academic Suite Registration
            </p>
            <div className="separator-gold max-w-xs mx-auto mt-8" />
            <p className="text-xs text-muted-foreground mt-4 uppercase tracking-widest">
              Academic Year 2026
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center justify-between mb-8">
            <Link to="/student/login" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
            <ThemeToggle />
          </div>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground">Create Account</h1>
            <p className="text-muted-foreground mt-2">UCS (Mandalay) students only</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., John Saw Min"
                className="input-luxury mt-1"
              />
              {errors.name && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="studentId">Student ID</Label>
              <Input
                id="studentId"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                placeholder="KPTM-XXXXX"
                className="input-luxury mt-1"
              />
              {errors.studentId && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.studentId}</p>}
              {UCS_ID_PATTERN.test(studentId) && <p className="text-xs text-status-approved mt-1 flex items-center gap-1"><CheckCircle className="h-3 w-3" />Valid UCS ID format</p>}
            </div>

            <div>
              <Label htmlFor="email">University Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={`yourname${UCS_EMAIL_DOMAIN}`}
                className="input-luxury mt-1"
              />
              {errors.email && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.email}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Academic Year</Label>
                <Select onValueChange={(v) => setYear(Number(v) as AcademicYear)} defaultValue="1">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ACADEMIC_YEARS.map((y) => (
                      <SelectItem key={y} value={String(y)}>{YEAR_LABELS[y]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Section</Label>
                <Select onValueChange={(v) => setSection(v as ClassSection)} defaultValue="A">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CLASS_SECTIONS.map((s) => (
                      <SelectItem key={s} value={s}>Class {s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="input-luxury mt-1"
              />
              {errors.password && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.password}</p>}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="input-luxury mt-1"
              />
              {errors.confirmPassword && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.confirmPassword}</p>}
            </div>

            <Button type="submit" className="w-full btn-luxury shine gap-2 mt-6" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Only students from <span className="font-medium text-primary">UCS (Mandalay)</span> are eligible to register.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
