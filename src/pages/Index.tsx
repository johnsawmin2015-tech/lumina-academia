import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Shield, Calendar, Clock, CheckCircle, ArrowRight, Sparkles, Users, Lock } from 'lucide-react';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { Button } from '@/components/ui/button';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Premium Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 glass"
      >
        <div className="container flex h-18 items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gold-gradient opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
              <GraduationCap className="h-6 w-6 text-primary relative z-10" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-semibold text-xl leading-tight text-foreground tracking-tight">
                Academic Suite
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-primary/80 font-medium">
                Premium Edition
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild className="hidden sm:flex text-muted-foreground hover:text-foreground">
              <Link to="/student/login">Student Access</Link>
            </Button>
            <Button size="sm" asChild className="gap-2 shadow-gold hover:shadow-gold-lg transition-shadow duration-300">
              <Link to="/admin/login">
                <Shield className="h-4 w-4" />
                Admin Portal
              </Link>
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Premium Background Effects */}
        <div className="absolute inset-0 bg-hero-pattern" />
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ y: [-8, 8, -8] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[100px]"
          />
          <motion.div
            animate={{ y: [8, -8, 8] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]"
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-primary/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary/8" />
        </div>

        <div className="container relative z-10 py-24 md:py-32">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto text-center"
          >
            {/* Premium Badge */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-primary/8 border border-primary/15 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">Premium Academic Management</span>
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 variants={itemVariants} className="mb-6">
              <span className="block font-display text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-[0.95] tracking-tight">
                Redefining
              </span>
              <span className="block font-display text-5xl md:text-7xl lg:text-8xl font-bold text-gradient-gold leading-[0.95] tracking-tight mt-2">
                Excellence
              </span>
            </motion.h1>

            {/* Decorative Separator */}
            <motion.div variants={itemVariants} className="flex items-center justify-center gap-4 my-8">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-primary/40" />
              <div className="w-2 h-2 rotate-45 bg-primary/60" />
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-primary/40" />
            </motion.div>

            {/* Subtitle */}
            <motion.p variants={itemVariants} className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              A luxury timetable management system crafted for 
              <span className="text-foreground font-normal"> elite academic institutions</span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="group gap-3 px-8 py-6 text-base btn-luxury shine">
                <Link to="/admin/login">
                  <Shield className="h-5 w-5" />
                  <span>Enter Admin Portal</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="gap-3 px-8 py-6 text-base btn-luxury-ghost">
                <Link to="/student/login">
                  <GraduationCap className="h-5 w-5" />
                  <span>Student Login</span>
                </Link>
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div variants={itemVariants} className="flex items-center justify-center gap-8 mt-16 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-status-approved" />
                <span>Secure Authentication</span>
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-border" />
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-status-locked" />
                <span>Role-Based Access</span>
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-border" />
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Premium Experience</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground/60">
            <span className="text-xs uppercase tracking-widest">Discover</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-5 h-8 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1"
            >
              <div className="w-1 h-2 rounded-full bg-primary" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 bg-gradient-to-b from-secondary/30 via-secondary/50 to-secondary/30">
        <div className="absolute inset-0 bg-hero-pattern opacity-50" />
        
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <span className="text-sm uppercase tracking-[0.25em] text-primary font-medium">Features</span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-4 mb-6">
              Designed for <span className="text-gradient-gold">Excellence</span>
            </h2>
            <div className="separator-gold max-w-xs mx-auto" />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            {[
              {
                icon: Calendar,
                title: 'Smart Scheduling',
                description: 'Elegant card-based calendar with intelligent filtering by academic year, class section, and day.',
                gradient: 'from-year-1/20 to-year-2/10',
              },
              {
                icon: Shield,
                title: 'Administrative Control',
                description: 'Complete CRUD operations with sophisticated approval workflows and schedule locking capabilities.',
                gradient: 'from-year-3/20 to-year-4/10',
              },
              {
                icon: Users,
                title: 'Role-Based Access',
                description: 'Dedicated portals for administrators and students with appropriate permissions and views.',
                gradient: 'from-year-4/20 to-year-5/10',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="group"
              >
                <div className="luxury-card p-8 lg:p-10 h-full">
                  {/* Icon Container */}
                  <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-8 group-hover:scale-105 transition-transform duration-500`}>
                    <div className="absolute inset-0 rounded-2xl border border-primary/10" />
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="font-display text-2xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Decorative Line */}
                  <div className="mt-8 pt-6 border-t border-border/50">
                    <div className="flex items-center gap-2 text-sm text-primary/80 group-hover:text-primary transition-colors">
                      <span className="font-medium">Learn more</span>
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="luxury-card p-12 lg:p-16"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
              {[
                { value: '5', label: 'Academic Years' },
                { value: '3', label: 'Class Sections' },
                { value: '∞', label: 'Schedule Entries' },
                { value: '24/7', label: 'Availability' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gradient-gold mb-3">
                    {stat.value}
                  </div>
                  <div className="text-sm uppercase tracking-widest text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/3" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[100px]" />

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-8 gold-glow">
              <Clock className="h-10 w-10 text-primary" />
            </div>

            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Ready to <span className="text-gradient-gold">Get Started?</span>
            </h2>

            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              Experience the premium academic management system designed exclusively for distinguished institutions.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="gap-2 btn-luxury">
                <Link to="/admin/login">
                  <Shield className="h-5 w-5" />
                  Enter Admin Portal
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="btn-luxury-ghost">
                <Link to="/student/login">
                  <GraduationCap className="h-5 w-5" />
                  Student Access
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 bg-secondary/20">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <span className="font-display font-semibold text-foreground">Academic Suite</span>
                <span className="text-xs text-muted-foreground ml-2">© 2024</span>
              </div>
            </div>

            <div className="separator-gold w-32 md:hidden" />

            <p className="text-sm text-muted-foreground text-center md:text-right">
              Crafted with precision for <span className="text-primary">elite institutions</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
