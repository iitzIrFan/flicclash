"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type FaqItem = {
  question: string;
  answer: string | React.ReactNode;
};

const faqs: FaqItem[] = [
  {
    question: "What is Liinn and how does it work?",
    answer:
      "Liinn is a modern mental health platform that connects you with licensed therapists. Our platform provides secure video sessions, messaging, and personalized resources to support your mental wellness journey.",
  },
  {
    question: "How can I start therapy with Liinn?",
    answer: (
      <div>
        Starting therapy with Liinn is easy! Create an account, complete a brief
        assessment, and explore therapists that match your preferences. Schedule
        your first session and begin your journey to mental wellness.
      </div>
    ),
  },
  {
    question: "Are Liinn's therapists licensed and qualified?",
    answer:
      "Yes, all therapists on our platform are fully licensed mental health professionals. We verify credentials, conduct background checks, and ensure all providers meet our rigorous standards for quality care.",
  },
  {
    question: "Is my information and conversation on Liinn confidential?",
    answer:
      "Absolutely. We maintain strict confidentiality standards that comply with HIPAA regulations. Your personal information and therapy conversations are encrypted and securely stored. We never share your data without your explicit consent.",
  },
  {
    question: "How do I choose the right therapist for me?",
    answer:
      "Our matching system helps you find therapists based on your specific needs, preferences, and goals. You can browse detailed profiles, specialties, and approaches before making your choice. If you're not satisfied, you can switch therapists at any time.",
  },
  {
    question: "What types of therapy does Liinn offer?",
    answer:
      "Liinn offers a wide range of therapy approaches including Cognitive Behavioral Therapy (CBT), Psychodynamic Therapy, Mindfulness-Based Therapy, Solution-Focused Therapy, and many more. Our therapists specialize in various areas such as anxiety, depression, relationships, trauma, and stress management.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(1); // Start with the second item open

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 relative overflow-hidden bg-[#f5f2e9]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16">
          <div className="md:w-1/3">
            <h2 className="text-4xl md:text-5xl font-medium text-gray-800 mb-6">
              Questions?
            </h2>

            <p className="text-gray-600 mb-8">
              If you have questions, we have answers for you here. In case we
              dont, please feel free to reach out to us here{" "}
              <a
                href="mailto:contact@liinn.com"
                className="text-gray-700 underline"
              >
                contact@liinn.com
              </a>
            </p>

            <h3 className="text-2xl font-medium text-gray-800 mb-4">
              General questions
            </h3>
          </div>

          <div className="md:w-2/3">
            <div className="space-y-1">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-300">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full py-5 text-left flex justify-between items-center focus:outline-none"
                  >
                    <span className="text-base font-medium text-gray-700">
                      {faq.question}
                    </span>
                    <span className="ml-6 flex-shrink-0">
                      {openIndex === index ? (
                        <svg
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v12M6 12h12"
                          />
                        </svg>
                      )}
                    </span>
                  </button>
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="pb-5 text-gray-600 text-sm">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
