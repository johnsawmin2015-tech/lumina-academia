import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Shield, Calendar, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-semibold text-lg leading-tight text-foreground">
                Academic Suite
              </span>
              <span className="text-xs text-muted-foreground">Premium Edition</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild>
              <Link to="/student/login">Student Login</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/admin/login">Admin Portal</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/20" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-1/4 w-72 h-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="container relative z-10 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Premium Academic Management
            </div>

            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6 leading-tight">
              Premium Academic
              <span className="block text-gradient-gold">Suite</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              A luxury university timetable and academic management system. 
              Elegant design, powerful features, seamless experience.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="gap-2 px-8">
                <Link to="/admin/login">
                  <Shield className="h-5 w-5" />
                  Admin Portal
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="gap-2 px-8">
                <Link to="/student/login">
                  <GraduationCap className="h-5 w-5" />
                  Student Login
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-secondary/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Designed for Excellence
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every feature crafted with precision for the modern academic institution
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: 'Smart Scheduling',
                description: 'Card-based calendar view with intuitive filtering by year, class, and day.',
              },
              {
                icon: Shield,
                title: 'Admin Control',
                description: 'Full CRUD operations with approval workflow and schedule locking.',
              },
              {
                icon: CheckCircle,
                title: 'Approval Workflow',
                description: 'Draft, pending, approved, and locked status tracking for every schedule.',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center p-12 rounded-2xl bg-gradient-to-br from-primary/10 via-card to-primary/5 border border-primary/20"
          >
            <Clock className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Experience the premium academic management system designed for elite institutions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/admin/login">Enter Admin Portal</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/student/login">Student Access</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">
                Premium Academic Suite © 2024
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Designed for elite academic institutions
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
