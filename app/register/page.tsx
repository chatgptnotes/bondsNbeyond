'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ToastProvider';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhoneIcon from '@mui/icons-material/Phone';
import Navbar from '@/components/landing/Navbar';

// Icon aliases
const Mail = EmailIcon;
const Lock = LockIcon;
const Eye = VisibilityIcon;
const EyeOff = VisibilityOffIcon;
const User = PersonIcon;
const ArrowLeft = ArrowBackIcon;
const Phone = PhoneIcon;

export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [registrationType, setRegistrationType] = useState<'email' | 'mobile'>('email');
  const [countryCode, setCountryCode] = useState('+91');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';

    if (registrationType === 'email') {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
    } else {
      if (!formData.mobile.trim()) {
        newErrors.mobile = 'Mobile number is required';
      } else if (!/^\d{7,15}$/.test(formData.mobile.replace(/\s/g, ''))) {
        newErrors.mobile = 'Invalid mobile number';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const requestBody = registrationType === 'email'
        ? { email: formData.email, firstName: formData.firstName, lastName: formData.lastName }
        : { mobile: `${countryCode}${formData.mobile}`, firstName: formData.firstName, lastName: formData.lastName };

      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.devOtp) {
          alert(`📱 Your verification code is:\n\n${data.devOtp}\n\nPlease copy this code for the next step.`);
        } else {
          const medium = registrationType === 'email' ? 'email' : 'mobile number';
          showToast(`Verification code sent to your ${medium}!`, 'success');
        }
        localStorage.setItem('registrationData', JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: registrationType === 'email' ? formData.email : '',
          mobile: registrationType === 'mobile' ? `${countryCode}${formData.mobile}` : '',
          password: formData.password,
          registrationType
        }));
        router.push('/verify-register');
      } else {
        showToast(data.error || 'Failed to send verification code', 'error');
      }
    } catch (error) {
      console.error('Registration error:', error);
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Background Section (Left) */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-gray-100">
        <div className="absolute inset-0">
          {/* Using the same background or a new one.  */}
          <img src="/landing-bg.jpg" alt="Art Studio" className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-center px-12 text-white">
          <h1 className="text-5xl font-serif font-medium mb-6 leading-tight">Join Our <br /> Artistic Community</h1>
          <p className="text-lg font-light tracking-wide opacity-90">Create, collect, and cherish timeless portraits.</p>
        </div>
      </div>

      {/* Form Section (Right) */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-white relative">
        <div className="absolute top-6 left-6 lg:hidden">
          {/* Mobile back button */}
          <Link href="/" className="text-gray-900 hover:text-gray-600 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
        </div>

        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-10">
            <h2 className="text-3xl font-serif font-bold text-gray-900 tracking-tight">Create Account</h2>
            <p className="mt-2 text-sm text-gray-500">
              Already a member?{' '}
              <Link href="/login" className="font-medium text-black underline hover:text-gray-700 transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mb-8">
            <div className="flex border-b border-gray-200">
              <button
                type="button"
                onClick={() => setRegistrationType('email')}
                className={`flex-1 pb-4 text-sm font-medium transition-all relative ${registrationType === 'email' ? 'text-black' : 'text-gray-400 hover:text-gray-600'
                  }`}
              >
                Email
                {registrationType === 'email' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />}
              </button>
              <button
                type="button"
                onClick={() => setRegistrationType('mobile')}
                className={`flex-1 pb-4 text-sm font-medium transition-all relative ${registrationType === 'mobile' ? 'text-black' : 'text-gray-400 hover:text-gray-600'
                  }`}
              >
                Mobile
                {registrationType === 'mobile' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />}
              </button>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">First Name</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="appearance-none block w-full px-0 py-2 border-b border-gray-300 placeholder-gray-300 text-gray-900 focus:outline-none focus:border-black transition-colors sm:text-sm"
                  placeholder="Jane"
                />
                {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="appearance-none block w-full px-0 py-2 border-b border-gray-300 placeholder-gray-300 text-gray-900 focus:outline-none focus:border-black transition-colors sm:text-sm"
                  placeholder="Doe"
                />
                {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
              </div>
            </div>

            {registrationType === 'email' ? (
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="appearance-none block w-full px-0 py-2 border-b border-gray-300 placeholder-gray-300 text-gray-900 focus:outline-none focus:border-black transition-colors sm:text-sm"
                  placeholder="jane@example.com"
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>
            ) : (
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Mobile Number</label>
                <div className="flex">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="appearance-none py-2 pr-2 border-b border-gray-300 text-gray-900 focus:outline-none bg-transparent sm:text-sm"
                  >
                    <option value="+91">+91</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                  </select>
                  <input
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/[^0-9]/g, '') })}
                    className="flex-1 appearance-none block w-full px-0 py-2 border-b border-gray-300 placeholder-gray-300 text-gray-900 focus:outline-none focus:border-black transition-colors sm:text-sm ml-2"
                    placeholder="1234567890"
                  />
                </div>
                {errors.mobile && <p className="mt-1 text-xs text-red-600">{errors.mobile}</p>}
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="appearance-none block w-full px-0 py-2 border-b border-gray-300 placeholder-gray-300 text-gray-900 focus:outline-none focus:border-black transition-colors sm:text-sm pr-10"
                  placeholder="Min 6 chars"
                />
                <button
                  type="button"
                  className="absolute right-0 top-0 mt-2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="appearance-none block w-full px-0 py-2 border-b border-gray-300 placeholder-gray-300 text-gray-900 focus:outline-none focus:border-black transition-colors sm:text-sm pr-10"
                  placeholder="Repeat password"
                />
                <button
                  type="button"
                  className="absolute right-0 top-0 mt-2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
