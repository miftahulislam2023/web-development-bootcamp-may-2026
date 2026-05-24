import React from "react";
import CommonPageHeader from "../../components/CommonPageHeader";
import { Mail, MapPin, Phone } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-base-100 py-20">
      <CommonPageHeader
        title="Get in Touch"
        subtitle="We'd love to hear from you. Send us a message."
      />

      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="p-8 rounded-3xl bg-base-200/50 border border-base-content/5">
            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Mail />
                </div>
                <div>
                  <p className="text-xs font-bold opacity-50 uppercase">
                    Email
                  </p>
                  <p className="font-medium">support@moviemaster.pro</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Phone />
                </div>
                <div>
                  <p className="text-xs font-bold opacity-50 uppercase">
                    Phone
                  </p>
                  <p className="font-medium">+1 (555) 000-0000</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin />
                </div>
                <div>
                  <p className="text-xs font-bold opacity-50 uppercase">
                    Office
                  </p>
                  <p className="font-medium">Dhaka, Bangladesh</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form className="p-8 rounded-3xl bg-base-100 shadow-xl border border-base-content/10 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl bg-base-200 border-transparent focus:border-primary focus:bg-base-100 transition-all outline-none"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-xl bg-base-200 border-transparent focus:border-primary focus:bg-base-100 transition-all outline-none"
                placeholder="john@example.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold ml-1">Message</label>
            <textarea
              rows="4"
              className="w-full px-4 py-3 rounded-xl bg-base-200 border-transparent focus:border-primary focus:bg-base-100 transition-all outline-none"
              placeholder="How can we help?"
            ></textarea>
          </div>
          <button className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-primary/20">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};
export default Contact;
