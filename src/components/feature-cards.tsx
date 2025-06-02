import { Variants, motion } from "framer-motion";
import { Accessibility, Code, Eye, Globe, Shield, Smartphone, Sparkles, Target, Wand2, Zap } from "lucide-react";

import { Card } from "@/components/ui/card";

import { ShinyText } from "./ui/shiny-text";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const features = [
  {
    icon: Wand2,
    title: "AI-Powered Analysis",
    description:
      "Advanced AI analyzes your website's structure, design, and accessibility to identify modernization opportunities.",
    badge: "Core Feature",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Accessibility,
    title: "WCAG 2.1 AA Compliance",
    description:
      "Automatically implement accessibility best practices including proper ARIA labels, semantic HTML, and keyboard navigation.",
    badge: "Accessibility",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description:
      "Transform desktop-only websites into responsive, mobile-friendly experiences with modern CSS Grid and Flexbox.",
    badge: "Responsive",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Zap,
    title: "Performance Optimization",
    description:
      "Optimize images, minify CSS, implement lazy loading, and reduce bundle sizes for lightning-fast load times.",
    badge: "Performance",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: Eye,
    title: "Modern UI/UX Patterns",
    description:
      "Apply contemporary design patterns, color schemes, typography, and micro-interactions for engaging user experiences.",
    badge: "Design",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: Code,
    title: "Clean Code Generation",
    description: "Generate clean, semantic HTML5 and modern CSS3 with proper documentation and maintainable structure.",
    badge: "Development",
    gradient: "from-red-500 to-pink-500",
  },
  {
    icon: Globe,
    title: "Cross-Browser Compatible",
    description: "Ensure your modernized website works flawlessly across all modern browsers and devices.",
    badge: "Compatibility",
    gradient: "from-teal-500 to-blue-500",
  },
  {
    icon: Shield,
    title: "Security Enhancements",
    description: "Implement modern security practices including CSP headers, secure forms, and XSS protection.",
    badge: "Security",
    gradient: "from-gray-600 to-gray-800",
  },
  {
    icon: Target,
    title: "SEO Optimization",
    description: "Improve search engine rankings with proper meta tags, structured data, and semantic markup.",
    badge: "SEO",
    gradient: "from-lime-500 to-green-500",
  },
];
const FeatureCards = () => {
  return (
    <div className="space-y-16">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm"
        >
          <Sparkles className="h-4 w-4 text-purple-300" />
          <span className="text-sm font-medium text-purple-100">Powerful Features</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-4xl font-bold text-transparent md:text-5xl"
        >
          Everything You Need to Modernize
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mx-auto max-w-2xl text-xl text-gray-300"
        >
          Our comprehensive suite of tools transforms outdated websites into modern masterpieces
        </motion.p>
      </div>

      <motion.div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div variants={cardVariants} key={index}>
              <Card className="group border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div
                      className={`rounded-lg bg-gradient-to-r p-3 ${feature.gradient} shadow-lg transition-shadow duration-300 group-hover:shadow-xl`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <ShinyText
                      text={feature.badge}
                      className="flex cursor-pointer items-center justify-center gap-2 rounded-full border border-gray-700 bg-[#1a1a1a] px-4 py-1 text-xs font-medium text-[#0CF2A0] transition-colors hover:border-[#0CF2A0]/50 sm:text-sm"
                    />
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold text-white transition-colors group-hover:text-purple-200">
                      {feature.title}
                    </h3>
                    <p className="leading-relaxed text-gray-400">{feature.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          { number: "98%", label: "Faster Load Times" },
          { number: "AA", label: "WCAG Compliance" },
          { number: "100%", label: "Mobile Responsive" },
          { number: "24/7", label: "Available Online" },
        ].map((stat, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className="rounded-lg border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm"
          >
            <div className="mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
              {stat.number}
            </div>
            <div className="text-sm font-medium text-gray-300">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default FeatureCards;
